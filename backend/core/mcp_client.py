import asyncio
import os
from contextlib import AsyncExitStack
from mcp.client.session import ClientSession
from mcp.client.stdio import stdio_client, StdioServerParameters
from core.config import MCP_SERVER_COMMAND, MCP_SERVER_ARGS, MONGODB_URI

class MCPTrendClient:
    def __init__(self):
        # The mongodb-mcp-server expects the connection string in MCP_MONGODB_URI
        env = os.environ.copy()
        env["MCP_MONGODB_URI"] = MONGODB_URI
        
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

    async def disconnect(self):
        if self.exit_stack:
            await self.exit_stack.aclose()

    async def search_trends(self, query: str):
        if not self.session:
            return {"error": "Not connected to MCP"}
        
        try:
            # We list tools to dynamically find the correct query tool
            tools_response = await self.session.list_tools()
            tool_names = [t.name for t in tools_response.tools]
            
            # The official MongoDB MCP typically uses 'mongodb_read' or 'mongodb_find' or 'find'
            # We will try a few standard naming conventions
            tool_to_use = None
            if "find" in tool_names:
                tool_to_use = "find"
            elif "mongodb_read" in tool_names:
                tool_to_use = "mongodb_read"
            elif "read" in tool_names:
                tool_to_use = "read"
                
            if tool_to_use:
                result = await self.session.call_tool(tool_to_use, {
                    "database": "society_simulator",
                    "collection": "trends",
                    "query": {"$text": {"$search": query}},
                    "limit": 5
                })
                return result
            else:
                return {
                    "error": f"Supported tool not found in MCP server. Available tools: {tool_names}"
                }
        except Exception as e:
            print(f"MCP Tool error: {e}")
            return {"error": str(e)}

mcp_client = MCPTrendClient()
