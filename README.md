<div align="center">
  <img src="https://img.shields.io/badge/Python-3.10%2B-blue?style=for-the-badge&logo=python" alt="Python">
  <img src="https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/Gemini-3-orange?style=for-the-badge&logo=google" alt="Gemini">
  <img src="https://img.shields.io/badge/MCP-Integrated-success?style=for-the-badge" alt="MCP">
  
  <br/>
  
  <h1>🤖 Society Simulator Agent</h1>
  <p><b>An autonomous multi-agent system that predicts how society will react to your content before it is published.</b></p>
</div>

---

## 📖 Table of Contents
- [Problem Statement](#-problem-statement)
- [Solution Overview](#-solution-overview)
- [Architecture Explanation](#️-architecture-explanation)
- [MCP Integration Details](#-mcp-integration-details)
- [System Workflow](#️-system-workflow)
- [Setup Instructions](#️-setup-instructions)
- [API Usage Guide](#-api-usage-guide)
- [Future Improvements](#-future-improvements)

---

## 🎯 Problem Statement
Content creators, marketers, and individuals often struggle to predict how their posts, scripts, or ads will be received by different demographics. Controversial or poorly targeted content can lead to brand damage, low engagement, or unwanted backlash. There is a need for a pre-flight "simulation" to gauge societal reaction, identify risks, and optimize content for maximum virality and positive engagement.

## 💡 Solution Overview
The **Society Simulator Agent** is a multi-agent AI system powered by Gemini 3 and the **Model Context Protocol (MCP)**. Instead of a simple chatbot response, it orchestrates a pipeline of specialized agents:
- Breaks down the content into intent and target audiences.
- Simulates reactions from various societal personas.
- Retrieves historical viral trends using an MCP integration.
- Analyzes risk and controversy.
- Generates an optimized version of the content with actionable suggestions.

---

## 🏗️ Architecture Explanation

The system uses a modern web stack:
- **Backend:** Python / FastAPI, orchestrating multiple Gemini models via the `google-genai` SDK.
- **Frontend:** React + Vite with a premium, glassmorphism-based UI using Vanilla CSS.
- **Tools:** The Model Context Protocol (MCP) connects the Trend Intelligence Agent directly to a MongoDB database containing historical engagement patterns.

```mermaid
graph TD
    User([User]) -->|Input Content| UI(Frontend: React/Vite)
    UI -->|POST /api/simulate| API(Backend: FastAPI)
    
    subgraph Multi-Agent Orchestration
        API --> Engine(Simulation Engine)
        Engine --> Planner(Planner Agent)
        Engine --> Personas(Persona Simulation Agents)
        Engine --> Risk(Risk & Safety Agent)
        Engine --> Trends(Trend Intelligence Agent)
        Engine --> Optimizer(Optimization Agent)
    end
    
    subgraph Persona Types
        Personas -.-> GenZ(Gen Z)
        Personas -.-> Pro(Professional)
        Personas -.-> Meme(Creator)
        Personas -.-> Skeptic(Critical)
        Personas -.-> Neutral(Observer)
    end
    
    subgraph External Tools
        Trends -->|Search query| MCP[MCP Client]
        MCP -->|Protocol| MongoDB[(MongoDB MCP Server)]
        Planner & Personas & Risk & Optimizer -->|Prompts| Gemini[Gemini 3 / GenAI API]
    end
    
    Optimizer -->|Suggestions & Optimized Content| Engine
    Engine -->|Aggregate JSON Output| API
    API -->|Result Payload| UI
```

---

## 🔌 MCP Integration Details
We integrate the **MongoDB MCP Server** (`@modelcontextprotocol/server-mongodb`). 
The **Trend Intelligence Agent** uses the MCP client to dynamically query the MongoDB database for past viral content matching the current input's intent. This allows the system to ground its virality predictions in real-world data rather than just relying on the LLM's internal weights. By using MCP, the agent becomes a true execution system capable of retrieving external state.

---

## ⚙️ System Workflow
1. 📝 **User Input** → A user pastes a reel idea, ad, or post into the dashboard.
2. 🧠 **Planner Agent** → Identifies intent, tone, audience, and content type.
3. 🎭 **Persona Simulation Agents** → Parallel execution of 5 personas (Gen Z, Pro, Creator, Skeptic, Neutral) to gauge sentiment and likely actions.
4. 📈 **MCP Trend Retrieval** → The Trend Intelligence Agent queries MongoDB via MCP to extract historical viral patterns.
5. 🧮 **Simulation Engine** → Aggregates all data to compute Engagement, Virality, and Controversy scores (0-100).
6. 🛡️ **Risk & Safety Agent** → Flags sensitive issues.
7. 🚀 **Optimization Agent** → Generates an optimized version of the text and provides actionable suggestions.
8. 📊 **Final Output** → The UI displays the comprehensive dashboard.

---

## 🛠️ Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+
- Gemini API Key
- MongoDB Cluster (for MCP)

### Backend Setup
```bash
# 1. Navigate to backend
cd backend

# 2. Create virtual environment
python -m venv venv

# 3. Activate
.\venv\Scripts\activate  # Windows
source venv/bin/activate # Mac/Linux

# 4. Install dependencies
pip install -r requirements.txt

# 5. Configure environment variables (copy .env.example)
# Add GEMINI_API_KEY and MONGODB_URI

# 6. Run the server
fastapi dev main.py
```

### Frontend Setup
```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
```

---

## 📡 API Usage Guide
**Endpoint:** `POST /api/simulate`  
**Content-Type:** `application/json`

**Request Body:**
```json
{
  "content": "Just bought a new house at 22! Here's how I did it..."
}
```

**Response Overview:**
Returns a comprehensive JSON object containing:
- `content_analysis`
- `persona_reactions` (array)
- `mcp_trend_insights`
- `scores` (engagement, virality, controversy)
- `risk_analysis`
- `suggestions` (array)
- `optimized_content`

---

## 🚀 Future Improvements
- [ ] Add more diverse and hyper-specific personas based on real-time social media scraping.
- [ ] Support multimodal input (images/videos) using Gemini Pro Vision.
- [ ] Persist simulation history in a database to learn from past predictions.
- [ ] Expand MCP integrations (e.g., Elastic MCP for real-time news context).

---
<div align="center">
  <i>Built for the GenAI Hackathon</i><br>
  Available under the <a href="LICENSE">MIT License</a>
</div>
