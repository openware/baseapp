import axios, {
    AxiosError,
    AxiosPromise,
    AxiosRequestConfig,
    AxiosResponse,
} from 'axios';
import { gatewayUrl, withCredentials } from './config';

export type HTTPMethod =
    'get'
    | 'post'
    | 'delete'
    | 'put'
    | 'patch';

export interface JsonBody {
    // tslint:disable-next-line no-any
    [key: string]: any;
}

export interface RequestOptions {
    apiVersion: 'applogic' | 'peatio' | 'barong';
    withHeaders?: boolean;
}

export interface Request {
    method: HTTPMethod;
    url: string;
    body?: JsonBody;
}

export interface ApiVariety {
    barong: string;
    applogic: string;
    peatio: string;
}

const getAPI = () => ({
    barong: `${gatewayUrl()}/barong`,
    applogic: `${gatewayUrl()}/applogic`,
    peatio: `${gatewayUrl()}/peatio`,
});

const buildRequest = (request: Request, configData: RequestOptions) => {
    const { body, method, url } = request;
    const { apiVersion } = configData;
    const api = getAPI();

    const contentType = body instanceof FormData
        ? 'multipart/form-data'
        : 'application/json';

    const headers = {
        'content-type': contentType,
    };

    const apiUrl = api[apiVersion];

    const requestConfig: AxiosRequestConfig = {
        baseURL: apiUrl,
        data: body,
        headers,
        method,
        url,
        withCredentials: withCredentials(),
    };

    return requestConfig;
};

const defaultResponse: Partial<AxiosError['response']> = {
    status: 500,
    data: {
        error: 'Server error',
    },
};

const formatError = (responseError: AxiosError) => {
    const response = responseError.response || defaultResponse;
    const error = response.data ? response.data.error : null;
    return {
        code: response.status,
        message: error && error.message ? error.message : error,
    };
};

export const makeRequest = async (request: Request, configData: RequestOptions) => {
    const requestConfig = buildRequest(request, configData);

    return new Promise((resolve, reject) => {
        const axiosRequest: AxiosPromise = axios(requestConfig);
        axiosRequest
            .then((response: AxiosResponse) => {
                if (configData.withHeaders) {
                    resolve(response);
                } else {
                    resolve(response.data);
                }
            })
            .catch((error: AxiosError) => {
                reject(formatError(error));
            });
    });
};
