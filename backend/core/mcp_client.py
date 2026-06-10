import asyncio
from contextlib import AsyncExitStack
from mcp.client.session import ClientSession
from mcp.client.stdio import stdio_client, StdioServerParameters
from core.config import MCP_SERVER_COMMAND, MCP_SERVER_ARGS

class MCPTrendClient:
    def __init__(self):
        self.server_params = StdioServerParameters(
            command=MCP_SERVER_COMMAND,
            args=MCP_SERVER_ARGS,
            env=None
        )
        self.session = None
        self.exit_stack = None

    async def connect(self):
        self.exit_stack = AsyncExitStack()
        stdio_transport = await self.exit_stack.enter_async_context(stdio_client(self.server_params))
        self.stdio, self.write = stdio_transport
        self.session = await self.exit_stack.enter_async_context(ClientSession(self.stdio, self.write))
        await self.session.initialize()

    async def disconnect(self):
        if self.exit_stack:
            await self.exit_stack.aclose()

    async def search_trends(self, query: str):
        if not self.session:
            return {"error": "Not connected to MCP"}
        
        try:
            # Attempting to call MongoDB MCP tool
            # (MongoDB MCP server tools include operations like find, aggregate, etc.)
            result = await self.session.call_tool("find", {
                "collection": "trends",
                "query": {"$text": {"$search": query}}
            })
            return result
        except Exception as e:
            # Fallback for hackathon demo if actual DB is empty or connection fails
            print(f"MCP Tool error or not configured: {e}")
            return {
                "status": "fallback",
                "insights": "Found similar historical patterns.",
                "trends": [
                    {"hook": "Storytime...", "virality_factor": "High engagement through narrative."},
                    {"hook": "Controversial take...", "virality_factor": "Polarizing comments drive algorithm."}
                ]
            }

mcp_client = MCPTrendClient()
