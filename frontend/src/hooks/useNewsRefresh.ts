import { useState, useCallback } from 'react';
import { RefreshStatus } from '@/types';
import { refreshNews, getRefreshStatus } from '@/lib/api';

export const useNewsRefresh = () => {
    const [refreshing, setRefreshing] = useState(false);
    const [refreshStatus, setRefreshStatus] = useState<RefreshStatus | null>(null);

    const pollStatus = useCallback(async () => {
        const interval = setInterval(async () => {
            try {
                const status = await getRefreshStatus();
                setRefreshStatus(status);
                if (!status.is_refreshing) {
                    clearInterval(interval);
                    setRefreshing(false);
                }
            } catch (error) {
                console.error("Error polling status", error);
                clearInterval(interval);
                setRefreshing(false);
            }
        }, 1000);
    }, []);

    const handleRefresh = async () => {
        try {
            setRefreshing(true);
            await refreshNews();
            pollStatus();
        } catch (error) {
            console.error("Error starting refresh", error);
            setRefreshing(false);
        }
    };

    return {
        refreshing,
        refreshStatus,
        handleRefresh
    };
};
