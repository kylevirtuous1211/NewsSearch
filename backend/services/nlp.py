from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from sentence_transformers import SentenceTransformer, util
from typing import List
from schemas.models import Article

# Initialize Models
analyzer = SentimentIntensityAnalyzer()
model = SentenceTransformer('all-MiniLM-L6-v2')

def analyze_sentiment(text: str) -> float:
    """Returns compound score: -1 (Negative) to +1 (Positive)"""
    return analyzer.polarity_scores(text)['compound']

def generate_embedding(text: str) -> List[float]:
    return model.encode(text).tolist()

def deduplicate_articles(articles: List[Article], threshold: float = 0.85) -> List[Article]:
    unique_articles = []
    
    for article in articles:
        is_duplicate = False
        current_embedding = article.embedding
        
        # If no embedding, we can't semantically check, so just add it
        if current_embedding is None:
            unique_articles.append(article)
            continue

        for unique_article in unique_articles:
            unique_embedding = unique_article.embedding
            if unique_embedding is None:
                continue
            
            # Calculate similarity
            score = util.cos_sim(current_embedding, unique_embedding)
            if score.item() > threshold:
                is_duplicate = True
                break
        
        if not is_duplicate:
            unique_articles.append(article)
            
    return unique_articles
