<div align="center">
  <img src="https://img.shields.io/badge/Python-3.10%2B-blue?style=for-the-badge&logo=python" alt="Python">
  <img src="https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/Gemini-3-orange?style=for-the-badge&logo=google" alt="Gemini">
  <img src="https://img.shields.io/badge/MCP-Integrated-success?style=for-the-badge" alt="MCP">
  <img src="https://img.shields.io/badge/License-MIT-brightgreen?style=for-the-badge&logo=open-source-initiative&logoColor=white" alt="OSI Approved License">
  
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
- Git
- Node.js 18+
- Python 3.10+
- A Google Gemini API Key (Get it [here](https://aistudio.google.com/app/apikey))
- A MongoDB Cluster (Free tier on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register))

### 1. Clone the Repository
```bash
git clone https://github.com/iamnih4l/SocietyAI.git
cd SocietyAI
```

### 2. Backend Setup & Configuration
```bash
# Navigate to backend
cd backend

# Create and activate virtual environment
python -m venv venv
# On Windows:
.\venv\Scripts\activate  
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

**Configure Environment Variables:**
Create a `.env` file in the `backend/` directory and add your credentials:
```env
# Get this from Google AI Studio
GEMINI_API_KEY="your_gemini_api_key_here"

# Get this from MongoDB Atlas (Replace <password> and remove +srv if using local)
MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/"
```

**Run the Backend Server:**
```bash
fastapi dev main.py
```

### 3. Frontend Setup
Open a new terminal window:
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start dev server
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
  This project is certified open source and available under the <strong>OSI-approved <a href="LICENSE">MIT License</a></strong>.
</div>
