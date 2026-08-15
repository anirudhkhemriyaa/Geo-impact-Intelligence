from enum import Enum
from typing import List, Dict

class EventCategory(str, Enum):
    WAR = "war"
    SANCTIONS = "sanctions"
    TRADE_DISRUPTION = "trade_disruption"
    CIVIL_UNREST = "civil_unrest"
    EARTHQUAKE = "earthquake"
    FLOOD = "flood"
    DROUGHT = "drought"
    WILDFIRE = "wildfire"
    PANDEMIC = "pandemic"
    FINANCIAL_CRISIS = "financial_crisis"
    BANKING_FAILURE = "banking_failure"
    ELECTION = "election"
    POLITICAL_INSTABILITY = "political_instability"
    CYBER_ATTACK = "cyber_attack"
    INFRASTRUCTURE_FAILURE = "infrastructure_failure"
    SUPPLY_CHAIN_DISRUPTION = "supply_chain_disruption"
    ENERGY_CRISIS = "energy_crisis"
    TERRORISM = "terrorism"
    MARITIME_INCIDENT = "maritime_incident"
    REGULATION = "regulation"
    LABOR_STRIKE = "labor_strike"
    COMMODITY_SHOCK = "commodity_shock"
    CORPORATE_SHOCK = "corporate_shock"
    ACQUISITION_RUMOR = "acquisition_rumor"
    LOGISTICS_DISRUPTION = "logistics_disruption"

class Mechanism(str, Enum):
    MILITARY_ESCALATION = "military_escalation"
    SHIPPING_DISRUPTION = "shipping_disruption"
    SANCTIONS_RISK = "sanctions_risk"
    ENERGY_SUPPLY_RISK = "energy_supply_risk"
    REGIONAL_INSTABILITY = "regional_instability"
    INFRASTRUCTURE_DAMAGE = "infrastructure_damage"
    LOGISTICS_DISRUPTION = "logistics_disruption"
    MANUFACTURING_INTERRUPTION = "manufacturing_interruption"
    HUMANITARIAN_PRESSURE = "humanitarian_pressure"
    LIQUIDITY_CRUNCH = "liquidity_crunch"
    BANKING_STRESS = "banking_stress"
    CREDIT_CONTRACTION = "credit_contraction"
    CONSUMER_SPENDING_DECLINE = "consumer_spending_decline"
    COMMODITY_PRICE_VOLATILITY = "commodity_price_volatility"
    TRADE_BARRIER_ESCALATION = "trade_barrier_escalation"
    CYBER_RISK_SURGE = "cyber_risk_surge"
    DIPLOMATIC_EXPULSION = "diplomatic_expulsion"
    FLIGHT_CANCELLATIONS = "flight_cancellations"
    FOOD_SECURITY_RISK = "food_security_risk"
    LABOR_SHORTAGE = "labor_shortage"

# Dynamic mapping of Category to default Mechanisms
EVENT_MECHANISMS: Dict[EventCategory, List[Mechanism]] = {
    EventCategory.WAR: [
        Mechanism.MILITARY_ESCALATION,
        Mechanism.SHIPPING_DISRUPTION,
        Mechanism.SANCTIONS_RISK,
        Mechanism.ENERGY_SUPPLY_RISK,
        Mechanism.REGIONAL_INSTABILITY,
        Mechanism.FLIGHT_CANCELLATIONS
    ],
    EventCategory.EARTHQUAKE: [
        Mechanism.INFRASTRUCTURE_DAMAGE,
        Mechanism.LOGISTICS_DISRUPTION,
        Mechanism.MANUFACTURING_INTERRUPTION,
        Mechanism.HUMANITARIAN_PRESSURE
    ],
    EventCategory.FINANCIAL_CRISIS: [
        Mechanism.LIQUIDITY_CRUNCH,
        Mechanism.BANKING_STRESS,
        Mechanism.CREDIT_CONTRACTION,
        Mechanism.CONSUMER_SPENDING_DECLINE
    ],
    EventCategory.TRADE_DISRUPTION: [
        Mechanism.SHIPPING_DISRUPTION,
        Mechanism.LOGISTICS_DISRUPTION,
        Mechanism.TRADE_BARRIER_ESCALATION
    ],
    EventCategory.ENERGY_CRISIS: [
        Mechanism.ENERGY_SUPPLY_RISK,
        Mechanism.COMMODITY_PRICE_VOLATILITY,
        Mechanism.MANUFACTURING_INTERRUPTION
    ],
    EventCategory.SANCTIONS: [
        Mechanism.SANCTIONS_RISK,
        Mechanism.TRADE_BARRIER_ESCALATION,
        Mechanism.LOGISTICS_DISRUPTION
    ],
    EventCategory.POLITICAL_INSTABILITY: [
        Mechanism.REGIONAL_INSTABILITY,
        Mechanism.SANCTIONS_RISK,
        Mechanism.LIQUIDITY_CRUNCH
    ],
    EventCategory.FLOOD: [
        Mechanism.INFRASTRUCTURE_DAMAGE,
        Mechanism.LOGISTICS_DISRUPTION,
        Mechanism.FOOD_SECURITY_RISK
    ],
    EventCategory.CYBER_ATTACK: [
        Mechanism.CYBER_RISK_SURGE,
        Mechanism.MANUFACTURING_INTERRUPTION,
        Mechanism.BANKING_STRESS,
    ],
    EventCategory.SUPPLY_CHAIN_DISRUPTION: [
        Mechanism.LOGISTICS_DISRUPTION,
        Mechanism.MANUFACTURING_INTERRUPTION,
        Mechanism.COMMODITY_PRICE_VOLATILITY,
    ],
    EventCategory.BANKING_FAILURE: [
        Mechanism.BANKING_STRESS,
        Mechanism.LIQUIDITY_CRUNCH,
        Mechanism.CREDIT_CONTRACTION,
    ],
    EventCategory.REGULATION: [
        Mechanism.TRADE_BARRIER_ESCALATION,
        Mechanism.MANUFACTURING_INTERRUPTION,
        Mechanism.SANCTIONS_RISK,
    ],
    EventCategory.LABOR_STRIKE: [
        Mechanism.LABOR_SHORTAGE,
        Mechanism.LOGISTICS_DISRUPTION,
        Mechanism.MANUFACTURING_INTERRUPTION,
    ],
    EventCategory.COMMODITY_SHOCK: [
        Mechanism.COMMODITY_PRICE_VOLATILITY,
        Mechanism.ENERGY_SUPPLY_RISK,
        Mechanism.CONSUMER_SPENDING_DECLINE,
    ],
    EventCategory.CORPORATE_SHOCK: [
        Mechanism.MANUFACTURING_INTERRUPTION,
        Mechanism.LOGISTICS_DISRUPTION,
        Mechanism.CREDIT_CONTRACTION,
    ],
    EventCategory.LOGISTICS_DISRUPTION: [
        Mechanism.LOGISTICS_DISRUPTION,
        Mechanism.SHIPPING_DISRUPTION,
    ],
}
