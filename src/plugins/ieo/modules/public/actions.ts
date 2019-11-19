import { CommonError } from '../../../../modules/types';
import {
    IEO_DATA,
    IEO_ERROR,
    IEO_FETCH,
    IEO_SET_CURRENT_IEO,
    IEO_UPDATE,
} from './constants';
import { DataIEOInterface } from './types';

export interface FetchIEO {
    type: typeof IEO_FETCH;
    payload?: string[];
}

export interface DataIEO {
    type: typeof IEO_DATA;
    payload: DataIEOInterface[];
}

export interface ErrorIEO {
    type: typeof IEO_ERROR;
    payload: CommonError;
}

export interface SetCurrentIEO {
    type: typeof IEO_SET_CURRENT_IEO;
    payload?: DataIEOInterface;
}

export interface UpdateIEO {
    type: typeof IEO_UPDATE;
    payload: DataIEOInterface;
}

export type IEOAction =
    FetchIEO
    | DataIEO
    | ErrorIEO
    | SetCurrentIEO
    | UpdateIEO;

export const fetchIEO = (payload?: FetchIEO['payload']): FetchIEO => ({
    type: IEO_FETCH,
    payload,
});

export const ieoData = (payload: DataIEO['payload']): DataIEO => ({
    type: IEO_DATA,
    payload,
});

export const ieoError = (payload: ErrorIEO['payload']): ErrorIEO => ({
    type: IEO_ERROR,
    payload,
});

export const setCurrentIEO = (payload: SetCurrentIEO['payload']): SetCurrentIEO => ({
    type: IEO_SET_CURRENT_IEO,
    payload,
});

export const ieoUpdate = (payload: UpdateIEO['payload']): UpdateIEO => ({
    type: IEO_UPDATE,
    payload,
});
