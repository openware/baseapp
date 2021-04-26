import { CommonError } from '../../types';
import { WalletsAction } from './actions';
import {
    P2P_WALLETS_DATA,
    P2P_WALLETS_DATA_WS,
    P2P_WALLETS_ERROR,
    P2P_WALLETS_FETCH,
    SET_MOBILE_WALLET_UI,
    WALLETS_ADDRESS_DATA,
    WALLETS_ADDRESS_DATA_WS,
    WALLETS_ADDRESS_ERROR,
    WALLETS_ADDRESS_FETCH,
    WALLETS_DATA,
    WALLETS_DATA_WS,
    WALLETS_ERROR,
    WALLETS_FETCH,
    WALLETS_RESET,
    WALLETS_WITHDRAW_CCY_DATA,
    WALLETS_WITHDRAW_CCY_ERROR,
    WALLETS_WITHDRAW_CCY_FETCH,
} from './constants';
import { Wallet, WalletAddress } from './types';

export interface WalletsState {
    wallets: {
        list: Wallet[];
        loading: boolean;
        withdrawSuccess: boolean;
        error?: CommonError;
        mobileWalletChosen: string;
        timestamp?: number;
    };
    p2pWallets: {
        list: Wallet[];
        loading: boolean;
        error?: CommonError;
        timestamp?: number;
    };
}

export const initialWalletsState: WalletsState = {
    wallets: {
        list: [],
        loading: false,
        withdrawSuccess: false,
        mobileWalletChosen: '',
    },
    p2pWallets: {
        list: [],
        loading: false,
    },
};

const getUpdatedWalletsList = (list: Wallet[], payload: WalletAddress) => {
    if (list.length && payload.currencies?.length) {
        return list.map(wallet => {
            if (payload.currencies.includes(wallet.currency)) {
                let depositAddress: WalletAddress = {
                    address: payload.address,
                    currencies: payload.currencies,
                };

                if (payload.state) {
                    depositAddress = {
                        ...depositAddress,
                        state: payload.state,
                    };
                }

                return {
                    ...wallet,
                    deposit_address: depositAddress,
                };
            }

            return wallet;
        });
    }

    return list;
};

const walletsListReducer = (state: WalletsState['wallets'], action: WalletsAction): WalletsState['wallets'] => {
    switch (action.type) {
        case WALLETS_ADDRESS_FETCH:
        case WALLETS_FETCH:
            return {
                ...state,
                loading: true,
                timestamp: Math.floor(Date.now() / 1000),
            };
        case WALLETS_WITHDRAW_CCY_FETCH:
            return {
                ...state,
                loading: true,
                withdrawSuccess: false,
            };
        case WALLETS_DATA: {
            return {
                ...state,
                loading: false,
                list: action.payload,
            };
        }
        case WALLETS_DATA_WS: {
            let updatedList = state.list;

            if (state.list.length) {
                updatedList = state.list.map(wallet => {
                    let updatedWallet = wallet;
                    const payloadCurrencies = Object.keys(action.payload.balances);

                    if (payloadCurrencies.length) {
                        payloadCurrencies.some(value => {
                            const targetWallet = action.payload.balances[value];

                            if (value === wallet.currency && (targetWallet && targetWallet[2] === wallet.account_type)) {
                                updatedWallet = {
                                    ...updatedWallet,
                                    balance: targetWallet[0] ? targetWallet[0] : updatedWallet.balance,
                                    locked: targetWallet[1] ? targetWallet[1] : updatedWallet.locked,
                                };

                                return true;
                            }

                            return false;
                        });
                    }

                    return updatedWallet;
                });
            }

            return {
                ...state,
                loading: false,
                list: updatedList,
            };
        }
        case WALLETS_ADDRESS_DATA: {
            return {
                ...state,
                list: getUpdatedWalletsList(state.list, action.payload),
                loading: false,
            };
        }
        case WALLETS_WITHDRAW_CCY_DATA:
            return {
                ...state,
                loading: false,
                withdrawSuccess: true,
            };
        case WALLETS_ADDRESS_DATA_WS: {
            // if (action.payload.currencies.includes(state.selectedWalletCurrency)) {
            //     return {
            //         ...state,
            //         loading: false,
            //         selectedWalletAddress: action.payload.address,
            //     };
            // }

            return {
                ...state,
                list: getUpdatedWalletsList(state.list, action.payload),
                loading: false,
            };
        }
        case WALLETS_WITHDRAW_CCY_ERROR:
            return {
                ...state,
                loading: false,
                withdrawSuccess: false,
                error: action.error,
            };
        case WALLETS_ADDRESS_ERROR:
        case WALLETS_ERROR:
            return {
                ...state,
                loading: false,
                error: action.error,
            };

        case SET_MOBILE_WALLET_UI:
            return { ...state, mobileWalletChosen: action.payload };
        default:
            return state;
    }
};

