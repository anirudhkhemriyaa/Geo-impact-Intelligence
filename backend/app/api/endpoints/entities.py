from fastapi import APIRouter
from typing import List
from app.models.schemas import EntityNode

router = APIRouter()

@router.get("/{entity_id}", response_model=EntityNode)
async def get_entity_details(entity_id: str):
    # Mock lookup or Neo4j fetch
    return EntityNode(
        id=entity_id,
        label=entity_id.replace("_", " ").title(),
        category="general",
        impact_score=0.0,
        confidence=1.0,
        explanation="Details for " + entity_id,
        data_sources=[]
    )
