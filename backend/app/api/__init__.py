from fastapi import APIRouter
from app.api.endpoints import events, entities, graph

router = APIRouter()
router.include_router(events.router, prefix="/events", tags=["events"])
router.include_router(entities.router, prefix="/entities", tags=["entities"])
router.include_router(graph.router, prefix="/graph", tags=["graph"])