const p2pWalletsListReducer = (state: WalletsState['p2pWallets'], action: WalletsAction): WalletsState['p2pWallets'] => {
    switch (action.type) {
        case P2P_WALLETS_FETCH:
            return {
                ...state,
                loading: true,
                timestamp: Math.floor(Date.now() / 1000),
            };
        case P2P_WALLETS_DATA: {
            return {
                ...state,
                loading: false,
                list: action.payload,
            };
        }
        case P2P_WALLETS_DATA_WS: {
            let updatedList = state.list;

            if (state.list.length) {
                updatedList = state.list.map(wallet => {
                    let updatedWallet = wallet;
                    const payloadCurrencies = Object.keys(action.payload.balances);

                    if (payloadCurrencies.length) {
                        payloadCurrencies.some(value => {
                            const targetWallet = action.payload.balances[value];

                            if (value === wallet.currency && (targetWallet && targetWallet[2] === wallet.account_type)) {
                                updatedWallet = {
                                    ...updatedWallet,
                                    balance: targetWallet[0] ? targetWallet[0] : updatedWallet.balance,
                                    locked: targetWallet[1] ? targetWallet[1] : updatedWallet.locked,
                                };

                                return true;
                            }

                            return false;
                        });
                    }

                    return updatedWallet;
                });
            }

            return {
                ...state,
                loading: false,
                list: updatedList,
            };
        }
        case P2P_WALLETS_ERROR:
            return {
                ...state,
                loading: false,
                error: action.error,
            };
        default:
            return state;
    }
};

export const walletsReducer = (state = initialWalletsState, action: WalletsAction): WalletsState => {
    switch (action.type) {
        case WALLETS_FETCH:
        case WALLETS_DATA:
        case WALLETS_DATA_WS:
        case WALLETS_ERROR:
        case WALLETS_ADDRESS_FETCH:
        case WALLETS_ADDRESS_DATA:
        case WALLETS_ADDRESS_DATA_WS:
        case WALLETS_ADDRESS_ERROR:
        case WALLETS_WITHDRAW_CCY_FETCH:
        case WALLETS_WITHDRAW_CCY_DATA:
        case SET_MOBILE_WALLET_UI:
        case WALLETS_WITHDRAW_CCY_ERROR:
            const walletsListState = { ...state.wallets };

            return {
                ...state,
                wallets: walletsListReducer(walletsListState, action),
            };
        case P2P_WALLETS_FETCH:
        case P2P_WALLETS_DATA:
        case P2P_WALLETS_ERROR:
        case P2P_WALLETS_DATA_WS:
            const p2pWalletsListState = { ...state.p2pWallets };

            return {
                ...state,
                p2pWallets: p2pWalletsListReducer(p2pWalletsListState, action),
            };
        case WALLETS_RESET:
            return {
                ...state,
                wallets: {
                    list: [],
                    loading: false,
                    withdrawSuccess: false,
                    mobileWalletChosen: '',
                },
            };
        default:
            return state;
    }
};
