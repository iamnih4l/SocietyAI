from agents.planner import PlannerAgent
from agents.personas import PersonasAgent
from agents.trend_intelligence import TrendIntelligenceAgent
from agents.risk_safety import RiskSafetyAgent
from agents.optimization import OptimizationAgent
from core.mcp_client import mcp_client

class SimulationEngine:
    def __init__(self):
        self.planner = PlannerAgent()
        self.personas_agent = PersonasAgent()
        self.trend_agent = TrendIntelligenceAgent()
        self.risk_agent = RiskSafetyAgent()
        self.optimization_agent = OptimizationAgent()

    def compute_scores(self, personas, risk_data):
        # Base scores
        engagement = 0
        virality = 0
        
        positive_actions = ["like", "share", "comment"]
        
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
        # Ensure MCP is connected
        if mcp_client.session is None:
            await mcp_client.connect()

        # 1. Planner
        analysis = self.planner.analyze(content)

        # 2. Personas (async)
        personas = await self.personas_agent.run_all(content, analysis)

        # 3. Trends (MCP)
        trends = await self.trend_agent.analyze_trends(content, analysis)

        # 4. Risk
        risk_data = self.risk_agent.analyze_risk(content)

        # 5. Compute Scores
        scores = self.compute_scores(personas, risk_data)

        # 6. Optimization
        optimization = self.optimization_agent.optimize(content, analysis, personas, trends, risk_data)

        return {
            "content_analysis": analysis,
            "persona_reactions": personas,
            "mcp_trend_insights": trends,
            "scores": scores,
            "risk_analysis": risk_data,
            "suggestions": optimization.get("suggestions", []),
            "optimized_content": optimization.get("optimized_content", "")
        }
