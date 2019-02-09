import { RootState } from '../index';
import { KlineState } from './reducer';

export const selectKline = (state: RootState): KlineState =>
    state.app.kline;
