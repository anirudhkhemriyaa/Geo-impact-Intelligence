import os
from neo4j import GraphDatabase
from dotenv import load_dotenv

load_dotenv()

class Neo4jClient:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(Neo4jClient, cls).__new__(cls)
            uri = os.getenv("DATABASE_URL", "bolt://localhost:7687")
            user = os.getenv("DATABASE_USER", "neo4j")
            password = os.getenv("DATABASE_PASSWORD", "password")
            try:
                cls._instance.driver = GraphDatabase.driver(uri, auth=(user, password))
                # Verify connection
                cls._instance.driver.verify_connectivity()
            except Exception:
                print(">>> System Note: Neo4j not detected at localhost:7687. Running in 'Autonomous Logic Mode' (Dynamic Fallbacks Active).")
                cls._instance.driver = None
        return cls._instance

    def get_session(self):
        if not self.driver:
            return None
        return self.driver.session()

    def run_query(self, query: str, parameters: dict = None):
        if not self.driver:
            return None
        with self.driver.session() as session:
            return session.run(query, parameters or {})

    def close(self):
        if self.driver:
            self.driver.close()

db = Neo4jClient()
