import { CommonState } from '../../types';

export interface Trade {
    market: string;
    created_at: string;
    funds: string;
    id: number;
    price: string;
    side: string;
    volume: string;
}

export interface TradesState extends CommonState {
    list: Trade[];
}
