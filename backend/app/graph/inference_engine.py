from typing import List, Dict, Any
from app.ontology.definitions import Mechanism

class DynamicInferenceEngine:
    """
    DYNAMIC CAUSAL REPOSITORY
    Maps global systemic mechanisms to influenced entities/sectors.
    NO hardcoded events. Only systemic causality.
    """
    
    MECHANISM_IMPACT_MAP = {    
        Mechanism.MILITARY_ESCALATION: [
            {"id": "defense_sector", "name": "Aerospace & Defense Index", "score_v": 0.9, "reason": "Increased procurement demand"},
            {"id": "oil_markets", "name": "Global Energy Benchmark", "score_v": 0.8, "reason": "Regional supply risk premium"},
            {"id": "sovereign_yields", "name": "Institutional Bond Yields", "score_v": 0.4, "reason": "Safe-haven asset reallocation"},
            {"id": "cyber_security_firms", "name": "Cyber Defense Portfolios", "score_v": 0.75, "reason": "Heightened state-actor threat monitoring"},
            {"id": "global_reinsurance", "name": "Risk Insurance Premiums", "score_v": -0.6, "reason": "Actuarial reassessment of war risk"}
        ],
        Mechanism.SHIPPING_DISRUPTION: [
            {"id": "logistics_costs", "name": "Global Freight Index", "score_v": -0.95, "reason": "Route diversion and insurance escalation"},
            {"id": "retail_inventory", "name": "Consumer Goods Inventory", "score_v": -0.7, "reason": "Supply chain throughput latency"},
            {"id": "port_congestion", "name": "Port Operations Efficiency", "score_v": -0.85, "reason": "Operational bottlenecks"},
            {"id": "marine_fuel_prices", "name": "Bunker Fuel Costs", "score_v": 0.5, "reason": "Longer sailing distances drive fuel consumption"},
            {"id": "empty_container_availability", "name": "Container Leasing Index", "score_v": -0.8, "reason": "Equipment imbalance across global hubs"}
        ],
        Mechanism.SANCTIONS_RISK: [
            {"id": "trade_volume", "name": "Bilateral Trade Index", "score_v": -0.8, "reason": "Regulatory compliance restrictions"},
            {"id": "tech_access", "name": "Strategic Technology Access", "score_v": -0.9, "reason": "Export control limitations"},
            {"id": "financial_conduits", "name": "Cross-border Payment Flow", "score_v": -0.75, "reason": "Interbank settlement risk"},
            {"id": "subsidiary_operations", "name": "MNC Foreign Assets", "score_v": -0.65, "reason": "Exposure to secondary sanction penalties"},
            {"id": "grey_market_expansion", "name": "Parallel Import Channels", "score_v": 0.4, "reason": "Evasion strategies drive unofficial trade"}
        ],
        Mechanism.ENERGY_SUPPLY_RISK: [
            {"id": "manufacturing_output", "name": "Industrial Production Index", "score_v": -0.85, "reason": "Energy input cost escalation"},
            {"id": "household_utility_costs", "name": "Cost of Living Index", "score_v": -0.7, "reason": "Direct pass-through of energy spikes"},
            {"id": "green_transition_speed", "name": "Renewable Investment Pace", "score_v": 0.6, "reason": "Accelerated push for energy autonomy"},
            {"id": "natural_gas_storage", "name": "Strategic Reserve Stability", "score_v": -0.9, "reason": "Critical inventory depletion risk"},
            {"id": "energy_intensive_industries", "name": "Aluminum & Steel Smelters", "score_v": -0.8, "reason": "Inability to hedge high spot prices"}
        ],
        Mechanism.REGIONAL_INSTABILITY: [
            {"id": "emerging_market_equity", "name": "EM Market Index", "score_v": -0.8, "reason": "Capital flight from volatile regions"},
            {"id": "tourism_revenue", "name": "Regional Hospitality Index", "score_v": -0.9, "reason": "Security-driven travel decline"},
            {"id": "remittance_flows", "name": "Cross-border Personal Transfers", "score_v": -0.5, "reason": "Disruption to migrant labor networks"},
            {"id": "infrastructure_fdi", "name": "Foreign Direct Investment", "score_v": -0.7, "reason": "Risk-off sentiment in regional project finance"}
        ],
        Mechanism.INFRASTRUCTURE_DAMAGE: [
            {"id": "construction_sector", "name": "Global Infrastructure Demand", "score_v": 0.8, "reason": "Reconstruction and grid hardening"},
            {"id": "local_utilities", "name": "Regional Power & Water", "score_v": -0.95, "reason": "Direct physical destruction"},
            {"id": "telecom_connectivity", "name": "Regional Digital Backbone", "score_v": -0.85, "reason": "Physical layer damage to fiber/towers"}
        ],
        Mechanism.LIQUIDITY_CRUNCH: [
            {"id": "credit_availability", "name": "Commercial Loan Volume", "score_v": -0.85, "reason": "Interbank trust erosion"},
            {"id": "small_business_stability", "name": "SME Solvency Index", "score_v": -0.75, "reason": "Working capital depletion"},
            {"id": "central_bank_intervention", "name": "Monetary Policy Emergency", "score_v": -0.9, "reason": "Direct liquidity injections required"}
        ],
        Mechanism.FLIGHT_CANCELLATIONS: [
            {"id": "civil_aviation_sector", "name": "Airline Profitability", "score_v": -0.8, "reason": "Airspace closures and demand shock"},
            {"id": "business_travel_index", "name": "Corporate Mobility", "score_v": -0.7, "reason": "Operational friction for global firms"}
        ],
        Mechanism.FOOD_SECURITY_RISK: [
            {"id": "staple_crop_prices", "name": "Agricultural Commodity Index", "score_v": 0.9, "reason": "Supply shock in global breadbaskets"},
            {"id": "social_stability", "name": "Political Cohesion Score", "score_v": -0.85, "reason": "Food inflation historically drives unrest"}
        ]
    }

    @staticmethod
    def get_impacts(mechanisms: List[Mechanism], severity: str) -> List[Dict[str, Any]]:
        """
        Dynamically generates nodes and edges based on mechanisms.
        """
        results = []
        multiplier = 1.0 if severity == "high" else 0.6
        
        for mech in mechanisms:
            targets = DynamicInferenceEngine.MECHANISM_IMPACT_MAP.get(mech, [])
            for t in targets:
                results.append({
                    "id": t["id"],
                    "name": t["name"],
                    "impact_score": t["score_v"] * multiplier * 100,
                    "confidence": 0.85,
                    "order": 1,
                    "reasoning_chain": ["Event", mech.value.replace("_", " ").title(), t["name"]],
                    "explanation": t["reason"]
                })
                
        return results
