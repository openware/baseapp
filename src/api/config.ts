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

export const gatewayUrl = window.env.api.gatewayUrl;
export const rangerUrl = window.env.api.rangerUrl;
export const minutesUntilAutoLogout = window.env.minutesUntilAutoLogout;
export const withCredentials = window.env.withCredentials;

Cryptobase.config = {
    api: {
        gatewayUrl,
        rangerUrl,
    },
    minutesUntilAutoLogout,
    withCredentials,
};
