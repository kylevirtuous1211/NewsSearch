from pydantic import BaseModel, Field
from typing import List, Optional, Any

class Article(BaseModel):
    title: str
    link: str
    summary: str
    published: str
    source: str
    sentiment: Optional[float] = None
    embedding: Optional[List[float]] = None

    class Config:
        arbitrary_types_allowed = True

class SearchRequest(BaseModel):
    query: str
    limit: Optional[int] = 50

class RefreshStatus(BaseModel):
    is_refreshing: bool
    current_step: str
    details: str
