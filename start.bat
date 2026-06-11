@echo off
echo ==========================================
echo Starting Society Simulator (Hackathon Build)
echo ==========================================
echo.
echo Starting Backend (FastAPI + MCP)...
start cmd /k "title Backend Server && cd backend && .\venv\Scripts\activate && fastapi dev main.py"

echo Starting Frontend (React + Vite)...
start cmd /k "title Frontend Dashboard && cd frontend && npm run dev"

echo.
echo Both servers are booting up in new windows!
echo Once the frontend window says "ready", open your browser to:
echo http://localhost:5173
echo.
pause
