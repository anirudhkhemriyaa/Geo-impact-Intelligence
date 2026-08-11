from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class EventRequest(BaseModel):
    query: str

class EventStructure(BaseModel):
    event_type: str
    countries: List[str]
    region: str
    severity: str
    status: str
    summary: str

class EntityNode(BaseModel):
    id: str
    label: str
    category: str
    impact_score: float
    confidence: float
    explanation: str
    data_sources: List[str]

class RelationshipEdge(BaseModel):
    source: str
    target: str
    type: str
    strength: float
    confidence: float
    explanation: str

class ImpactGraph(BaseModel):
    nodes: List[EntityNode]
    edges: List[RelationshipEdge]
    summary: str
    event_details: Dict[str, Any]
