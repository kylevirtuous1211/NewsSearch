$env:GOOGLE_APPLICATION_CREDENTIALS = "..\newssearch-480809-e63a08f6435d.json"
venv\bin\python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
