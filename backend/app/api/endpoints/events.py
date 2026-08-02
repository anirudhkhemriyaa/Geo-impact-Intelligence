from fastapi import APIRouter
from pydantic import BaseModel
from typing import Any, Dict, List

from app.services.event_understanding import structure_event
from app.services.data_collector import DataCollector
from app.services.event_verification import verify_event_from_evidence
from app.services.entity_extraction import extract_entities
from app.graph.builder import GraphBuilder
from app.graph.propagation import PropagationEngine
from app.scoring.engine import ScoringEngine
from app.scoring.sufficiency import (
    EvidenceSufficiencyEngine,
    GraphRenderMode,
    PropagationMode,
    SufficiencyLevel,
)
from app.explainability.narrator import IntelNarrator
from app.validation.graph_validator import GraphValidator
from app.ontology.definitions import EventCategory

router = APIRouter()


class SearchRequest(BaseModel):
    query: str


def _flatten_sources(evidence: Dict[str, Any]) -> List[Dict[str, Any]]:
    sources: List[Dict[str, Any]] = []
    for art in (evidence.get("news") or [])[:8]:
        sources.append({
            "title": art.get("title") or "News signal",
            "source": art.get("source") or "NewsAPI",
            "url": art.get("url"),
            "timestamp": art.get("publishedAt"),
        })
    for art in (evidence.get("gdelt") or [])[:8]:
        sources.append({
            "title": art.get("title") or art.get("name") or "GDELT signal",
            "source": "GDELT",
            "url": art.get("url") or art.get("shareimage"),
            "timestamp": art.get("seendate") or art.get("date"),
        })
    for d in (evidence.get("disasters") or [])[:4]:
        sources.append({
            "title": d.get("name") or d.get("title") or "Disaster signal",
            "source": "ReliefWeb / USGS",
            "url": d.get("url"),
            "timestamp": d.get("date"),
        })
    return sources


def _build_graph_payload(
    query: str,
    nodes: List[Dict[str, Any]],
    enabled: bool,
) -> Dict[str, Any]:
    if not enabled or not nodes:
        return {"enabled": False, "nodes": [], "edges": []}

    root = {
        "id": "event",
        "name": query,
        "type": "event",
        "impact_score": 0,
        "confidence": 1.0,
        "explanation": "Primary intelligence event analysis target.",
        "citations": [],
        "order": 0,
        "reasoning_chain": ["Event"],
    }
    graph_nodes = [root] + nodes
    node_ids = {n["id"] for n in graph_nodes}
    edges: List[Dict[str, Any]] = []

    for node in nodes:
        chain = node.get("reasoning_chain", [])
        if len(chain) < 2:
            if "event" in node_ids:
                edges.append({
                    "edge_id": f"event-{node['id']}",
                    "source": "event",
                    "target": node["id"],
                    "type": "Observed",
                })
            continue
        path_ids = ["event"]
        for step in chain[1:]:
            sid = step.lower().replace(" ", "_")
            if sid in node_ids:
                path_ids.append(sid)
        for i in range(len(path_ids) - 1):
            u, v = path_ids[i], path_ids[i + 1]
            edge_id = f"{u}-{v}"
            if not any(e.get("edge_id") == edge_id for e in edges):
                edges.append({
                    "edge_id": edge_id,
                    "source": u,
                    "target": v,
                    "type": "Causal Path" if i > 0 else "Direct",
                })

    if len(graph_nodes) >= 2 and not edges:
        for node in nodes:
            if node.get("order", 1) == 1:
                edges.append({
                    "edge_id": f"event-{node['id']}",
                    "source": "event",
                    "target": node["id"],
                    "type": "Direct",
                })

    return {"enabled": True, "nodes": graph_nodes, "edges": edges}


def _suggestions(query: str) -> List[str]:
    return [
        "Check spelling and use widely reported event names",
        "Add region or date context (e.g. 'India floods 2024')",
        "Try broader phrasing: 'Red Sea shipping disruption' instead of niche labels",
        f"Retry with alternate wording related to: {query[:40]}",
    ]


