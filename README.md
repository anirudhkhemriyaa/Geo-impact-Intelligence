# 🌍 GeoImpact Intelligence

Production-grade real-world event impact analysis that scores evidence sufficiency and maps causal propagation — built for analysts who need signal, not speculation.

<p>
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Cytoscape.js-F58025?style=for-the-badge&logo=graphql&logoColor=white" alt="Cytoscape.js" />
  <img src="https://img.shields.io/badge/Zustand-433E38?style=for-the-badge&logo=react&logoColor=white" alt="Zustand" />
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/NetworkX-11557C?style=for-the-badge&logo=graphviz&logoColor=white" alt="NetworkX" />
  <img src="https://img.shields.io/badge/Neo4j-008CC1?style=for-the-badge&logo=neo4j&logoColor=white" alt="Neo4j" />
</p>

## ✨ Features

- **Any event category** – Wars, disasters, tariffs, cyber attacks, regulation, supply chain shocks, corporate events, and more, dynamically classified rather than hardcoded.
- **Evidence sufficiency engine** – Every event is scored HIGH / MEDIUM / LOW / INSUFFICIENT before any graph is built, so the system never fabricates a causal chain from weak data.
- **Graceful degradation** – Event not found, insufficient evidence, sparse nodes, and partial API failures all resolve to explicit, distinct UX outcomes instead of silent failure.
- **Explainable outputs** – Every graph ships with its reasoning chain, confidence scores, source health, and raw provenance so results can be audited, not just trusted.

## 🏗️ Architecture

```mermaid
flowchart LR
    A[Next.js Frontend] -->|event query| B[FastAPI Backend]
    B --> C[Evidence Sufficiency Engine]
    C -->|fetch signals| D[NewsAPI]
    C -->|fetch signals| E[Alpha Vantage]
    C -->|classify / reason| F[OpenRouter LLM]
    C -->|sufficiency: HIGH/MEDIUM/LOW| G[NetworkX Graph Builder]
    G -.optional.-> H[(Neo4j)]
    G -->|graph + reasoning chain| B
    B -->|JSON response| A
    A --> I[Cytoscape.js Graph View]
    A --> J[Zustand State Store]

    style A fill:#000000,color:#fff
    style B fill:#009688,color:#fff
    style C fill:#334155,color:#fff
    style D fill:#DC2626,color:#fff
    style E fill:#FFD200,color:#000
    style F fill:#6366F1,color:#fff
    style G fill:#11557C,color:#fff
    style H fill:#008CC1,color:#fff
    style I fill:#F58025,color:#fff
    style J fill:#433E38,color:#fff
```

**How it flows:**
1. The user enters an event on the Next.js frontend, which sends the query to the FastAPI backend.
2. The backend pulls raw signals from NewsAPI and Alpha Vantage, then uses OpenRouter to classify the event and assist with reasoning.
3. The evidence sufficiency engine scores the result as HIGH, MEDIUM, LOW, or INSUFFICIENT — this score gates everything downstream.
4. If sufficiency allows it, NetworkX builds the propagation graph (with Neo4j available as an optional store/fallback); the graph, reasoning chain, and confidence scores are returned to the frontend.
5. The frontend renders the graph in Cytoscape.js and manages UI state with Zustand.

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | Next.js 14 (TypeScript) |
| Styling | Tailwind CSS |
| Graph Visualization | Cytoscape.js |
| Client State | Zustand |
| Backend Framework | FastAPI (Python 3.13) |
| Graph Computation | NetworkX |
| Graph Storage (Optional) | Neo4j |
| External Data | NewsAPI, Alpha Vantage |
| LLM Reasoning | OpenRouter |

## 🚀 Run Locally

### 1. Backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Frontend

```powershell
cd frontend
npm install
npm run dev
```

### 3. Environment Configuration

Create a `.env` in the project root:

```env
NEWS_API_KEY=your_key
ALPHA_VANTAGE_API_KEY=your_key
OPENROUTER_API_KEY=your_key
```

### Entry Points

| URL | View |
|---|---|
| `http://localhost:3000` | Frontend UI |
| `http://localhost:8000` | Backend API |

## 📓 Notes

- Backend targets Python 3.13 specifically.
- Neo4j is an optional fallback for graph storage/computation.
- No Docker setup is provided; both servers are run directly via venv/npm.
- Evidence sufficiency score gates graph rendering — sparse or INSUFFICIENT-rated events will not produce a full propagation graph.

---

<p align="center">
  Built by <a href="https://github.com/anirudhkhemriyaa">Anirudha Khemriya</a>
</p>