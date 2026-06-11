import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://127.0.0.1:27017")
MCP_SERVER_COMMAND = os.getenv("MCP_SERVER_COMMAND", "npx")
MCP_SERVER_ARGS = os.getenv("MCP_SERVER_ARGS", "-y,mongodb-mcp-server").split(",")
