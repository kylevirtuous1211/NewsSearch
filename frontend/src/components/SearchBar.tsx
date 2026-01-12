import React from 'react';

interface SearchBarProps {
    query: string;
    loading: boolean;
    setQuery: (query: string) => void;
    onSearch: (e: React.FormEvent) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ query, loading, setQuery, onSearch }) => {
    return (
        <form onSubmit={onSearch} className="mb-12 relative max-w-2xl mx-auto">
            <div className="relative group">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for topics like 'Semiconductor War', 'AI regulation', 'Middle East'..."
                    className="w-full px-6 py-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-slate-500 group-hover:bg-slate-800/70"
                />
                <button
                    type="submit"
                    disabled={loading || !query.trim()}
                    className="absolute right-3 top-2 bottom-2 px-6 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-xl font-medium transition-all"
                >
                    {loading ? "Searching..." : "Search"}
                </button>
            </div>
        </form>
    );
};
