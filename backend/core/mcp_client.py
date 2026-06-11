import os
from pymongo import MongoClient
from core.config import MONGODB_URI

class TrendClient:
    def __init__(self):
        self.client = None
        self.db = None
        self.collection = None

    async def connect(self):
        try:
            # Connect synchronously since serverless functions are ephemeral
            # and pymongo's default MongoClient is synchronous.
            self.client = MongoClient(MONGODB_URI)
            self.db = self.client.society_simulator
            self.collection = self.db.trends
        except Exception as e:
            print(f"MongoDB connect error: {e}")

    async def disconnect(self):
        if self.client:
            self.client.close()

    async def search_trends(self, query: str):
        if not self.client:
            # Auto-connect if not connected (useful for serverless)
            await self.connect()
        
        try:
            # Query MongoDB directly instead of via MCP
            results = list(self.collection.find({}, {"_id": 0}).limit(5))
            return results
        except Exception as e:
            print(f"DB Tool error: {e}")
            return [{"error": str(e)}]

mcp_client = TrendClient()
