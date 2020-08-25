import queryString from 'query-string';

// eslint-disable-next-line import/no-unresolved
import config from 'config';

import { DEFAULT_ERROR_MESSAGE } from 'src/context/constants';

export class FetchException extends Error {
    public message: string;
    public code?: string;
    public status?: number;

    constructor(message: string, code?: string, status?: number) {
        super(message);
        this.message = message;
        this.code = code;
        this.status = status;
    }
}

export interface FetchOptions<T = any> extends FetchOptionalOptions {
    token: string;
    body?: T;
}

export const BaseApi = {
    get: <TData = any>(
        path: string,
        options?: FetchOptions | FetchOptionalOptions,
        rootUrl?: string
    ): Promise<TData> => {
        return basePromise<TData>({ path, rootUrl, method: 'GET', ...options });
    },
    post: <TData = any>(
        path: string,
        options: FetchOptions | FetchOptionalOptions,
        rootUrl?: string
    ): Promise<TData> => {
        return basePromise<TData>({ path, rootUrl, method: 'POST', ...options });
    },
    put: <TData = any>(
        path: string,
        options: FetchOptions | FetchOptionalOptions,
        rootUrl?: string
    ): Promise<TData> => {
        return basePromise<TData>({ path, rootUrl, method: 'PUT', ...options });
    },
    delete: <TData = any>(
        path: string,
        options: FetchOptions | FetchOptionalOptions,
        rootUrl?: string
    ): Promise<TData> => {
        return basePromise<TData>({ path, rootUrl, method: 'DELETE', ...options });
    },
    patch: <TData = any>(
        path: string,
        options: FetchOptions | FetchOptionalOptions,
        rootUrl?: string
    ): Promise<TData> => {
        return basePromise<TData>({ path, rootUrl, method: 'PATCH', ...options });
    },
};

interface FetchOptionalOptions {
    token?: string;
    body?: any;
    upload?: boolean;
    hideContentType?: boolean;
    mode?: RequestMode;
    query?: any;
    blobResponse?: boolean;
    textResponse?: boolean;
}

interface BaseFetchOptions extends FetchOptionalOptions {
    path: string;
    rootUrl?: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
}

function baseFetch(options: BaseFetchOptions): Promise<Response> {
    const rootUrl = options.rootUrl ? options.rootUrl : config.app.api.tradeUrl;

    const endpoint = `${rootUrl}${options.path}`;
    let headers: any = {};
    let body: any;
    if (options.token) {
        headers = {
            Authorization: `Bearer ${options.token}`,
        };
    }
    if (options.body && !options.upload) {
        body = JSON.stringify(options.body);
    }
    if (options.body && options.upload) {
        body = options.body;
    }
    if (!options.upload) {
        if (options.hideContentType !== true) {
            headers['Content-Type'] = 'application/json';
        }
    }

    return fetch(endpoint, {
        method: options.method,
        mode: options.mode ? options.mode : 'cors',
        body,
        headers: {
            ...headers,
        },
    });
}

const handleFetchResponse = <TData = any>(
    options: BaseFetchOptions,
    response: Response
): Promise<[boolean, number, TData]> => {
    let parsedResponse;

    if (options.blobResponse) {
        parsedResponse = response.blob().then((blob) => {
            const fileName = response.headers.get('content-disposition').replace('attachment; filename=', '');
            return new File([blob], fileName);
        });
    } else if (options.textResponse) {
        parsedResponse = response.text();
    } else {
        parsedResponse = response.json();
    }

    return Promise.all([
        response.ok,
        response.status,
        parsedResponse.catch(() => ({
            error: `${response.status} ${response.statusText}`,
        })) as Promise<TData>,
    ]);
};

const handleResult = <TData = any>(
    values: [boolean, number, TData],
    resolve: (data: TData) => void,
    reject: (apiError: FetchException) => void
) => {
    const [ok, status, json] = values;
    if (ok) {
        return resolve(json);
    } else {
        let message = '';
        const response = json as any;

        if (typeof response.error === 'string') {
            message = response.error;
        } else if (Array.isArray(response.error)) {
            message = response.error.join('. ');
        } else if (typeof response.error === 'object' && response.error.message) {
            if (typeof response.error.message === 'object' && response.error.message.reasons) {
                message = response.error.message.reasons;
            } else {
                message = response.error.message;
            }
        } else if (typeof response.message === 'string') {
            message = response.message;
        } else if (response.messages && response.messages.length) {
            message = response.messages.join(', ');
        } else if (response.message && response.message.reasons) {
            message = response.message.reasons;
        } else {
            message = DEFAULT_ERROR_MESSAGE;
        }

        reject(new FetchException(message, response.errorCode || (response.error && response.error.code), status));
    }
};

function basePromise<TData = any>(options: BaseFetchOptions): Promise<TData> {
    const parsedUrl = queryString.parseUrl(options.path);
    const query: any = { ...options.query, ...parsedUrl.query };
    options.path = `${parsedUrl.url}?${queryString.stringify(query)}`;

    return new Promise<TData>((resolve: (data: TData) => void, reject: (apiError: FetchException) => void): void => {
        baseFetch(options)
            .then((response) => handleFetchResponse(options, response))
            .then((values) => handleResult<TData>(values, resolve, reject));
    });
}
