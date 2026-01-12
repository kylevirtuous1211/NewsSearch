# Configuration
GOOGLE_NEWS_TOPICS = {
    "Geopolitics": "https://news.google.com/rss/search?q=geopolitics+when:48h&ceid=US:en&hl=en-US&gl=US",
    "Semiconductor War": "https://news.google.com/rss/search?q=semiconductor+china+usa+when:48h&ceid=US:en&hl=en-US&gl=US",
    "Reuters_Global": "https://news.google.com/rss/search?q=site:reuters.com+when:48h&ceid=US:en&hl=en-US&gl=US",
    "Reuters_World": "https://news.google.com/rss/search?q=site:reuters.com+world+when:48h&ceid=US:en&hl=en-US&gl=US",
    "Reuters_Business": "https://news.google.com/rss/search?q=site:reuters.com+business+when:48h&ceid=US:en&hl=en-US&gl=US",
    "Reuters_Tech": "https://news.google.com/rss/search?q=site:reuters.com+technology+when:48h&ceid=US:en&hl=en-US&gl=US"
}

RSS_URLS = [
    "https://www.theguardian.com/world/rss",
    "https://feeds.bbci.co.uk/news/world/rss.xml",
    "https://www.aljazeera.com/xml/rss/all.xml",
    "https://news.un.org/feed/subscribe/en/news/all/rss.xml",
    "https://www.defensenews.com/arc/outboundfeeds/rss/",
    "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
    "https://feeds.a.dj.com/rss/RSSWorldNews.xml",
    "https://feeds.bloomberg.com/politics/news.rss",
    "https://feeds.bloomberg.com/markets/news.rss",
    "https://feeds.bloomberg.com/technology/news.rss",
    "https://feeds.washingtonpost.com/rss/world",
    "https://www.ft.com/world?format=rss",
]

# Combine all URLs
ALL_URLS = list(GOOGLE_NEWS_TOPICS.values()) + RSS_URLS
