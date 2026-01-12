from fastapi import APIRouter, BackgroundTasks
import asyncio
from schemas.models import RefreshStatus
from services import rss, nlp, storage
from config import ALL_URLS

router = APIRouter()

# Global Status
REFRESH_STATUS = {
    "is_refreshing": False,
    "current_step": "Idle",
    "details": ""
}

@router.get("/refresh-status")
def get_refresh_status():
    return REFRESH_STATUS

async def run_refresh_task():
    global REFRESH_STATUS
    REFRESH_STATUS["is_refreshing"] = True
    try:
        print("Starting background refresh...")
        
        # 1. Fetch (Network/CPU bound - offload to thread)
        REFRESH_STATUS["current_step"] = "Fetching RSS Feeds"
        REFRESH_STATUS["details"] = f"Connecting to {len(ALL_URLS)} sources..."
        print(f"Fetching RSS feeds from {len(ALL_URLS)} sources...")
        
        articles = await asyncio.to_thread(rss.fetch_rss_feeds, ALL_URLS)
        print(f"Fetched {len(articles)} total articles.")
        
        # 2. Process
        REFRESH_STATUS["current_step"] = "Analyzing & Embedding"
        processed_articles = []
        for i, article in enumerate(articles):
            try:
                msg = f"Processing {i+1}/{len(articles)}: {article.title[:30]}..."
                print(msg)
                REFRESH_STATUS["details"] = msg
                
                text_content = article.title + " " + article.summary
                
                # Sentiment (CPU bound)
                sentiment = await asyncio.to_thread(nlp.analyze_sentiment, text_content)
                article.sentiment = sentiment

                # Embedding (CPU bound)
                embedding = await asyncio.to_thread(nlp.generate_embedding, text_content)
                article.embedding = embedding

                processed_articles.append(article)
            except Exception as e:
                print(f"Error processing article {i}: {e}")

        # 3. Deduplicate (CPU bound)
        REFRESH_STATUS["current_step"] = "Deduplicating"
        print(f"Deduplicating {len(processed_articles)} articles...")
        initial_count = len(processed_articles)
        
        processed_articles = await asyncio.to_thread(nlp.deduplicate_articles, processed_articles)
        
        removed_count = initial_count - len(processed_articles)
        print(f"Deduplication removed {removed_count} articles.")

        # 4. Store (IO bound - async)
        REFRESH_STATUS["current_step"] = "Saving to Database"
        REFRESH_STATUS["details"] = f"Batch writing {len(processed_articles)} articles..."
        print(f"Storing {len(processed_articles)} articles to Firestore...")
        
        count = await storage.store_articles(processed_articles)
        print(f"Background refresh complete. Successfully stored {count} articles.")
        
        REFRESH_STATUS["current_step"] = "Complete"
        REFRESH_STATUS["details"] = f"Successfully processed {count} articles."
    except Exception as e:
        print(f"Background refresh failed: {e}")
        REFRESH_STATUS["current_step"] = "Error"
        REFRESH_STATUS["details"] = str(e)
        import traceback
        traceback.print_exc()
    finally:
        REFRESH_STATUS["is_refreshing"] = False

@router.post("/refresh-news")
async def refresh_news(background_tasks: BackgroundTasks):
    if REFRESH_STATUS["is_refreshing"]:
         return {"status": "Refresh already in progress"}
         
    background_tasks.add_task(run_refresh_task)
    return {"status": "Refresh started in background"}
