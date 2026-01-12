from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn

from db.client import DatabaseFactory
from api import news, search

# Lifecycle Manager
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize DB
    await DatabaseFactory.initialize()
    yield
    # Shutdown: Close DB
    await DatabaseFactory.shutdown()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "Backend is running", "docs_url": "/docs"}

# Register Routers
app.include_router(news.router, prefix="/api")
app.include_router(search.router, prefix="/api")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
