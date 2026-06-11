import asyncio
import os
from contextlib import AsyncExitStack
from mcp.client.session import ClientSession
from mcp.client.stdio import stdio_client, StdioServerParameters
from core.config import MCP_SERVER_COMMAND, MCP_SERVER_ARGS, MONGODB_URI

class MCPTrendClient:
    def __init__(self):
        env = os.environ.copy()
        env["MCP_MONGODB_URI"] = MONGODB_URI
        env["NODE_NO_WARNINGS"] = "1"
        env["npm_config_loglevel"] = "silent"
        
        self.server_params = StdioServerParameters(
            command=MCP_SERVER_COMMAND,
            args=MCP_SERVER_ARGS,
            env=env
        )
        self.session = None
        self.exit_stack = None

    async def connect(self):
        self.exit_stack = AsyncExitStack()
        stdio_transport = await self.exit_stack.enter_async_context(stdio_client(self.server_params))
        self.stdio, self.write = stdio_transport
        self.session = await self.exit_stack.enter_async_context(ClientSession(self.stdio, self.write))
        await self.session.initialize()
        
        try:
            await self.session.call_tool("connect", {"connectionString": MONGODB_URI})
        except Exception as e:
            print(f"MCP MongoDB connect error: {e}")

    async def disconnect(self):
        if self.exit_stack:
            await self.exit_stack.aclose()

    async def search_trends(self, query: str):
        if not self.session:
            return {"error": "Not connected to MCP"}
        
        try:
            result = await self.session.call_tool("find", {
                "database": "society_simulator",
                "collection": "trends",
                "filter": {},
                "limit": 5
            })
            return result
        except Exception as e:
            print(f"MCP Tool error: {e}")
            return {"error": str(e)}

mcp_client = MCPTrendClient()
