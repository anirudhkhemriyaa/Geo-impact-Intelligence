import os
import json
import httpx
from typing import List, Dict, Any
from app.ontology.definitions import EventCategory, Mechanism
from app.retries.exponential_backoff import retry_with_backoff

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

class ExpansionEngine:
    """
    ANTI-EVENT-NODE ENGINE
    Triggers fallback expansion if entity extraction is sparse.
    Follows required levels: Geo, Industry, Commodity, Historical, 2nd Order.
    """
    
    @staticmethod
    async def expand_impacts(event_data: Dict[str, Any], current_nodes: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Orchestrates expansion levels to meet nodes/edges requirements.
        """
        expanded_nodes = list(current_nodes)
        
        # LEVEL 1: Geographic Dependencies
        geo_nodes = ExpansionEngine._expand_geo(event_data)
        expanded_nodes.extend(geo_nodes)
        
        # LEVEL 2: Industry Exposure
        industry_nodes = ExpansionEngine._expand_industry(event_data)
        expanded_nodes.extend(industry_nodes)
        
        # LEVEL 3: Commodity Dependencies
        commodity_nodes = ExpansionEngine._expand_commodity(event_data)
        expanded_nodes.extend(commodity_nodes)
        
        # LEVEL 4: Historical Analog Reasoning (LLM Assisted)
        if OPENROUTER_API_KEY:
            historical_nodes = await ExpansionEngine._expand_historical(event_data)
            expanded_nodes.extend(historical_nodes)
            
        return expanded_nodes

    @staticmethod
    def _expand_geo(event_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """LEVEL 1: Expand geographic dependencies"""
        region = event_data.get("region", "Global")
        # Logic to expand based on region/country
        # e.g., India -> logistics hubs, agriculture exposure
        expansions = []
        if "India" in event_data.get("countries", []):
            expansions.append({
                "id": "regional_logistics_hubs",
                "name": "Regional Logistics Hubs",
                "impact_score": -30,
                "confidence": 0.8,
                "order": 2,
                "reasoning_chain": ["Event", "India", "Logistics"],
                "explanation": "Disruption to local supply chains and transport networks."
            })
        return expansions

    @staticmethod
    def _expand_industry(event_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """LEVEL 2: Expand industry exposure"""
        category = event_data.get("event_type")
        expansions = []
        if category == "war":
            expansions.append({
                "id": "defense_manufacturing",
                "name": "Defense Manufacturing",
                "impact_score": 40,
                "confidence": 0.9,
                "order": 2,
                "reasoning_chain": ["Event", "Industry", "Defense"],
                "explanation": "Increased demand for strategic defense systems and equipment."
            })
        return expansions

    @staticmethod
    def _expand_commodity(event_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """LEVEL 3: Expand commodity dependencies"""
        expansions = []
        if "oil" in event_data.get("summary", "").lower():
            expansions.append({
                "id": "refined_petroleum_products",
                "name": "Refined Petroleum",
                "impact_score": -25,
                "confidence": 0.85,
                "order": 2,
                "reasoning_chain": ["Event", "Commodity", "Energy"],
                "explanation": "Downstream pricing pressure on fuel and chemical feedstocks."
            })
        return expansions

    @staticmethod
    async def _expand_historical(event_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """LEVEL 4: Historical analog reasoning"""
        # Call LLM to find historical analogues and extract patterns
        prompt = (
            f"Given the event: {event_data['summary']}, identify one similar historical event. "
            f"Extract 2 common second-order impact nodes that occurred in the historical case. "
            f"Format: JSON list with fields: id, name, impact_score (float), confidence (float), reasoning_chain (list), explanation."
        )
        
        try:
             async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://openrouter.ai/api/v1/chat/completions",
                    headers={"Authorization": f"Bearer {OPENROUTER_API_KEY}"},
                    json={
                        "model": "google/gemini-2.0-flash-exp:free",
                        "messages": [{"role": "user", "content": prompt}],
                        "response_format": {"type": "json_object"}
                    },
                    timeout=15.0
                )
                if response.status_code == 200:
                    data = response.json()
                    content = data["choices"][0].get("message", {}).get("content", "[]")
                    nodes = json.loads(content)
                    if isinstance(nodes, dict):
                         nodes = list(nodes.values())[0]
                    return nodes
        except Exception:
            return []
        return []
