import { useState } from 'react';
import { Article } from '@/types';
import { searchNews } from '@/lib/api';

export const useNewsSearch = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const results = await searchNews(query);
            setArticles(results);
        } catch (err: any) {
            setError(err.message || 'Search failed');
        } finally {
            setLoading(false);
        }
    };

    return {
        articles,
        query,
        setQuery,
        loading,
        error,
        handleSearch
    };
};
