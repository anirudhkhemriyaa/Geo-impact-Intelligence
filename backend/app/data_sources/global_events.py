import httpx
from typing import List, Dict, Any

async def fetch_gdelt_events(query: str, limit: int = 10) -> List[Dict[str, Any]]:
    """
    Fetches events from GDELT Project.
    """
    base_url = "https://api.gdeltproject.org/api/v2/doc/doc"
    params = {
        "query": query,
        "mode": "artlist",
        "format": "json",
        "maxrecords": limit
    }
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(base_url, params=params, timeout=10.0)
            if response.status_code == 200:
                data = response.json()
                return data.get("articles", [])
    except Exception as e:
        print(f"GDELT Fetch Error: {e}")
    
    return []

async def fetch_reliefweb_events(query: str) -> List[Dict[str, Any]]:
    """
    Fetches disaster events from ReliefWeb API.
    """
    url = "https://api.reliefweb.int/v1/reports"
    params = {
        "appname": "geoimpact-intelligence",
        "query[value]": query,
        "limit": 5
    }
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params, timeout=10.0)
            if response.status_code == 200:
                data = response.json()
                return data.get("data", [])
    except Exception as e:
        print(f"ReliefWeb Fetch Error: {e}")
    
    return []
