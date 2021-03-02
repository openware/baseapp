import { CommonError } from '../../types';
import {
    PLATFORM_CREATE,
    PLATFORM_CREATE_DATA,
    PLATFORM_CREATE_ERROR,
} from './constants';

export interface PlatformCreateFetch {
    type: typeof PLATFORM_CREATE;
    payload: {
        platform_name: string;
        platform_url: string;
    };
}

export interface PlatformCreateData {
    type: typeof PLATFORM_CREATE_DATA;
    payload: any;
}

export interface PlatformCreateError {
    type: typeof PLATFORM_CREATE_ERROR;
    error: CommonError;
}

export type PlatformCreateAction =
    PlatformCreateFetch
    | PlatformCreateData
    | PlatformCreateError;

export const platformCreate = (payload: PlatformCreateFetch['payload']): PlatformCreateFetch => ({
    type: PLATFORM_CREATE,
    payload,
});

export const platformCreateData = (payload: PlatformCreateData['payload']): PlatformCreateData => ({
    type: PLATFORM_CREATE_DATA,
    payload,
});

export const platformCreateError = (error: CommonError): PlatformCreateError => ({
    type: PLATFORM_CREATE_ERROR,
    error,
});
