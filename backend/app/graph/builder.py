from datetime import datetime
from app.db.neo4j_client import db
from app.ontology.definitions import Mechanism

class GraphBuilder:
    """
    Dynamically constructs the Knowledge Graph for a specific event.
    Maps evidence to ontological relationships.
    """
    
    @staticmethod
    def construct_event_graph(event_data: dict, evidence: dict):
        """
        Main construction pipeline in Neo4j.
        """
        event_id = f"event_{int(datetime.utcnow().timestamp())}"
        
        # 1. Create/Merge Event Node
        query_event = """
        MERGE (e:Event {id: $id})
        SET e.name = $name,
            e.type = $type,
            e.severity = $severity,
            e.status = $status,
            e.summary = $summary,
            e.timestamp = datetime()
        RETURN e
        """
        db.run_query(query_event, {
            "id": event_id,
            "name": event_data["query_context" if "query_context" in event_data else "summary"],
            "type": event_data["event_type"],
            "severity": event_data["severity"],
            "status": event_data["status"],
            "summary": event_data["summary"]
        })

        # 2. Link Countries
        query_country = """
        MATCH (e:Event {id: $event_id})
        MERGE (c:Country {id: $country_id})
        ON CREATE SET c.name = $country_name
        MERGE (e)-[r:AFFECTS {
            strength: 0.9,
            confidence: 0.95,
            source: 'Entity Extraction',
            timestamp: datetime()
        }]->(c)
        """
        for country in event_data.get("countries", []):
            db.run_query(query_country, {
                "event_id": event_id,
                "country_id": country.lower().replace(" ", "_"),
                "country_name": country
            })

        # 3. Link Mechanisms & Their Downstream Impacts
        # This is where the ONTOLOGY meets the DATA
        query_mechanism = """
        MATCH (e:Event {id: $event_id})
        MERGE (m:Mechanism {id: $mech_id})
        ON CREATE SET m.name = $mech_name
        MERGE (e)-[r:TRIGGERS {
            strength: 1.0,
            confidence: 0.9,
            source: 'Ontology Engine',
            timestamp: datetime()
        }]->(m)
        
        // Link Mechanism to pre-seeded Industries/Commodities
        WITH m, e
        MATCH (i:Industry)-[:VULNERABLE_TO]->(m)
        MERGE (e)-[impact:INITIAL_IMPACT]->(i)
        ON CREATE SET impact.strength = 0.5, impact.confidence = 0.8
        """
        for mech in event_data.get("mechanisms", []):
            db.run_query(query_mechanism, {
                "event_id": event_id,
                "mech_id": mech.value if hasattr(mech, 'value') else str(mech),
                "mech_name": mech.value.replace("_", " ").title() if hasattr(mech, 'value') else str(mech)
            })

        # 4. Integrate Market Evidence
        query_market = """
        MATCH (e:Event {id: $event_id})
        MERGE (c:Commodity {id: $comm_id})
        SET c.price = $price, c.change = $change
        MERGE (e)-[r:SIGNALED_BY {
            strength: $strength,
            source: 'Yahoo Finance',
            timestamp: datetime()
        }]->(c)
        """
        market_signals = evidence.get("market_signals", {})
        for symbol, data in market_signals.items():
            db.run_query(query_market, {
                "event_id": event_id,
                "comm_id": symbol.lower(),
                "price": data["price"],
                "change": data["change_5d_pct"],
                "strength": abs(data["change_5d_pct"]) / 100.0 # Normalize strength
            })

        return event_id
