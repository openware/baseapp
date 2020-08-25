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
    version: string;
}

interface Window {
    TradingView?: any;
    __REDUX_DEVTOOLS_EXTENSION__: () => void;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: (a?: any) => any;
}

declare const __webpack_hash__: string;
