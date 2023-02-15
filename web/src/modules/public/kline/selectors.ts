import { RootState } from '../../';
import { KlineState } from './reducer';

export const selectKline = (state: RootState): KlineState => state.public.kline;
