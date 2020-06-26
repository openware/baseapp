import * as actions from './actions';
import {
  initialWalletsState,
  walletsReducer,
} from './reducer';
import { Wallet } from './types';

describe('walletsList reducer', () => {
    const wallets: Wallet[] = [
        {
            balance: '0',
            currency: 'btc',
            name: 'Bitcoin',
            explorerAddress: 'https://testnet.blockchain.info/address/#{address}',
            explorerTransaction: 'https://testnet.blockchain.info/tx/#{txid}',
            fee: 0,
            type: 'coin',
            fixed: 8,
        },
        {
            balance: '0',
            currency: 'bch',
            name: 'Bitcoin Cash',
            explorerAddress: 'https://www.blocktrail.com/tBCC/address/#{address}',
            explorerTransaction: 'https://www.blocktrail.com/tBCC/tx/#{txid}',
            fee: 0,
            type: 'coin',
            fixed: 8,
        },
        {
            balance: '0',
            currency: 'eth',
            name: 'Ethereum',
            explorerAddress: 'https://rinkeby.etherscan.io/address/#{address}',
            explorerTransaction: 'https://rinkeby.etherscan.io/tx/#{txid}',
            fee: 0,
            type: 'coin',
            fixed: 8,
        },
    ];

    const error = {
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
    };

    const addressDataPayload = {
        currency: 'btc',
        address: 'address',
    };

    it('should handle WALLETS_FETCH', () => {
        const expectedState = {
            wallets: {
                list: [],
                loading: true,
                withdrawSuccess: false,
                mobileWalletChosen: '',
                selectedWalletCurrency: '',
                selectedWalletAddress: '',
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
                selectedWalletCurrency: '',
                selectedWalletAddress: '',
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
                selectedWalletCurrency: '',
                selectedWalletAddress: '',
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
                selectedWalletCurrency: '',
                selectedWalletAddress: '',
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
                selectedWalletCurrency: '',
                selectedWalletAddress: '',
            },
        };

        const expectedState = {
            wallets: {
                list: wallets,
                loading: false,
                withdrawSuccess: false,
                mobileWalletChosen: '',
                selectedWalletCurrency: 'btc',
                selectedWalletAddress: 'address',
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
                selectedWalletCurrency: '',
                selectedWalletAddress: '',
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
                selectedWalletCurrency: '',
                selectedWalletAddress: '',
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
                selectedWalletCurrency: '',
                selectedWalletAddress: '',
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
                selectedWalletCurrency: '',
                selectedWalletAddress: '',
            },
         };
        expect(walletsReducer(initialWalletsState, actions.walletsWithdrawCcyError(error))).toEqual(expectedState);
    });
});
