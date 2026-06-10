import json
import asyncio
from google import genai
from core.config import GEMINI_API_KEY

class PersonasAgent:
    def __init__(self):
        self.client = genai.Client(api_key=GEMINI_API_KEY)
        self.model = "gemini-2.5-flash"
        self.personas = [
            "Gen Z student",
            "Working professional",
            "Meme/content creator",
            "Critical / skeptical user",
            "Neutral observer"
        ]

    async def simulate_persona(self, persona: str, content: str, analysis: dict):
        prompt = f"""
        You are a "{persona}". 
        Read the following content which is categorized as: {json.dumps(analysis)}
        
        Content: "{content}"
        
        How would you react?
        Return ONLY valid JSON.
        
        Expected JSON format:
        {{
            "persona": "{persona}",
            "sentiment": "positive | neutral | negative",
            "action": "like | share | comment | ignore",
            "reasoning": "1 line explaining why"
        }}
        """
        try:
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None, 
                lambda: self.client.models.generate_content(model=self.model, contents=prompt)
            )
            text = response.text.strip()
            if text.startswith("```json"):
                text = text[7:-3]
            elif text.startswith("```"):
                text = text[3:-3]
            return json.loads(text)
        except Exception as e:
            return {
                "persona": persona,
                "sentiment": "neutral",
                "action": "ignore",
                "reasoning": f"Error: {str(e)}"
            }

    async def run_all(self, content: str, analysis: dict):
        tasks = [self.simulate_persona(p, content, analysis) for p in self.personas]
        results = await asyncio.gather(*tasks)
        return results
