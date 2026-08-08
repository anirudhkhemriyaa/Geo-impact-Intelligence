import httpx
from typing import List, Dict, Any

async def fetch_gdelt_context(query: str, limit: int = 10) -> List[Dict[str, Any]]:
    """
    Fetches events from GDELT API.
    Provides global event context and entity signals.
    """
    url = "https://api.gdeltproject.org/api/v2/doc/doc"
    params = {
        "query": f'"{query}"',
        "mode": "artlist",
        "format": "json",
        "maxrecords": limit
    }
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params, timeout=15.0)
            if response.status_code == 200:
                data = response.json()
                return data.get("articles", [])
    except Exception as e:
        print(f"GDELT Service Warning: {e}")
    
    return []
