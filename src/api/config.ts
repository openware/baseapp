import { Config } from './types';

export const defaultConfig: Config = {
    api: {
        gatewayUrl: '/',
        rangerUrl: '',
    },
    minutesUntilAutoLogout: '5',
    withCredentials: true,
};

export const Cryptobase = {
    config: defaultConfig,
};

declare global {
    interface Window { env: Config; }
}

window.env = window.env || defaultConfig;
Cryptobase.config = {...window.env};

export const gatewayUrl = () => Cryptobase.config.api.gatewayUrl;
export const rangerUrl = () => Cryptobase.config.api.rangerUrl;
export const minutesUntilAutoLogout = () => Cryptobase.config.minutesUntilAutoLogout;
export const withCredentials = () => Cryptobase.config.withCredentials;

