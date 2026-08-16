import os
import httpx
import json
from typing import List, Dict, Any
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

class IntelNarrator:
    """
    Converts raw graph reasoning and scores into human-readable 
    intelligence narratives.
    """

    @staticmethod
    async def explain_impact(node_data: Dict[str, Any], event_summary: str) -> str:
        """
        Generates a 1-sentence analytical explanation for a specific node impact.
        Uses the reasoning chain to ensure structural truth.
        """
        chain = node_data.get("reasoning_chain", [])
        impact_dir = "positive" if node_data.get("impact_score", 0) > 0 else "negative"
        
        # 1. Structural template for zero-latency explanation
        if not OPENROUTER_API_KEY or len(chain) < 2:
            return f"The event leads to a {impact_dir} impact on {node_data['id']} via the {(' -> '.join(chain))} dependency chain."

        # 2. LLM-enhanced analytical narrative (restricted to provided facts)
        prompt = (
            f"Event: {event_summary}\n"
            f"Target: {node_data['id']}\n"
            f"Causal Path: {' -> '.join(chain)}\n"
            f"Impact Score: {node_data['impact_score']}\n"
            f"Provide a concise 1-sentence 'Intelligence Brief' item explaining the logic. "
            f"Use professional language (e.g., 'pressure on margins', 'procurement demand'). "
            f"Do not invent facts outside the path."
        )

        models = ["google/gemini-2.0-flash-exp:free", "google/gemini-flash-1.5", "google/gemini-2.0-flash-exp"]
        
        for model in models:
            try:
                async with httpx.AsyncClient() as client:
                    response = await client.post(
                        "https://openrouter.ai/api/v1/chat/completions",
                        headers={"Authorization": f"Bearer {OPENROUTER_API_KEY}"},
                        json={
                            "model": model,
                            "messages": [{"role": "user", "content": prompt}]
                        },
                        timeout=5.0
                    )
                    if response.status_code == 200:
                        return response.json()["choices"][0]["message"]["content"].strip()
            except Exception:
                continue

        return f"Cascading {impact_dir} outcome driven by {chain[-2] if len(chain)>1 else 'direct'} effects."

    @staticmethod
    async def generate_full_briefing(scored_nodes: List[Dict[str, Any]], event_info: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Enriches all scored nodes with natural language explanations.
        """
        event_summary = event_info.get("summary", "User defined event")
        
        # Process top 10 most significant impacts to save tokens/time
        significant_nodes = sorted(scored_nodes, key=lambda x: abs(x["impact_score"]), reverse=True)[:10]
        
        for node in significant_nodes:
            node["explanation"] = await IntelNarrator.explain_impact(node, event_summary)
            
        return scored_nodes
