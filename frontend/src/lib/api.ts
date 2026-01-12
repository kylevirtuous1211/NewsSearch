import { Article, RefreshStatus } from '@/types';

const API_BASE_URL = "http://localhost:8000/api";

export const refreshNews = async (): Promise<{ status: string; articles_processed: number }> => {
    const response = await fetch(`${API_BASE_URL}/refresh-news`, {
        method: "POST",
    });
    if (!response.ok) {
        throw new Error("Failed to refresh news");
    }
    return response.json();
};

export const searchNews = async (query: string): Promise<Article[]> => {
    const response = await fetch(`${API_BASE_URL}/search`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
    });
    if (!response.ok) {
        throw new Error("Failed to search news");
    }
    return response.json();
};

export const getRefreshStatus = async (): Promise<RefreshStatus> => {
    const response = await fetch(`${API_BASE_URL}/refresh-status`);
    if (!response.ok) {
        throw new Error("Failed to get refresh status");
    }
    return response.json();
};
