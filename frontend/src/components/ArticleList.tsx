import React from 'react';
import { Article } from '@/types';
import { ArticleCard } from './ArticleCard';

interface ArticleListProps {
    articles: Article[];
    loading: boolean;
    hasSearched: boolean; // simple heuristic: if articles array is empty but we haven't searched, show nothing or placeholder
}

export const ArticleList: React.FC<ArticleListProps> = ({ articles, loading, hasSearched }) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-64 bg-slate-800/50 rounded-2xl border border-slate-700/50" />
                ))}
            </div>
        );
    }

    if (articles.length === 0 && hasSearched) {
        return (
            <div className="text-center py-20">
                <div className="text-slate-600 text-lg">No articles found matching your query.</div>
            </div>
        );
    }

    if (articles.length === 0) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, i) => (
                <ArticleCard key={i} article={article} />
            ))}
        </div>
    );
};
