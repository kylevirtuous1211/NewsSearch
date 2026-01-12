import React from 'react';
import { Article } from '@/types';

interface ArticleCardProps {
    article: Article;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
    const getSentimentColor = (score?: number) => {
        if (score === undefined) return "bg-slate-700 text-slate-300";
        if (score > 0.3) return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
        if (score < -0.3) return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
        return "bg-slate-500/10 text-slate-400 border border-slate-500/20";
    };

    return (
        <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group block p-6 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-blue-500/30 rounded-2xl transition-all hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 h-full flex flex-col"
        >
            <div className="flex justify-between items-start gap-4 mb-4">
                <span className="text-xs font-semibold tracking-wider text-blue-400 uppercase">
                    {article.source}
                </span>
                {article.sentiment !== undefined && (
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getSentimentColor(article.sentiment)}`}>
                        {article.sentiment > 0 ? "Positive" : article.sentiment < 0 ? "Negative" : "Neutral"}
                    </span>
                )}
            </div>

            <h3 className="text-xl font-semibold mb-3 leading-tight group-hover:text-blue-400 transition-colors">
                {article.title}
            </h3>

            <p className="text-slate-400 text-sm line-clamp-3 mb-4 flex-grow">
                {article.summary.replace(/<[^>]*>/g, '')}
            </p>

            <div className="flex items-center text-xs text-slate-500 mt-auto pt-4 border-t border-slate-700/50">
                {new Date(article.published).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                })}
            </div>
        </a>
    );
};
