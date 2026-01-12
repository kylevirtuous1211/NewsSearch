import feedparser
import datetime
from typing import List
from schemas.models import Article

def fetch_rss_feeds(urls: List[str]) -> List[Article]:
    articles = []
    cutoff_time = datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(hours=12)
    
    seen_links = set()
    
    for url in urls:
        try:
            feed = feedparser.parse(url)
            for entry in feed.entries:
                # Parse date
                published_dt = None
                if hasattr(entry, 'published_parsed') and entry.published_parsed:
                    # Convert struct_time to datetime (UTC)
                    try:
                        dt = datetime.datetime(*entry.published_parsed[:6])
                        published_dt = dt.replace(tzinfo=datetime.timezone.utc)
                    except:
                        pass
                
                # Filter by date (if available)
                if published_dt and published_dt < cutoff_time:
                    continue
                
                link = entry.get("link", "")
                if link in seen_links:
                    continue
                seen_links.add(link)

                article = Article(
                    title=entry.get("title", ""),
                    link=link,
                    summary=entry.get("summary", "") or entry.get("description", ""),
                    published=entry.get("published", str(datetime.datetime.now())),
                    source=feed.feed.get("title", "Unknown")
                )
                articles.append(article)
        except Exception as e:
            print(f"Error fetching {url}: {e}")
    return articles
