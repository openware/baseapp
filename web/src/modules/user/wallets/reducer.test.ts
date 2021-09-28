import { CommonError } from '../../types';
import * as actions from './actions';
import { initialWalletsState, walletsReducer } from './reducer';
import { Wallet, WalletAddress } from './types';

describe('walletsList reducer', () => {
    const wallets: Wallet[] = [
        {
            balance: '0',
            currency: 'btc',
            name: 'Bitcoin',
            type: 'coin',
            account_type: 'spot',
            fixed: 8,
            networks: [],
        },
        {
            balance: '0',
            currency: 'bch',
            name: 'Bitcoin Cash',
            type: 'coin',
            account_type: 'spot',
            fixed: 8,
            networks: [],
        },
        {
            balance: '0',
            currency: 'eth',
            name: 'Ethereum',
            type: 'coin',
            account_type: 'p2p',
            fixed: 8,
            networks: [],
        },
    ];

    const error: CommonError = {
        code: 500,
        message: ['Server error'],
    };

    const withdrawCcyFetchPayload = {
        amount: '0.1',
        currency: 'btc',
        otp: '123123',
        beneficiary_id: '2NCimTNGnbm92drX7ARcwBKw6rvr456VWym',
    };

    const addressFetchPayload = {
        currency: 'btc',
        blockchain_key: 'bitcoin',
    };

    it('should handle WALLETS_FETCH', () => {
        const expectedState = {
            wallets: {
                list: [],
                loading: true,
                withdrawSuccess: false,
                mobileWalletChosen: '',
                timestamp: Math.floor(Date.now() / 1000),
            },
            p2pWallets: {
                list: [],
                loading: false,
            },
            userWithdrawals: {
                last_1_month: '',
                last_24_hours: '',
                loading: false,
            },
         };
        expect(walletsReducer(initialWalletsState, actions.walletsFetch())).toEqual(expectedState);
    });

    it('should handle WALLETS_DATA', () => {
        const expectedState = {
            wallets: {
                list: wallets,
                loading: false,
                withdrawSuccess: false,
                mobileWalletChosen: '',
            },
            p2pWallets: {
                list: [],
                loading: false,
            },
            userWithdrawals: {
                last_1_month: '',
                last_24_hours: '',
                loading: false,
            },
         };
        expect(walletsReducer(initialWalletsState, actions.walletsData(wallets))).toEqual(expectedState);
    });

    it('should handle WALLETS_ERROR', () => {
        const expectedState = {
            wallets: {
                list: [],
                loading: false,
                withdrawSuccess: false,
                error: error,
                mobileWalletChosen: '',
            },
            p2pWallets: {
                list: [],
                loading: false,
            },
            userWithdrawals: {
                last_1_month: '',
                last_24_hours: '',
                loading: false,
            },
         };
        expect(walletsReducer(initialWalletsState, actions.walletsError(error))).toEqual(expectedState);
    });

    it('should handle WALLETS_ADDRESS_FETCH', () => {
        const expectedState = {
            wallets: {
                list: [],
                loading: true,
                withdrawSuccess: false,
                mobileWalletChosen: '',
                timestamp: Math.floor(Date.now() / 1000),
            },
            p2pWallets: {
                list: [],
                loading: false,
            },
            userWithdrawals: {
                last_1_month: '',
                last_24_hours: '',
                loading: false,
            },
         };
        expect(walletsReducer(initialWalletsState, actions.walletsAddressFetch(addressFetchPayload))).toEqual(expectedState);
    });

    it('should handle WALLETS_ADDRESS_DATA', () => {
        const initialState = {
            wallets: {
                list: wallets,
                loading: false,
                withdrawSuccess: false,
                mobileWalletChosen: '',
            },
            p2pWallets: {
                list: [],
                loading: false,
            },
            userWithdrawals: {
                last_24_hours: '',
                last_1_month: '',
                loading: false,
            }
        };

        const addressDataPayload: WalletAddress = {
            currencies: ['btc', 'tbtc'],
            address: 'address',
            state: 'active',
            blockchain_key: "bitcoin",
        };

        const updatedWallets: Wallet[] = [
            {
                balance: '0',
                currency: 'btc',
                name: 'Bitcoin',
                type: 'coin',
                account_type: 'spot',
                fixed: 8,
                deposit_addresses: [{
                    currencies: ['btc', 'tbtc'],
                    address: 'address',
                    blockchain_key: 'bitcoin',
                }],
                networks: [],
            },
            {
                balance: '0',
                currency: 'bch',
                name: 'Bitcoin Cash',
                type: 'coin',
                account_type: 'spot',
                fixed: 8,
                networks: [],
            },
            {
                balance: '0',
                currency: 'eth',
                name: 'Ethereum',
                account_type: 'p2p',
                type: 'coin',
                fixed: 8,
                networks: [],
            },
        ];

        const expectedState = {
            wallets: {
                list: updatedWallets,
                loading: false,
                withdrawSuccess: false,
                mobileWalletChosen: '',
            },
            p2pWallets: {
                list: [],
                loading: false,
            },
            userWithdrawals: {
                last_1_month: '',
                last_24_hours: '',
                loading: false,
            },
         };
        expect(walletsReducer(initialState, actions.walletsAddressData(addressDataPayload))).toEqual(expectedState);
    });

    it('should handle WALLETS_ADDRESS_ERROR', () => {
        const expectedState = {
            wallets: {
                list: [],
                loading: false,
                withdrawSuccess: false,
                error: error,
                mobileWalletChosen: '',
            },
            p2pWallets: {
                list: [],
                loading: false,
            },
            userWithdrawals: {
                last_1_month: '',
                last_24_hours: '',
                loading: false,
            },
         };
        expect(walletsReducer(initialWalletsState, actions.walletsAddressError(error))).toEqual(expectedState);
    });

    it('should handle WALLETS_WITHDRAW_CCY_FETCH', () => {
        const expectedState = {
            wallets: {
                list: [],
                loading: true,
                withdrawSuccess: false,
                mobileWalletChosen: '',
            },
            p2pWallets: {
                list: [],
                loading: false,
            },
            userWithdrawals: {
                last_1_month: '',
                last_24_hours: '',
                loading: false,
            },
         };
        expect(walletsReducer(initialWalletsState, actions.walletsWithdrawCcyFetch(withdrawCcyFetchPayload))).toEqual(expectedState);
    });

    it('should handle WALLETS_WITHDRAW_CCY_DATA', () => {
        const expectedState = {
            wallets: {
                list: [],
                loading: false,
                withdrawSuccess: true,
                mobileWalletChosen: '',
            },
            p2pWallets: {
                list: [],
                loading: false,
            },
            userWithdrawals: {
                last_1_month: '',
                last_24_hours: '',
                loading: false,
            },
         };
        expect(walletsReducer(initialWalletsState, actions.walletsWithdrawCcyData())).toEqual(expectedState);
    });

    it('should handle WALLETS_WITHDRAW_CCY_ERROR', () => {
        const expectedState = {
            wallets: {
                list: [],
                loading: false,
                withdrawSuccess: false,
                error: error,
                mobileWalletChosen: '',
            },
            p2pWallets: {
                list: [],
                loading: false,
            },
            userWithdrawals: {
                last_1_month: '',
                last_24_hours: '',
                loading: false,
            },
         };
        expect(walletsReducer(initialWalletsState, actions.walletsWithdrawCcyError(error))).toEqual(expectedState);
    });
});
