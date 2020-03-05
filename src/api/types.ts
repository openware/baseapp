export interface Config {
    api: {
        authUrl: string;
        tradeUrl: string;
        applogicUrl: string;
        rangerUrl: string;
        arkeUrl: string;
        finexUrl: string;
    };
    minutesUntilAutoLogout?: string;
    rangerReconnectPeriod?: string;
    withCredentials: boolean;
    storage: {
        defaultStorageLimit?: number;
    };
    gaTrackerKey?: string;
    msAlertDisplayTime?: string;
    incrementalOrderBook: boolean;
    finex: boolean;
    isResizable: boolean;
    isDraggable: boolean;
    languages: string[];
    sessionCheckInterval: string;
    balancesFetchInterval: string;
}
