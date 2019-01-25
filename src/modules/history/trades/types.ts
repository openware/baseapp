import { CommonState } from '../../types';

export interface PublicTrade {
    id: number;
    price: string;
    volume: string;
    funds: string;
    market: string;
    created_at: string;
    maker_type: string;
}

export interface PrivateTrade extends PublicTrade {
    side?: string;
    order_id?: number;
}

export interface PrivateTradeEvent {
    id: number;
    at: number;
    market: string;
    kind: string;
    price: string;
    volume: string;
    ask_id: number;
    bid_id: number;
}

export interface PrivateTradesState extends CommonState {
    list: PrivateTrade[];
}

export type MakerType = 'buy' | 'sell';
