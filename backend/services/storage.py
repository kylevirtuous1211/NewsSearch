import asyncio
from typing import List, Dict, Any
from google.cloud.firestore_v1.vector import Vector
from google.cloud.firestore_v1.base_vector_query import DistanceMeasure
from schemas.models import Article
from db.client import DatabaseFactory

async def store_articles(articles: List[Article]):
    db = DatabaseFactory.get_db()
    if not db:
        print("Firestore not initialized")
        return 0
    
    collection = db.collection('news_articles')
    
    # Delete existing (async)
    await delete_collection(collection, batch_size=10)

    batch = db.batch()
    batch_count = 0
    total_count = 0
    
    for article in articles:
        # Convert pydantic model to dict
        data = article.model_dump() # or .dict() for older pydantic
        
        # Convert embedding list to Firestore Vector
        if data.get('embedding'):
            data['embedding'] = Vector(data['embedding'])

        doc_ref = collection.document()
        batch.set(doc_ref, data)
        batch_count += 1
        total_count += 1
        
        if batch_count >= 10:
            await batch.commit()
            batch = db.batch()
            batch_count = 0
    
    if batch_count > 0:
        await batch.commit()
    
    return total_count

async def delete_collection(coll_ref, batch_size):
    # Async stream of documents
    docs = coll_ref.limit(batch_size).stream()
    deleted = 0
    
    # In async client, stream() returns an async generator
    async for doc in docs:
        await doc.reference.delete()
        deleted = deleted + 1

    if deleted >= batch_size:
        await delete_collection(coll_ref, batch_size)

async def search_articles(query_vector: List[float], limit: int = 10):
    db = DatabaseFactory.get_db()
    if not db:
        print("Error: Firestore DB not initialized.")
        return []
    
    collection = db.collection('news_articles')
    
    try:
        print(f"Executing vector search for query...")
        # find_nearest returns a VectorQuery
        vector_query = collection.find_nearest(
            vector_field="embedding",
            query_vector=Vector(query_vector),
            distance_measure=DistanceMeasure.COSINE,
            limit=limit
        )
        
        # Execute the query asynchronously
        results = await vector_query.get()
        
        print(f"Vector search returned {len(results)} raw results.")
        
        docs = [doc.to_dict() for doc in results]
        
        # Check if we need to convert back to schema or dict is fine
        # The caller (main.py) returns json, so list of dicts is fine.
        print(f"Processed {len(docs)} documents from search results.")
        return docs
    except Exception as e:
        print(f"Vector search failed: {e}")
        return []
