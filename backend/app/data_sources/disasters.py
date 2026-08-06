import httpx
from typing import List, Dict, Any

async def fetch_reliefweb_disasters(query: str, limit: int = 5) -> List[Dict[str, Any]]:
    """
    Fetches humanitarian/disaster context from ReliefWeb.
    """
    url = "https://api.reliefweb.int/v1/reports"
    params = {
        "appname": "geoimpact-intel",
        "query[value]": query,
        "limit": limit
    }
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params, timeout=10.0)
            if response.status_code == 200:
                return response.json().get("data", [])
    except Exception as e:
        print(f"ReliefWeb Service Warning: {e}")
    return []

async def fetch_usgs_earthquakes(starttime: str = "now-7days") -> List[Dict[str, Any]]:
    """
    Fetches live earthquake signals from USGS.
    """
    url = "https://earthquake.usgs.gov/fdsnws/event/1/query"
    params = {
        "format": "geojson",
        "starttime": starttime,
        "minmagnitude": 5.0
    }
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params, timeout=10.0)
            if response.status_code == 200:
                features = response.json().get("features", [])
                return [f["properties"] for f in features]
    except Exception as e:
        print(f"USGS Service Warning: {e}")
    return []
