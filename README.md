# GeoImpact Intelligence

Production-grade real-world event impact analysis. The system never assumes sufficient data exists — it validates events, scores evidence sufficiency (HIGH / MEDIUM / LOW / INSUFFICIENT), and degrades graph complexity instead of crashing or inventing causal chains.

## Features
- **Any event category**: Wars, disasters, tariffs, cyber attacks, regulation, supply chain shocks, corporate events, and more — dynamically classified, not hardcoded.
- **Evidence sufficiency engine**: Governs propagation depth and whether a graph is rendered at all.
- **Graceful degradation**: Event not found, insufficient evidence, sparse nodes, and partial API failures each have explicit UX outcomes.
- **Explainable outputs**: Reasoning chains, confidence scores, source health, and raw provenance.

## Tech Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Cytoscape.js, Zustand.
- **Backend**: Python 3.13, FastAPI, NetworkX, Neo4j (Optional Fallback).

## Professional Local Setup (No Docker)

### 1. Backend Setup
The system is optimized for Python 3.13. 
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Frontend Setup
```powershell
cd frontend
npm install
npm run dev
```

### 3. Environment Configuration
Ensure you have a `.env` in the root with:
```env
NEWS_API_KEY=your_key
ALPHA_VANTAGE_API_KEY=your_key
OPENROUTER_API_KEY=your_key
```

## Running the Platform
Once both servers are running:
1. Access the UI at `http://localhost:3000`.
2. Enter a geopolitical event (e.g., "Israel Iran conflict").
3. View the live signal propagation graph and reasoning logs.
