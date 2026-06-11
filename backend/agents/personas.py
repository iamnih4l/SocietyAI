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

    async def run_all(self, content: str, analysis: dict):
        prompt = f"""
        You are simulating 5 different societal personas reacting to a piece of content.
        The content is categorized as: {json.dumps(analysis)}
        
        Content: "{content}"
        
        The 5 personas are:
        1. Gen Z student
        2. Working professional
        3. Meme/content creator
        4. Critical / skeptical user
        5. Neutral observer
        
        How would EACH of them react?
        Return ONLY a JSON array of objects, with no markdown formatting.
        
        Expected JSON format:
        [
            {{
                "persona": "Gen Z student",
                "sentiment": "positive | neutral | negative",
                "action": "like | share | comment | ignore",
                "reasoning": "1 line explaining why"
            }},
            ... (for all 5)
        ]
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
            print(f"Persona Agent Rate Limit/Error: {e}")
            # Fallback mock data so demo doesn't crash
            return [
                {"persona": p, "sentiment": "neutral", "action": "ignore", "reasoning": "API Rate Limit Hit - Fallback"} 
                for p in self.personas
            ]
