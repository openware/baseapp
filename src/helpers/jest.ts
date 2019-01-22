import Axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Action, Middleware } from 'redux';
import configureMockStore from 'redux-mock-store';
import { Config, Cryptobase } from '../api';

const mockConfig: Config = {
    api: {
        gatewayUrl: '/api/v2',
        rangerUrl: '',
    },
    minutesUntilAutoLogout: '5',
    withCredentials: true,
};

// tslint:disable no-any no-console

export const loggerMiddleware: Middleware = (store: {}) => (next: any) => (action: Action) => {
    console.log(`dispatching: ${JSON.stringify(action)}`);
    return next(action);
};

export const setupMockStore = (appMiddleware: Middleware, log = false) => {
    const middlewares = log ? [loggerMiddleware, appMiddleware] : [appMiddleware];
    return configureMockStore(middlewares);
};

export const setupMockAxios = () => {
    Cryptobase.config = mockConfig;
    return new MockAdapter(Axios);
};

export const mockNetworkError = (mockAxios: any) => {
    mockAxios.onAny().networkError();
};
