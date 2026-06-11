import asyncio
from core.mcp_client import mcp_client

async def test():
    print("Connecting...")
    await mcp_client.connect()
    print("Connected! Searching...")
    res = await mcp_client.search_trends("crypto")
    print("Result:", res)
    await mcp_client.disconnect()

asyncio.run(test())