@router.post("/analyze")
async def analyze_event_pipeline(request: SearchRequest):
    """
    Production intelligence pipeline with graceful degradation under uncertainty.
    """
    query = (request.query or "").strip()
    if not query:
        return {
            "success": False,
            "case": "invalid_query",
            "message": "Please enter an event to analyze.",
            "suggestions": ["Enter a real-world event name or headline"],
        }

    try:
        event_data = await structure_event(query)
        event_data["query_context"] = query

        try:
            event_type = EventCategory(event_data.get("event_type", "political_instability"))
        except ValueError:
            event_type = EventCategory.POLITICAL_INSTABILITY

        collection = await DataCollector.collect_intelligence(query, event_type)
        evidence = collection["evidence"]
        source_health = collection["source_health"]

        entities = extract_entities(
            query + " " + event_data.get("summary", "")
        )

        verified, relevance, verify_reason = verify_event_from_evidence(query, evidence)

        if not verified:
            return {
                "success": True,
                "case": "event_not_found",
                "message": "We could not verify this event from reliable sources.",
                "event": {
                    "title": query,
                    "severity": event_data.get("severity", "unknown"),
                    "region": event_data.get("region", "Unknown"),
                    "status": event_data.get("status", "unverified"),
                    "confidence": 0,
                    "summary": verify_reason,
                },
                "evidence_quality": {
                    "sufficiency": SufficiencyLevel.INSUFFICIENT.value,
                    "score": 0,
                    "explanation": verify_reason,
                    "relevance_pct": relevance,
                },
                "graph": {"enabled": False, "nodes": [], "edges": []},
                "entities": entities,
                "impacts": {"direct": [], "indirect": [], "beneficiaries": []},
                "sources": _flatten_sources(evidence),
                "source_health": source_health,
                "searched_sources": list(source_health.keys()),
                "suggestions": _suggestions(query),
                "retry_available": True,
            }

        event_id = f"local_{hash(query) % 10**8}"
        try:
            event_id = GraphBuilder.construct_event_graph(event_data, evidence) or event_id
        except Exception as neo_err:
            print(f"Neo4j optional path skipped: {neo_err}")

        prelim_nodes: List[Dict[str, Any]] = []
        propagation_mode = PropagationMode.DIRECT_ONLY

        sufficiency_pre = EvidenceSufficiencyEngine.assess(
            evidence=evidence,
            entities=entities,
            event_verified=True,
        )
        propagation_mode = sufficiency_pre.propagation_mode

        raw_impacts = PropagationEngine.calculate_cascades(
            event_id, event_data, mode=propagation_mode
        )
        scored_nodes = ScoringEngine.normalize_scores(raw_impacts, evidence)

        if sufficiency_pre.level != SufficiencyLevel.INSUFFICIENT:
            scored_nodes = await IntelNarrator.generate_full_briefing(
                scored_nodes, event_data
            )

        avg_conf = (
            sum(n.get("confidence", 0) for n in scored_nodes) / len(scored_nodes)
            if scored_nodes
            else 0.0
        )

        graph_pre = _build_graph_payload(query, scored_nodes, enabled=True)
        assessment = EvidenceSufficiencyEngine.assess(
            evidence=evidence,
            entities=entities,
            event_verified=True,
            node_count=len(graph_pre.get("nodes", [])),
            edge_count=len(graph_pre.get("edges", [])),
            avg_confidence=avg_conf,
        )

        case = "verified"
        message = assessment.explanation

        if assessment.level == SufficiencyLevel.INSUFFICIENT:
            case = "insufficient_evidence"
            message = (
                "Not enough evidence exists to generate a reliable impact graph."
            )
            graph_payload = {"enabled": False, "nodes": [], "edges": []}
        else:
            graph_enabled = assessment.graph_mode != GraphRenderMode.DISABLED
            graph_payload = _build_graph_payload(
                query, scored_nodes, enabled=graph_enabled
            )
            quality = GraphValidator.assess_graph(graph_payload)

            if (
                assessment.graph_mode == GraphRenderMode.SIMPLIFIED
                or quality["simplified_recommended"]
            ):
                case = "limited_graph"
                message = (
                    "Limited relationship data available. "
                    "Showing simplified graph with directly observed entities."
                )
                direct_only = [n for n in scored_nodes if n.get("order", 1) <= 1]
                graph_payload = _build_graph_payload(
                    query, direct_only[:12], enabled=True
                )

        if collection.get("partial"):
            case = "partial_api" if case == "verified" else case
            message += " Some data sources were unavailable; analysis uses partial signals."

        reasoning = [
            {
                "id": n["id"],
                "reasoning_chain": n.get("reasoning_chain", []),
                "confidence": n.get("confidence", 0),
            }
            for n in scored_nodes[:20]
        ]

        event_confidence = min(
            98,
            max(
                15,
                int(assessment.score * 0.7 + relevance * 0.3),
            ),
        )

        return {
            "success": True,
            "case": case,
            "message": message,
            "event": {
                "title": query,
                "category": event_data.get("event_type", "unknown"),
                "severity": event_data.get("severity", "medium"),
                "region": event_data.get("region", "Global"),
                "status": event_data.get("status", "ongoing"),
                "confidence": event_confidence,
                "summary": event_data.get("summary", ""),
                "timeline": event_data.get("timeline"),
                "geographic_scope": event_data.get("countries", []),
            },
            "evidence_quality": {
                **assessment.to_dict(),
                "signal_count": collection.get("signal_count", 0),
                "independent_sources": GraphValidator.count_independent_signals(evidence),
                "relevance_pct": relevance,
                "verification": verify_reason,
            },
            "graph": {
                **graph_payload,
                "mode": assessment.graph_mode.value,
            },
            "entities": entities,
            "impacts": {
                "direct": [n for n in scored_nodes if n.get("order") == 1],
                "indirect": [n for n in scored_nodes if n.get("order", 0) > 1],
                "beneficiaries": [
                    n for n in scored_nodes if n.get("impact_score", 0) > 5
                ],
            },
            "reasoning": reasoning,
            "sources": _flatten_sources(evidence),
            "source_health": source_health,
            "searched_sources": list(source_health.keys()),
            "suggestions": _suggestions(query) if case != "verified" else [],
            "retry_available": True,
        }

    except Exception as e:
        print(f"Pipeline Error: {e}")
        return {
            "success": False,
            "case": "system_error",
            "message": (
                "Analysis encountered an internal error. "
                "No graph was produced. Please retry."
            ),
            "error_detail": str(e),
            "graph": {"enabled": False, "nodes": [], "edges": []},
            "retry_available": True,
            "suggestions": _suggestions(query),
        }


@router.get("/health")
async def health_check():
    return {
        "status": "GEOIMPACT_READY",
        "engine": "production_v2_uncertainty",
        "principles": ["graceful_degradation", "truth_over_completeness"],
    }
