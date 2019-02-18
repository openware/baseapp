import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { rootSaga } from '../..';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../helpers/jest';
import { walletsAddressFetch, walletsFetch, walletsWithdrawCcyFetch } from './actions';

const debug = false;

describe('Wallets', () => {
    let store: MockStoreEnhanced;
    let sagaMiddleware: SagaMiddleware<{}>;
    let mockAxios: MockAdapter;

    afterEach(() => {
        mockAxios.reset();
    });

    beforeEach(() => {
        mockAxios = setupMockAxios();
        sagaMiddleware = createSagaMiddleware();
        store = setupMockStore(sagaMiddleware, debug)();
        sagaMiddleware.run(rootSaga);
    });

    describe('Fetch wallets', () => {
        const balancesResponse = [
            {
                balance: '0.0',
                currency: 'bch',
                locked: '0.0',
            },
            {
                balance: '0.0',
                currency: 'btc',
                locked: '0.0',
            },
            {
                balance: '0.0',
                currency: 'eth',
                locked: '0.0',
            },
        ];

        const currenciesResponse = [
            {
                base_factor: 100000000,
                deposit_fee: '0.0',
                explorer_address: 'https://www.blocktrail.com/tBCC/address/#{address}',
                explorer_transaction: 'https://www.blocktrail.com/tBCC/tx/#{txid}',
                id: 'bch',
                min_deposit_amount: '0.0000748',
                min_withdraw_amount: '0.0',
                precision: 8,
                symbol: '฿',
                type: 'coin',
                withdraw_fee: '0.0',
                withdraw_limit_24h: '0.1',
                withdraw_limit_72h: '0.2',
            },
            {
                base_factor: 100000000,
                deposit_fee: '0.0',
                explorer_address: 'https://testnet.blockchain.info/address/#{address}',
                explorer_transaction: 'https://testnet.blockchain.info/tx/#{txid}',
                id: 'btc',
                min_deposit_amount: '0.0000356',
                min_withdraw_amount: '0.0',
                precision: 8,
                symbol: '฿',
                type: 'coin',
                withdraw_fee: '0.0',
                withdraw_limit_24h: '0.1',
                withdraw_limit_72h: '0.2',
            },
            {
                base_factor: 1000000000000000000,
                deposit_fee: '0.0',
                explorer_address: 'https://rinkeby.etherscan.io/address/#{address}',
                explorer_transaction: 'https://rinkeby.etherscan.io/tx/#{txid}',
                id: 'eth',
                min_deposit_amount: '0.00021',
                min_withdraw_amount: '0.0',
                precision: 8,
                symbol: 'Ξ',
                type: 'coin',
                withdraw_fee: '0.0',
                withdraw_limit_24h: '0.2',
                withdraw_limit_72h: '0.5000000000000001',
            },
        ];

        const feesResponse = [
            {
                currency: 'bch',
                fee: {
                    type: 'fixed',
                    value: '0.0',
                },
                type: 'coin',
            },
            {
                currency: 'btc',
                fee: {
                    type: 'fixed',
                    value: '0.0',
                },
                type: 'coin',
            },
            {
                currency: 'eth',
                fee: {
                    type: 'fixed',
                    value: '0.0',
                },
                type: 'coin',
            },
        ];

        const walletsDataActionPayload = [
            {
                balance: '0.0',
                currency: 'bch',
                explorerAddress: 'https://www.blocktrail.com/tBCC/address/#{address}',
                explorerTransaction: 'https://www.blocktrail.com/tBCC/tx/#{txid}',
                fee: '0.0',
                locked: '0.0',
                type: 'coin',
                fixed: 8,
            },
            {
                balance: '0.0',
                currency: 'btc',
                explorerAddress: 'https://testnet.blockchain.info/address/#{address}',
                explorerTransaction: 'https://testnet.blockchain.info/tx/#{txid}',
                fee: '0.0',
                locked: '0.0',
                type: 'coin',
                fixed: 8,
            },
            {
                balance: '0.0',
                currency: 'eth',
                explorerAddress: 'https://rinkeby.etherscan.io/address/#{address}',
                explorerTransaction: 'https://rinkeby.etherscan.io/tx/#{txid}',
                fee: '0.0',
                locked: '0.0',
                type: 'coin',
                fixed: 8,
            },
        ];

        const expectedWalletsFetch = {
            type: 'wallets/WALLETS_FETCH',
        };

        const expectedWalletsData = {
            type: 'wallets/WALLETS_DATA',
            payload: walletsDataActionPayload,
        };

        const expectedWalletsError = {
            type: 'wallets/WALLETS_ERROR',
            payload: {
                code: 500,
                message: 'Server error',
            },
        };

        const expectedCallErrorHandler = {
            error: {
              code: 500,
              message: 'Server error',
            },
            type: 'alert/ERROR_FETCH',
        };

        const mockWalletsBalancesFetch = () => {
            mockAxios.onGet(`/account/balances`).reply(200, balancesResponse);
        };

        const mockWalletsCurrenciesFetch = () => {
            mockAxios.onGet('/public/currencies').reply(200, currenciesResponse);
        };

        const mockWalletsWithdrawFeesFetch = () => {
            mockAxios.onGet('/public/fees/withdraw').reply(200, feesResponse);
        };

        it('should handle wallet address data', async () => {
            mockWalletsBalancesFetch();
            mockWalletsCurrenciesFetch();
            mockWalletsWithdrawFeesFetch();
            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === 2) {
                        expect(actions[0]).toEqual(expectedWalletsFetch);
                        expect(actions[1]).toEqual(expectedWalletsData);
                        resolve();
                    }
                });
            });
            store.dispatch(walletsFetch());
            return promise;
        });

        it('should handle wallet address error', async () => {
            mockNetworkError(mockAxios);
            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === 3) {
                        expect(actions[0]).toEqual(expectedWalletsFetch);
                        expect(actions[1]).toEqual(expectedWalletsError);
                        expect(actions[2]).toEqual(expectedCallErrorHandler);
                        resolve();
                    }
                });
            });
            store.dispatch(walletsFetch());
            return promise;
        });
    });

    describe('Fetch wallet address', () => {
        const payload = {
            currency: 'btc',
        };

        const expectedWalletsAddressFetch = {
            type: 'wallets/WALLETS_ADDRESS_FETCH',
            payload: payload,
        };

        const expectedWalletsAddressData = {
            type: 'wallets/WALLETS_ADDRESS_DATA',
            payload: {
                address: 'address',
                currency: payload.currency,
            },
        };

        const expectedWalletsAddressError = {
            type: 'wallets/WALLETS_ADDRESS_ERROR',
            payload: {
                code: 500,
                message: 'Server error',
            },
        };

        const expectedCallErrorHandler = {
            error: {
              code: 500,
              message: 'Server error',
            },
            type: 'alert/ERROR_FETCH',
        };

        const responseAddress = {
            address: 'address',
        };

        const mockWalletsAddressFetch = () => {
            mockAxios.onGet(`/account/deposit_address/${payload.currency}`).reply(200, responseAddress);
        };

        it('should get wallet address', async () => {
            mockWalletsAddressFetch();
            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === 2) {
                        expect(actions[0]).toEqual(expectedWalletsAddressFetch);
                        expect(actions[1]).toEqual(expectedWalletsAddressData);
                        resolve();
                    }
                });
            });
            store.dispatch(walletsAddressFetch(payload));
            return promise;
        });

        it('should handle wallet address error', async () => {
            mockNetworkError(mockAxios);
            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === 3) {
                        expect(actions[0]).toEqual(expectedWalletsAddressFetch);
                        expect(actions[1]).toEqual(expectedWalletsAddressError);
                        expect(actions[2]).toEqual(expectedCallErrorHandler);
                        resolve();
                    }
                });
            });
            store.dispatch(walletsAddressFetch(payload));
            return promise;
        });
    });

    describe('Fetch wallets withdraw ccy', () => {
        const payload = {
            amount: 0.1,
            currency: 'btc',
            otp: '123123',
            rid: '2NCimTNGnbm92drX7ARcwBKw6rvr456VWym',
        };

        const expectedWalletsWithdrawCcyFetch = {
            type: 'wallets/WALLETS_WITHDRAW_CCY_FETCH',
            payload: payload,
        };

        const expectedWalletsWithdrawCcyData = {
            type: 'wallets/WALLETS_WITHDRAW_CCY_DATA',
        };

        const expectedWalletsWithdrawCcyError = {
            type: 'wallets/WALLETS_WITHDRAW_CCY_ERROR',
            payload: {
                code: 500,
                message: 'Server error',
            },
        };

        const expectedCallErrorHandler = {
            error: {
              code: 500,
              message: 'Server error',
            },
            type: 'alert/ERROR_FETCH',
        };

        const mockWalletsWithdrawCcyFetch = () => {
            mockAxios.onPost('/account/withdraws').reply(201);
        };

        it('should send withdraw', async () => {
            mockWalletsWithdrawCcyFetch();
            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === 2) {
                        expect(actions[0]).toEqual(expectedWalletsWithdrawCcyFetch);
                        expect(actions[1]).toEqual(expectedWalletsWithdrawCcyData);
                        resolve();
                    }
                });
            });
            store.dispatch(walletsWithdrawCcyFetch(payload));
            return promise;
        });

        it('should handle withdraw error', async () => {
            mockNetworkError(mockAxios);
            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === 3) {
                        expect(actions[0]).toEqual(expectedWalletsWithdrawCcyFetch);
                        expect(actions[1]).toEqual(expectedWalletsWithdrawCcyError);
                        expect(actions[2]).toEqual(expectedCallErrorHandler);
                        resolve();
                    }
                });
            });
            store.dispatch(walletsWithdrawCcyFetch(payload));
            return promise;
        });
    });
});
