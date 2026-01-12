from fastapi import APIRouter, HTTPException
import asyncio
from schemas.models import SearchRequest
from services import nlp, storage

router = APIRouter()

@router.post("/search")
async def search(request: SearchRequest):
    try:
        # 1. Embed Query (CPU bound)
        query_vector = await asyncio.to_thread(nlp.generate_embedding, request.query)
        
        # 2. Search (IO bound - async)
        results = await storage.search_articles(query_vector, limit=request.limit)
        
        # Remove embedding from response to save bandwidth
        # results is a list of dicts
        for res in results:
            if 'embedding' in res:
                del res['embedding']
                
        return results

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
