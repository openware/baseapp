import { RootState } from '../../';
import { BlockchainsState } from './reducer';

export const selectBlockchainsList = (state: RootState): BlockchainsState['list'] =>
    state.public.blockchains.list;
