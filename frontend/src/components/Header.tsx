import React from 'react';
import { RefreshStatus } from '@/types';

interface HeaderProps {
    refreshing: boolean;
    refreshStatus: RefreshStatus | null;
    onRefresh: () => void;
}

export const Header: React.FC<HeaderProps> = ({ refreshing, refreshStatus, onRefresh }) => {
    return (
        <div className="flex justify-between items-center mb-12">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                Global News Pulse
            </h1>
            <button
                onClick={onRefresh}
                disabled={refreshing}
                className={`px-6 py-2 rounded-full font-medium transition-all ${refreshing
                        ? "bg-slate-800 text-slate-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg hover:shadow-blue-500/25"
                    }`}
            >
                {refreshing ? (
                    <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                        {refreshStatus ? refreshStatus.current_step : "Refreshing..."}
                    </span>
                ) : (
                    "Refresh Sources"
                )}
            </button>
        </div>
    );
};
