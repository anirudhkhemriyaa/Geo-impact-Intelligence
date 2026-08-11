from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class GeoImpactBase(BaseModel):
    id: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    confidence: float = Field(ge=0.0, le=1.0)
    source: List[str]

class Entity(BaseModel):
    id: str
    name: str
    category: str # e.g., Country, Industry, Commodity
    impact_score: float = 0.0
    reasoning_chain: List[str] = []
    metadata: Dict[str, Any] = {}

class Relationship(BaseModel):
    source_id: str
    target_id: str
    type: str # e.g., affects, depends_on, exports_to
    strength: float
    confidence: float
    evidence: str

class EventIntel(BaseModel):
    event_id: str
    event_type: str
    summary: str
    entities: List[Entity]
    relationships: List[Relationship]
    scoring_summary: Dict[str, float]
