"use client";

import { useState } from "react";
import { refreshNews, searchNews, getRefreshStatus, Article } from "@/lib/api";
import { Loader2, Search, RefreshCw, ExternalLink } from "lucide-react";
import clsx from "clsx";

export default function Home() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [refreshStatus, setRefreshStatus] = useState<string | null>(null);

    const handleRefresh = async () => {
        setRefreshing(true);
        setRefreshStatus("Starting refresh...");

        try {
            // Start the refresh
            await refreshNews();

            // Poll for status
            const intervalId = setInterval(async () => {
                try {
                    const status = await getRefreshStatus();
                    setRefreshStatus(`${status.current_step}: ${status.details}`);

                    if (!status.is_refreshing) {
                        clearInterval(intervalId);
                        setRefreshing(false);
                        setRefreshStatus(status.current_step === "Complete" ? status.details : "Refresh failed or stopped.");
                    }
                } catch (e) {
                    console.error("Polling error", e);
                }
            }, 1000);

        } catch (error) {
            setRefreshStatus("Failed to start refresh.");
            setRefreshing(false);
            console.error(error);
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        try {
            const results = await searchNews(query);
            setArticles(results);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-200 dark:border-gray-800 pb-6">
                    <h1 className="text-4xl font-extrabold text-[rgba(188,113,113,1)] drop-shadow-lg tracking-tight">
                        News Search FAST! No more manual search
                    </h1>

                    <div className="flex items-center gap-4">
                        {refreshStatus && (
                            <span className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
                                {refreshStatus}
                            </span>
                        )}
                        <button
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all disabled:opacity-50"
                        >
                            {refreshing ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <RefreshCw className="w-4 h-4" />
                            )}
                            Refresh Sources
                        </button>
                    </div>
                </div>

                {/* Search Section */}
                <div className="relative max-w-2xl mx-auto">
                    <form onSubmit={handleSearch} className="relative">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search for topics (e.g., 'border conflict', 'semiconductors')..."
                            className="w-full px-6 py-4 pl-14 rounded-2xl border border-gray-200 bg-white shadow-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-lg text-gray-900"
                        />
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                        <button
                            type="submit"
                            disabled={loading}
                            className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? "Searching..." : "Search"}
                        </button>
                    </form>
                </div>

                {/* Results Grid */}
                {articles.length === 0 && !loading ? (
                    <div className="text-center py-12">
                        <p className="text-xl text-gray-500 dark:text-gray-400">
                            No articles found. Try searching for something else or refresh sources.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {articles.map((article, idx) => (
                            <a
                                key={idx}
                                href={article.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block group h-full"
                            >
                                <article className="h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 dark:border-gray-800 flex flex-col">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                                            {article.source}
                                        </span>
                                        {article.sentiment !== undefined && (
                                            <span
                                                className={clsx(
                                                    "text-xs font-bold px-3 py-1 rounded-full",
                                                    article.sentiment! > 0.05
                                                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                                        : article.sentiment! < -0.05
                                                            ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                                                            : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                                                )}
                                            >
                                                {article.sentiment! > 0.05
                                                    ? "Positive"
                                                    : article.sentiment! < -0.05
                                                        ? "Negative"
                                                        : "Neutral"}
                                            </span>
                                        )}
                                    </div>
                                    <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                                        {article.title}
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3 mb-4 flex-grow">
                                        {article.summary}
                                    </p>
                                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                                        {new Date(article.published).toLocaleDateString(undefined, {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </div>
                                </article>
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
