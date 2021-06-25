import { BlockchainsAction } from './actions';
import { BLOCKCHAINS_DATA } from './constants';

export interface BlockchainsState  {
    list: any[];
}

export const initialBlockchainsState: BlockchainsState = {
    list: [],
};

export const blockchainsReducer = (state = initialBlockchainsState, action: BlockchainsAction) => {
    switch (action.type) {
        case BLOCKCHAINS_DATA:
            return {
                ...state,
                list: action.payload,
            };
        default:
            return state;
    }
};
