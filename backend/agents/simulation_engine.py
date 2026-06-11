from agents.master_agent import MasterAgent
from core.mcp_client import mcp_client

class SimulationEngine:
    def __init__(self):
        self.master_agent = MasterAgent()

    def compute_scores(self, personas, risk_data):
        # Base scores
        engagement = 0
        virality = 0
        
        # Calculate based on personas
        for p in personas:
            if p.get("sentiment") == "positive":
                engagement += 20
            elif p.get("sentiment") == "negative":
                engagement += 10 # Negative still drives engagement
                
            if p.get("action") == "share":
                virality += 30
            elif p.get("action") == "comment":
                virality += 15
            elif p.get("action") == "like":
                virality += 5

        # Normalize
        engagement = min(100, max(0, engagement + 10))
        virality = min(100, max(0, virality))
        controversy = risk_data.get("controversy_score", 0)

        # High controversy might increase virality but is risky
        if controversy > 50:
            virality = min(100, virality + 20)

        return {
            "engagement_score": engagement,
            "virality_score": virality,
            "controversy_score": controversy
        }

    async def run_simulation(self, content: str):

        # Execute 1 single Master LLM call
        result = await self.master_agent.run_all(content)

        # Compute Scores
        scores = self.compute_scores(result.get("persona_reactions", []), result.get("risk_analysis", {}))

        return {
            "content_analysis": result.get("content_analysis", {}),
            "persona_reactions": result.get("persona_reactions", []),
            "mcp_trend_insights": result.get("mcp_trend_insights", {}),
            "scores": scores,
            "risk_analysis": result.get("risk_analysis", {}),
            "suggestions": result.get("optimization", {}).get("suggestions", []),
            "optimized_content": result.get("optimization", {}).get("optimized_content", "")
        }
