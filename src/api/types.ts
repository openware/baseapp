export interface Config {
    api: {
        authUrl: string;
        tradeUrl: string;
        applogicUrl: string;
        rangerUrl: string;
        finexUrl: string;
    };
    minutesUntilAutoLogout?: string;
    rangerReconnectPeriod?: string;
    withCredentials: boolean;
    storage: {
        defaultStorageLimit?: number;
        orderBookSideLimit?: number;
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
    passwordEntropyStep: number;
    showLanding: boolean;
    sentryEnabled?: boolean;
}
