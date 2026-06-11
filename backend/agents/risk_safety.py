import json
from google import genai
from core.config import GEMINI_API_KEY

class RiskSafetyAgent:
    def __init__(self):
        self.client = genai.Client(api_key=GEMINI_API_KEY)
        self.model = "gemini-2.5-flash"

    def analyze_risk(self, content: str):
        prompt = f"""
        You are the Risk & Safety Agent.
        Analyze the following content for controversial, harmful, or sensitive elements.
        
        Content: "{content}"
        
        Return ONLY valid JSON.
        
        Expected JSON format:
        {{
            "controversy_score": 0-100,
            "potential_issues": ["issue 1", "issue 2"],
            "safety_flags": ["flag 1", "flag 2"]
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
                "controversy_score": 0,
                "potential_issues": [],
                "safety_flags": ["Error analyzing risk: " + str(e)]
            }
