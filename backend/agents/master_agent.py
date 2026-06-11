import json
from google import genai
from core.config import GEMINI_API_KEY
from core.mcp_client import mcp_client

class MasterAgent:
    def __init__(self):
        self.client = genai.Client(api_key=GEMINI_API_KEY)
        self.model = "gemini-2.5-flash"

    async def run_all(self, content: str):
        # 1. Fetch real trends using MCP based on content directly
        query = content[:50]
        try:
            mcp_data = await mcp_client.search_trends(query)
            if hasattr(mcp_data, 'content'):
                mcp_data = [item.text for item in mcp_data.content if hasattr(item, 'text')]
        except Exception as e:
            mcp_data = [f"MCP Error: {e}"]

        # 2. Master Prompt asking for ALL JSON data in one shot
        prompt = f"""
        You are the Society Simulator Engine.
        Analyze the following content and generate a comprehensive societal simulation.
        
        Input Content: "{content}"
        Historical Viral Trends (from DB): {json.dumps(mcp_data)}
        
        You must return exactly ONE valid JSON object with the following structure, and no markdown formatting:
        {{
            "content_analysis": {{
                "type": "question | opinion | story | advertisement | other",
                "intent": "What is the user trying to achieve",
                "target_audience": "Who is this for",
                "tone": "humorous | serious | controversial | academic"
            }},
            "persona_reactions": [
                {{
                    "persona": "Gen Z student",
                    "sentiment": "positive | neutral | negative",
                    "action": "like | share | comment | ignore",
                    "reasoning": "1 line explaining why"
                }},
                {{ "persona": "Working professional", "sentiment": "...", "action": "...", "reasoning": "..." }},
                {{ "persona": "Meme/content creator", "sentiment": "...", "action": "...", "reasoning": "..." }},
                {{ "persona": "Critical / skeptical user", "sentiment": "...", "action": "...", "reasoning": "..." }},
                {{ "persona": "Neutral observer", "sentiment": "...", "action": "...", "reasoning": "..." }}
            ],
            "mcp_trend_insights": {{
                "similar_viral_patterns": ["pattern 1", "pattern 2"],
                "engagement_observations": ["obs 1"],
                "behavioral_insights": ["insight 1"]
            }},
            "risk_analysis": {{
                "controversy_score": 0,
                "potential_issues": ["issue 1"],
                "safety_flags": ["flag 1"]
            }},
            "optimization": {{
                "suggestions": ["suggestion 1", "suggestion 2"],
                "optimized_content": "The improved version"
            }}
        }}
        
        Make sure the controversy_score is an integer between 0 and 100.
        Return ONLY the raw JSON.
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
            print(f"Master Agent Error: {e}")
            # Fallback that won't crash the UI
            return {
                "content_analysis": {"type": "unknown", "intent": "unknown", "target_audience": "general", "tone": "neutral"},
                "persona_reactions": [{"persona": "System", "sentiment": "neutral", "action": "ignore", "reasoning": f"API Error: {e}"}],
                "mcp_trend_insights": {"similar_viral_patterns": [], "engagement_observations": [], "behavioral_insights": []},
                "risk_analysis": {"controversy_score": 0, "potential_issues": [], "safety_flags": []},
                "optimization": {"suggestions": [], "optimized_content": content}
            }
