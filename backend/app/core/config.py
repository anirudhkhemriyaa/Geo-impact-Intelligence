from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "GeoImpact Intelligence"
    DATABASE_URL: str = "bolt://localhost:7687"
    DATABASE_USER: str = "neo4j"
    DATABASE_PASSWORD: str = "password"
    NEWS_API_KEY: str = ""
    ALPHA_VANTAGE_API_KEY: str = ""
    OPENROUTER_API_KEY: str = ""

    class Config:
        env_file = ".env"

settings = Settings()
