import os
import httpx
from typing import List, Dict, Any
from dotenv import load_dotenv

load_dotenv()

NEWS_API_KEY = os.getenv("NEWS_API_KEY")

from app.retries.exponential_backoff import retry_with_backoff

async def _fetch_news_api_signals_raw(query: str, limit: int = 15) -> List[Dict[str, Any]]:
    if not NEWS_API_KEY:
        return []

    url = "https://newsapi.org/v2/everything"
    params = {
        "q": query,
        "sortBy": "relevancy",
        "pageSize": limit,
        "apiKey": NEWS_API_KEY
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params, timeout=10.0)
        if response.status_code == 200:
            data = response.json()
            articles = data.get("articles", [])
            return [{
                "title": art.get("title"),
                "source": art.get("source", {}).get("name"),
                "url": art.get("url"),
                "publishedAt": art.get("publishedAt"),
                "snippet": art.get("description")
            } for art in articles]
        else:
            raise Exception(f"NewsAPI Error: {response.status_code} - {response.text}")

async def fetch_news_api_signals(query: str, limit: int = 15) -> List[Dict[str, Any]]:
    try:
        return await retry_with_backoff(_fetch_news_api_signals_raw, query, limit=limit)
    except Exception as e:
        print(f"NewsAPI Service Final Failure: {e}")
        return []
