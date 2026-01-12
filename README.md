# Geopolitical News RAG

## Prerequisites
- Python 3.11+
- Node.js & npm
- Google Cloud Project with Firestore enabled
- Service Account Key (JSON) placed in the project root.

## Backend Setup (Python/FastAPI)

1.  **Navigate to backend:**
    ```bash
    cd backend
    ```

2.  **Activate your environment:**
    *   **Conda:** `conda activate newssearch`
    *   **Venv:** `.\venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Linux/Mac)

3.  **Install Dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Run the Server:**
    **Bash/Git Bash:**
    ```bash
    export GOOGLE_APPLICATION_CREDENTIALS="../newssearch-480809-e63a08f6435d.json"
    python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
    ```

## Frontend Setup (Next.js)

1.  **Navigate to frontend:**
    ```bash
    cd frontend
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Run Development Server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) to view the app.
