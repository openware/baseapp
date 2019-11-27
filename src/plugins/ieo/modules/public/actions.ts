import { CommonError } from '../../../../modules/types';
import {
    IEO_DATA,
    IEO_ERROR,
    IEO_FETCH,
    IEO_ITEM_DATA,
    IEO_ITEM_ERROR,
    IEO_ITEM_FETCH,
    IEO_RESET_DATA,
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

export interface ResetIEO {
    type: typeof IEO_RESET_DATA;
}

export interface ErrorIEO {
    type: typeof IEO_ERROR;
    payload: CommonError;
}

export interface FetchIEOItem {
    type: typeof IEO_ITEM_FETCH;
    payload: string | number;
}

export interface DataIEOItem {
    type: typeof IEO_ITEM_DATA;
    payload: DataIEOInterface;
}

export interface ErrorIEOItem {
    type: typeof IEO_ITEM_ERROR;
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
    | UpdateIEO
    | FetchIEOItem
    | DataIEOItem
    | ErrorIEOItem
    | ResetIEO;

export const fetchIEO = (payload?: FetchIEO['payload']): FetchIEO => ({
    type: IEO_FETCH,
    payload,
});

export const ieoData = (payload: DataIEO['payload']): DataIEO => ({
    type: IEO_DATA,
    payload,
});

export const resetIEOList = (): ResetIEO => ({
    type: IEO_RESET_DATA,
});

export const ieoError = (payload: ErrorIEO['payload']): ErrorIEO => ({
    type: IEO_ERROR,
    payload,
});

export const fetchItemIEO = (payload: FetchIEOItem['payload']): FetchIEOItem => ({
    type: IEO_ITEM_FETCH,
    payload,
});

export const ieoItemData = (payload: DataIEOItem['payload']): DataIEOItem => ({
    type: IEO_ITEM_DATA,
    payload,
});

export const ieoItemError = (payload: ErrorIEOItem['payload']): ErrorIEOItem => ({
    type: IEO_ITEM_ERROR,
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
