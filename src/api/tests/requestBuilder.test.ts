import {
    AxiosError,
    AxiosRequestConfig,
    AxiosResponse,
} from 'axios';
import {
    defaultResponse,
    formatError,
} from '../requestBuilder';

describe('Request Builder', () => {
    it('should return correct defaultResponse', () => {
        const expectedObject = {
            status: 500,
            data: {
                error: 'Server error',
            },
        };
        expect(defaultResponse).toEqual(expectedObject);
    });

    it('should return formatedError from object', () => {
        const config: AxiosRequestConfig = {};
        const headers = {
            'content-type': 'application/json',
        };
        const response: AxiosResponse = {
            statusText: '',
            headers: headers,
            config: config,
            status: 500,
            data: {
                error: 'Error',
            },
        };

        const responseError: AxiosError = {
            name: '',
            message: '',
            config: config,
            response: response,
        };
        const expectedError = {
            code: 500,
            message: ['Error'],
        };
        expect(formatError(responseError)).toEqual(expectedError);
    });

    it('should return formatedError from array', () => {
        const config: AxiosRequestConfig = {};
        const headers = {
            'content-type': 'application/json',
        };
        const response: AxiosResponse = {
            statusText: '',
            headers: headers,
            config: config,
            status: 500,
            data: {
                errors: ['Error'],
            },
        };

        const responseError: AxiosError = {
            name: '',
            message: '',
            config: config,
            response: response,
        };
        const expectedError = {
            code: 500,
            message: ['Error'],
        };
        expect(formatError(responseError)).toEqual(expectedError);
    });

    it('should user defaultResponse object if responce is undefined', () => {
        const config: AxiosRequestConfig = {};

        const responseError: AxiosError = {
            name: '',
            message: '',
            config: config,
        };
        const expectedError = {
            code: 500,
            message: ['Server error'],
        };
        expect(formatError(responseError)).toEqual(expectedError);
    });
});
