import json
from google import genai
from core.config import GEMINI_API_KEY

class OptimizationAgent:
    def __init__(self):
        self.client = genai.Client(api_key=GEMINI_API_KEY)
        self.model = "gemini-2.5-flash"

    def optimize(self, content: str, analysis: dict, personas: list, trends: dict, risks: dict):
        prompt = f"""
        You are the Optimization Agent.
        Your goal is to increase engagement and virality while reducing risks based on the simulation data.
        
        Original Content: "{content}"
        Content Analysis: {json.dumps(analysis)}
        Persona Reactions: {json.dumps(personas)}
        Trend Insights: {json.dumps(trends)}
        Risk Flags: {json.dumps(risks)}
        
        Return ONLY valid JSON.
        
        Expected JSON format:
        {{
            "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"],
            "optimized_content": "The newly improved version of the content."
        }}
        """
        response = self.client.models.generate_content(
            model=self.model,
            contents=prompt
        )
        try:
            text = response.text.strip()
            if text.startswith("```json"):
                text = text[7:-3]
            elif text.startswith("```"):
                text = text[3:-3]
            return json.loads(text)
        except Exception as e:
            return {
                "suggestions": ["Error optimizing content: " + str(e)],
                "optimized_content": content
            }
