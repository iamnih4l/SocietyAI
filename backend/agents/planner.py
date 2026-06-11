import json
from google import genai
from core.config import GEMINI_API_KEY

class PlannerAgent:
    def __init__(self):
        self.client = genai.Client(api_key=GEMINI_API_KEY)
        self.model = "gemini-2.5-flash"

    def analyze(self, content: str):
        prompt = f"""
        You are the Planner Agent. Analyze the following content and break it down.
        Return ONLY valid JSON.
        
        Content: "{content}"
        
        Expected JSON format:
        {{
            "type": "reel | post | ad | script | etc",
            "intent": "What is the primary goal?",
            "target_audience": "Who is this for?"
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
            return json.loads(text)
        except Exception as e:
            print(f"Planner Agent Error: {e}")
            return {
                "type": "unknown",
                "intent": "unknown",
                "target_audience": "general",
                "tone": "neutral"
            }
