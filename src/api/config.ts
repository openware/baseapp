import { STORAGE_DEFAULT_LIMIT } from '../constants';
import { Config } from './types';

export const defaultConfig: Config = {
    api: {
        gatewayUrl: '/',
        rangerUrl: '',
    },
    minutesUntilAutoLogout: '5',
    withCredentials: true,
    siteKey: '',
    storage: {},
};

export const Cryptobase = {
    config: defaultConfig,
};

declare global {
    interface Window { env: Config; }
}

window.env = window.env || defaultConfig;
Cryptobase.config = {...window.env};
Cryptobase.config.storage = Cryptobase.config.storage || {};

export const gatewayUrl = () => Cryptobase.config.api.gatewayUrl;
export const rangerUrl = () => Cryptobase.config.api.rangerUrl;
export const minutesUntilAutoLogout = () => Cryptobase.config.minutesUntilAutoLogout;
export const withCredentials = () => Cryptobase.config.withCredentials;
export const defaultStorageLimit = () => Cryptobase.config.storage.defaultStorageLimit || STORAGE_DEFAULT_LIMIT;
export const siteKey = () => Cryptobase.config.siteKey;
