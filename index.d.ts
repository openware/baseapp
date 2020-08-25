declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.json';

declare namespace Config {
    export const app: AppConfig;
}

declare module 'config' {
    export = Config;
}

interface AppConfig {
    api: {
        authUrl: string;
        tradeUrl: string;
        applogicUrl: string;
        rangerUrl: string;
        finexUrl: string;
    };
    minutesUntilAutoLogout: number;
    withCredentials: boolean;
    gaTrackerKey: string;
    rangerReconnectPeriod: number;
    msAlertDisplayTime: number;
    incrementalOrderBook: boolean;
    finex: boolean;
    isResizable: boolean;
    isDraggable: boolean;
    languages: string[];
    sessionCheckInterval: number;
    balancesFetchInterval: number;
    passwordEntropyStep: number;
    showLanding: boolean;
    sentryEnabled: boolean;
    kycSteps: string[];
}

interface Window {
    TradingView?: any;
    __REDUX_DEVTOOLS_EXTENSION__: () => void;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: (a?: any) => any;
}

declare const __webpack_hash__: string;
