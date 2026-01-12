"use client";

import { useNewsSearch } from "@/hooks/useNewsSearch";
import { useNewsRefresh } from "@/hooks/useNewsRefresh";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { ArticleList } from "@/components/ArticleList";

export default function Home() {
    const { articles, query, setQuery, loading: searchLoading, error, handleSearch } = useNewsSearch();
    const { refreshing, refreshStatus, handleRefresh } = useNewsRefresh();

    return (
        <main className="min-h-screen bg-slate-950 text-slate-200 selection:bg-blue-500/30">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <Header
                    refreshing={refreshing}
                    refreshStatus={refreshStatus}
                    onRefresh={handleRefresh}
                />

                <div className="text-center mb-16">
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        Real-time semantic search across global news sources.
                        Powered by vector embeddings for understanding context, not just keywords.
                    </p>
                </div>

                <SearchBar
                    query={query}
                    loading={searchLoading}
                    setQuery={setQuery}
                    onSearch={handleSearch}
                />

                {error && (
                    <div className="text-center mb-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400">
                        {error}
                    </div>
                )}

                <ArticleList
                    articles={articles}
                    loading={searchLoading}
                    hasSearched={query.length > 0 && !searchLoading}
                />
            </div>
        </main>
    );
}
