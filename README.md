# Global News Pulse (NewsSearch)

A semantic search engine for geopolitical news, powered by AI. This application aggregates news from multiple global sources, analyzes sentiment, generates vector embeddings for semantic understanding, and allows users to search for topics conceptually rather than just by keyword.

## Features

-   **Semantic Search**: Uses `sentence-transformers` (all-MiniLM-L6-v2) to understand the meaning of your query.
-   **Sentiment Analysis**: `VaderSentiment` scores articles as Positive, Negative, or Neutral.
-   **Automated Aggregation**: Fetches RSS feeds from Reuters, Bloomberg, Al Jazeera, BBC, and more.
-   **Vector Database**: Google Cloud Firestore with vector indexing for fast similarity search.
-   **Modern UI**: Next.js 14 frontend with Tailwind CSS, custom hooks, and modular components.

## Architecture

### Backend (FastAPI)
The backend is structured for modularity and scalability:
-   **`api/`**: Route handlers (`news.py` for refreshing, `search.py` for querying).
-   **`services/`**: Core business logic.
    -   `rss.py`: Handles fetching/parsing RSS feeds.
    -   `nlp.py`: Handles embeddings, sentiment analysis, and deduplication.
    -   `storage.py`: Manages Firestore interactions.
-   **`db/`**: Database connection factory (Singleton pattern) and initialization scripts.
-   **`schemas/`**: Pydantic models for data validation (`Article`, `SearchRequest`).

### Frontend (Next.js)
The frontend separates UI from logic using best practices:
-   **`components/`**: Reusable UI elements (`Header`, `SearchBar`, `ArticleCard`, `ArticleList`).
-   **`hooks/`**: Custom logic encapsulation (`useNewsSearch`, `useNewsRefresh`).
-   **`types/`**: Shared TypeScript definitions.

## Prerequisites

-   Python 3.11+
-   Node.js 18+ & npm
-   Google Cloud Project with Firestore enabled.
-   **Service Account Key**: Place your JSON key file (e.g., `newssearch-xyz.json`) in the project root.

## Setup & Running

### 1. Backend Setup

```bash
# Navigate to backend
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Verify Database Connection (Update path to your JSON key)
export GOOGLE_APPLICATION_CREDENTIALS="../your-key-file.json"
python db/init_db.py

# Run the Server
python -m uvicorn main:app --reload
```
Review the API docs at: http://localhost:8000/docs

### 2. Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Run Development Server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

## Development Workflows

-   **Adding Sources**: Update `backend/config.py`.
-   **Modifying Data Models**: Update `backend/schemas/models.py`.
-   **Styling**: Uses Tailwind CSS in `frontend`.
