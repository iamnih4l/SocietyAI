from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncio
from agents.simulation_engine import SimulationEngine
from core.mcp_client import mcp_client

app = FastAPI(title="Society Simulator Agent API")

# Enable CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SimulationRequest(BaseModel):
    content: str

@app.post("/api/simulate")
async def simulate(request: SimulationRequest):
    if not request.content.strip():
        raise HTTPException(status_code=400, detail="Content cannot be empty.")
    
    try:
        simulation_engine = SimulationEngine()
        result = await simulation_engine.run_simulation(request.content)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


