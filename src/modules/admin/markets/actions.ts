import {
    MARKET_DATA,
    MARKET_ERROR,
    MARKET_UPDATE_FETCH,
    MARKETS_LIST_DATA,
    MARKETS_LIST_ERROR,
    MARKETS_LIST_FETCH,
} from './constants';

export interface MarketItem {
    id: string;
    name: string;
    base_unit: string;
    quote_unit: string;
    maker_fee: string;
    taker_fee: string;
    min_price: string;
    max_price: string;
    min_amount: string;
    amount_precision: number;
    price_precision: number;
    state: string;
    position: number;
    engine_id: string | number;
    created_at: string;
    updated_at: string;
}

export interface MarketUpdateItem {
    id: string;
    max_price?: string;
    position?: number;
    state?: string;
    min_price?: string;
    min_amount?: string;
    amount_precision?: number;
    price_precision?: number;
    engine_id?: number;
}

export interface MarketsListFetch {
    type: typeof MARKETS_LIST_FETCH;
}


export interface MarketsListData {
    type: typeof MARKETS_LIST_DATA;
    payload: {
        list: MarketItem[];
    };
}

export interface MarketData {
    type: typeof MARKET_DATA;
    payload: {
        currentMarket: MarketItem;
    };
}

export interface MarketError {
    type: typeof MARKET_ERROR;
}

export interface MarketsListError {
    type: typeof MARKETS_LIST_ERROR;
}

export interface MarketUpdateFetch {
    type: typeof MARKET_UPDATE_FETCH;
    payload: MarketUpdateItem[];
}


export type MarketsAdminAction = MarketsListFetch
    | MarketsListData
    | MarketsListError
    | MarketData
    | MarketError
    | MarketUpdateFetch;

export const getMarketsAdminList = (): MarketsListFetch => ({
    type: MARKETS_LIST_FETCH,
});

export const updateMarketFetch = (payload: MarketUpdateFetch['payload']): MarketUpdateFetch => ({
    type: MARKET_UPDATE_FETCH,
    payload,
});

export const getMarketData = (payload: MarketData['payload']): MarketData => ({
    type: MARKET_DATA,
    payload,
});

export const getMarketError = (): MarketError => ({
    type: MARKET_ERROR,
});

export const getMarketsListData = (payload: MarketsListData['payload']): MarketsListData => ({
    type: MARKETS_LIST_DATA,
    payload,
});

export const getMarketsListError = (): MarketsListError => ({
    type: MARKETS_LIST_ERROR,
});
