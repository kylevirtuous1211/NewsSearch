RSS_URLS = [
    # --- Official Feeds (Reliable) ---
    "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",       # NYT World
    "https://feeds.bbci.co.uk/news/world/rss.xml",                  # BBC World
    "https://www.aljazeera.com/xml/rss/all.xml",                    # Al Jazeera
    
    # --- The Google News "Bridge" (For sites without RSS) ---
    # Bloomberg Politics
    "https://news.google.com/rss/search?q=site:bloomberg.com+politics&ceid=US:en&hl=en-US&gl=US",
    
    # Reuters World
    "https://news.google.com/rss/search?q=site:reuters.com+topic:WORLD&ceid=US:en&hl=en-US&gl=US",
    
    # Financial Times (Optional - often paywalled hard)
    "https://news.google.com/rss/search?q=site:ft.com&ceid=US:en&hl=en-US&gl=US"
]

# Combine all URLs
ALL_URLS = RSS_URLS

# Other Websites: Politico, the guardian, AP news
