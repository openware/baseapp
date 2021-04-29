import { CommonError } from '../../../../modules/types';
import {
    IEO_DATA,
    IEO_DATA_METADATA,
    IEO_ERROR,
    IEO_ERROR_METADATA,
    IEO_FETCH,
    IEO_FETCH_METADATA,
    IEO_ITEM_DATA,
    IEO_ITEM_ERROR,
    IEO_ITEM_FETCH,
    IEO_RESET_DATA,
    IEO_SET_CURRENT_IEO,
    IEO_UPDATE,
} from './constants';
import { DataIEOInterface, DetailsIEOInterface } from './types';

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

export interface FetchIEOMetadata {
    type: typeof IEO_FETCH_METADATA;
    payload: {
        currency_id: string;
        id: number | string;
    };
}

export interface DataIEOMetadata {
    type: typeof IEO_DATA_METADATA;
    payload: {
        metadata: DetailsIEOInterface;
        id: string | number;
    };
}

export interface ErrorIEOMetadata {
    type: typeof IEO_ERROR_METADATA;
    payload: CommonError;
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
    | ResetIEO
    | FetchIEOMetadata
    | DataIEOMetadata
    | ErrorIEOMetadata;

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

export const ieoFetchMetadata = (payload: FetchIEOMetadata['payload']): FetchIEOMetadata => ({
    type: IEO_FETCH_METADATA,
    payload,
});

export const ieoDataMetadata = (payload: DataIEOMetadata['payload']): DataIEOMetadata => ({
    type: IEO_DATA_METADATA,
    payload,
});

export const ieoMetadataError = (payload: ErrorIEOMetadata['payload']): ErrorIEOMetadata => ({
    type: IEO_ERROR_METADATA,
    payload,
});
