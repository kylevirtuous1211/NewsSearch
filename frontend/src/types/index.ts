export interface Article {
    title: string;
    link: string;
    summary: string;
    published: string;
    source: string;
    sentiment?: number;
}

export interface RefreshStatus {
    is_refreshing: boolean;
    current_step: string;
    details: string;
}
