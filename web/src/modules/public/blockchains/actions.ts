import { BLOCKCHAINS_DATA } from './constants';

export interface BlockchainsData {
    type: typeof BLOCKCHAINS_DATA;
    payload: any;
}

export type BlockchainsAction = BlockchainsData;

export const blockchainsData = (payload: BlockchainsData['payload']): BlockchainsData => ({
    type: BLOCKCHAINS_DATA,
    payload,
});
