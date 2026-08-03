from fastapi import APIRouter
from app.models.schemas import ImpactGraph

router = APIRouter()

@router.get("/latest", response_model=ImpactGraph)
async def get_latest_graph():
    # Placeholder for fetching latest analysis from Neo4j/Cache
    return {
        "nodes": [],
        "edges": [],
        "summary": "No active analysis",
        "event_details": {}
    }
