# Society Simulator Agent

An autonomous multi-agent system that predicts how society will react to your content before it is published.

## 1. Problem Statement
Content creators, marketers, and individuals often struggle to predict how their posts, scripts, or ads will be received by different demographics. Controversial or poorly targeted content can lead to brand damage, low engagement, or unwanted backlash. There is a need for a pre-flight "simulation" to gauge societal reaction, identify risks, and optimize content for maximum virality and positive engagement.

## 2. Solution Overview
The **Society Simulator Agent** is a multi-agent AI system powered by Gemini 3 and the Model Context Protocol (MCP). Instead of a simple chatbot response, it orchestrates a pipeline of specialized agents:
- It breaks down the content.
- Simulates reactions from various societal personas.
- Retrieves historical viral trends using an MCP integration.
- Analyzes risk and controversy.
- Generates an optimized version of the content with actionable suggestions.

## 3. Architecture Explanation
The system uses a modern web stack:
- **Backend:** Python / FastAPI, orchestrating multiple Gemini models via the `google-genai` SDK.
- **Frontend:** React + Vite with a premium, glassmorphism-based UI using Vanilla CSS.
- **Tools:** The Model Context Protocol (MCP) connects the Trend Intelligence Agent directly to a MongoDB database containing historical engagement patterns.

*See `architecture_diagram.md` for a visual flowchart.*

## 4. MCP Integration Details
We integrate the **MongoDB MCP Server** (`@modelcontextprotocol/server-mongodb`). 
The **Trend Intelligence Agent** uses the MCP client to dynamically query the MongoDB database for past viral content matching the current input's intent. This allows the system to ground its virality predictions in real-world data rather than just relying on the LLM's internal weights. By using MCP, the agent becomes a true execution system capable of retrieving external state.

## 5. System Workflow Explanation
1. **User Input** → A user pastes a reel idea, ad, or post into the dashboard.
2. **Planner Agent** → Identifies intent, tone, audience, and content type.
3. **Persona Simulation Agents** → Parallel execution of 5 personas (Gen Z, Pro, Creator, Skeptic, Neutral) to gauge sentiment and likely actions.
4. **MCP Trend Retrieval** → The Trend Intelligence Agent queries MongoDB via MCP to extract historical viral patterns.
5. **Simulation Engine** → Aggregates all data to compute Engagement, Virality, and Controversy scores (0-100).
6. **Risk & Safety Agent** → Flags sensitive issues.
7. **Optimization Agent** → Generates an optimized version of the text and provides actionable suggestions.
8. **Final Output** → The UI displays the comprehensive dashboard.

## 6. Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+
- Gemini API Key
- MongoDB Cluster (for MCP)

### Backend Setup
1. Navigate to the `backend` folder: `cd backend`
2. Create a virtual environment: `python -m venv venv`
3. Activate it: `.\venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Mac/Linux)
4. Install dependencies: `pip install -r requirements.txt`
5. Copy `.env.example` to `.env` and fill in your keys:
   - `GEMINI_API_KEY`
   - `MONGODB_URI`
6. Run the server: `fastapi dev main.py`

### Frontend Setup
1. Navigate to the `frontend` folder: `cd frontend`
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`

## 7. API Usage Guide
**Endpoint:** `POST /api/simulate`
**Content-Type:** `application/json`

**Request Body:**
```json
{
  "content": "Just bought a new house at 22! Here's how I did it..."
}
```

**Response Example:**
Returns a comprehensive JSON object including `content_analysis`, `persona_reactions` (array), `mcp_trend_insights`, `scores` (engagement, virality, controversy), `risk_analysis`, `suggestions` (array), and `optimized_content`.

## 8. Future Improvements
- Add more diverse and hyper-specific personas based on real-time social media scraping.
- Support multimodal input (images/videos) using Gemini Pro Vision.
- Persist simulation history in a database to learn from past predictions.
- Expand MCP integrations (e.g., Elastic MCP for real-time news context).

## License
This project is open-source and available under the [MIT License](LICENSE).
