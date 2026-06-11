import json
from google import genai
from core.config import GEMINI_API_KEY
from core.mcp_client import mcp_client

class TrendIntelligenceAgent:
    def __init__(self):
        self.client = genai.Client(api_key=GEMINI_API_KEY)
        self.model = "gemini-2.5-flash"

    async def analyze_trends(self, content: str, analysis: dict):
        # 1. Use MCP to get similar viral trends
        # In a real app, we extract keywords to search
        query = analysis.get("intent", content[:50])
        mcp_data = await mcp_client.search_trends(query)
        
        # Parse actual MCP CallToolResult if valid
        if hasattr(mcp_data, 'content'):
            try:
                mcp_data = [item.text for item in mcp_data.content if hasattr(item, 'text')]
            except Exception:
                pass
        
        # 2. Use Gemini to interpret MCP data + content
        prompt = f"""
        You are the Trend Intelligence Agent.
        Analyze the input content based on the historical viral trends retrieved from MCP.
        
        Input Content: "{content}"
        Content Type: {analysis.get("type")}
        MCP Trend Data: {json.dumps(mcp_data)}
        
        Compare the input with the trends and provide insights.
        Return ONLY valid JSON.
        
        Expected JSON format:
        {{
            "similar_viral_patterns": ["pattern 1", "pattern 2"],
            "engagement_observations": ["obs 1", "obs 2"],
            "behavioral_insights": ["insight 1", "insight 2"]
        }}
        """
        try:
            response = self.client.models.generate_content(
                model=self.model,
                contents=prompt
            )
            text = response.text.strip()
            if text.startswith("```json"):
                text = text[7:-3]
            elif text.startswith("```"):
                text = text[3:-3]
            return json.loads(text)
        except Exception as e:
            return {
                "similar_viral_patterns": ["Could not analyze patterns"],
                "engagement_observations": ["Error in trend analysis"],
                "behavioral_insights": [str(e)]
            }
