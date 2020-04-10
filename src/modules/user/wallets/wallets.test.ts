import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { rootSaga } from '../..';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../helpers/jest';
import { ALERT_DATA, ALERT_PUSH } from '../../public/alert/constants';
import { walletsAddressFetch, walletsFetch, walletsWithdrawCcyFetch } from './actions';
import {
    WALLETS_ADDRESS_DATA,
    WALLETS_ADDRESS_ERROR,
    WALLETS_ADDRESS_FETCH,
    WALLETS_DATA,
    WALLETS_ERROR,
    WALLETS_FETCH,
    WALLETS_WITHDRAW_CCY_DATA,
    WALLETS_WITHDRAW_CCY_ERROR,
    WALLETS_WITHDRAW_CCY_FETCH,
} from './constants';

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
                deposit_enabled: true,
                withdrawal_enabled: true,
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
                deposit_enabled: true,
                withdrawal_enabled: true,
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
                deposit_enabled: true,
                withdrawal_enabled: true,
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
            type: WALLETS_FETCH,
        };

        const expectedWalletsData = {
            type: WALLETS_DATA,
            payload: walletsDataActionPayload,
        };

        const expectedWalletsError = {
            type: WALLETS_ERROR,
            payload: {
                code: 500,
                message: ['Server error'],
            },
        };

        const mockWalletsBalancesFetch = () => {
            mockAxios.onGet(`/account/balances`).reply(200, balancesResponse);
        };

        const mockWalletsCurrenciesFetch = () => {
            mockAxios.onGet('/public/currencies').reply(200, currenciesResponse);
        };

        it('should handle wallet address data', async () => {
            mockWalletsBalancesFetch();
            mockWalletsCurrenciesFetch();
            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === 2) {
                        expect(actions).toEqual([expectedWalletsFetch, expectedWalletsData]);
                        setTimeout(resolve, 0.01);
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
                    if (actions.length === 2) {
                        expect(actions).toEqual([expectedWalletsFetch, expectedWalletsError]);
                        setTimeout(resolve, 0.01);
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
            type: WALLETS_ADDRESS_FETCH,
            payload: payload,
        };

        const expectedWalletsAddressData = {
            type: WALLETS_ADDRESS_DATA,
            payload: {
                address: 'address',
                currency: payload.currency,
            },
        };

        const expectedWalletsAddressError = {
            type: WALLETS_ADDRESS_ERROR,
            payload: {
                code: 500,
                message: ['Server error'],
            },
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
                        expect(actions).toEqual([expectedWalletsAddressFetch, expectedWalletsAddressData]);
                        setTimeout(resolve, 0.01);
                    }
                });
            });
            store.dispatch(walletsAddressFetch(payload));

            return promise;
        });

        it('should handle wallet address error', async () => {
            const expectedCallErrorHandler = {
                payload: {
                    code: 500,
                    message: ['Server error'],
                    type: 'error',
                },
                type: ALERT_PUSH,
            };
            const expectedErrorData = {
                type: ALERT_DATA,
                payload: {
                    code: 500,
                    message: ['Server error'],
                    type: 'error',
                },
            };
            mockNetworkError(mockAxios);
            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    const lastAction = actions.slice(-1)[0];

                    switch (actions.length) {
                        case 1:
                            expect(lastAction).toEqual(expectedWalletsAddressFetch);
                            break;

                        case 2:
                            expect(lastAction).toEqual(expectedWalletsAddressError);
                            break;

                        case 3:
                            expect(lastAction).toEqual(expectedCallErrorHandler);
                            break;

                        case 4:
                            expect(lastAction).toEqual(expectedErrorData);
                            setTimeout(resolve, 0.01);
                            break;

                        default:
                            fail(`Unexpected action: ${JSON.stringify(lastAction)}`);
                            break;
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
            beneficiary_id: '2NCimTNGnbm92drX7ARcwBKw6rvr456VWym',
        };

        const mockWalletsWithdrawCcyFetch = () => {
            mockAxios.onPost('/account/withdraws').reply(201);
        };

        const expectedWalletsWithdrawCcyFetch = {
            type: WALLETS_WITHDRAW_CCY_FETCH,
            payload: payload,
        };

        it('should send withdraw', async () => {
            const expectedWalletsWithdrawCcyData = {
                type: WALLETS_WITHDRAW_CCY_DATA,
            };

            const expectedSuccessAlertPush = {
                type: ALERT_PUSH,
                payload: {
                    message: ['success.withdraw.action'],
                    type: 'success',
                },
            };

            const expectedSuccessAlertData = {
                type: ALERT_DATA,
                payload: {
                    message: ['success.withdraw.action'],
                    type: 'success',
                },
            };

            mockWalletsWithdrawCcyFetch();
            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    const lastAction = actions.slice(-1)[0];

                    switch (actions.length) {
                        case 1:
                            expect(lastAction).toEqual(expectedWalletsWithdrawCcyFetch);
                            break;
                        case 2:
                            expect(lastAction).toEqual(expectedWalletsWithdrawCcyData);
                            break;
                        case 3:
                            expect(lastAction).toEqual(expectedSuccessAlertPush);
                            break;
                        case 4:
                            expect(lastAction).toEqual(expectedSuccessAlertData);
                            setTimeout(resolve, 0.01);
                            break;

                        default:
                            fail(`Unexpected action: ${JSON.stringify(lastAction)}`);
                            break;
                    }
                });
            });
            store.dispatch(walletsWithdrawCcyFetch(payload));

            return promise;
        });

        it('should handle withdraw error', async () => {
            const expectedWalletsWithdrawCcyError = {
                type: WALLETS_WITHDRAW_CCY_ERROR,
                payload: {
                    code: 500,
                    message: ['Server error'],
                },
            };
            const expectedCallErrorHandler = {
                payload: {
                    code: 500,
                    message: ['Server error'],
                    type: 'error',
                },
                type: ALERT_PUSH,
            };
            const expectedErrorAlert = {
                type: ALERT_DATA,
                payload: {
                    code: 500,
                    message: ['Server error'],
                    type: 'error',
                },
            };
            mockNetworkError(mockAxios);
            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    const lastAction = actions.slice(-1)[0];
                    switch (actions.length) {
                        case 1:
                            expect(lastAction).toEqual(expectedWalletsWithdrawCcyFetch);
                            break;

                        case 2:
                            expect(lastAction).toEqual(expectedWalletsWithdrawCcyError);
                            break;

                        case 3:
                            expect(lastAction).toEqual(expectedCallErrorHandler);
                            break;

                        case 4:
                            expect(lastAction).toEqual(expectedErrorAlert);
                            setTimeout(resolve, 0.01);
                            break;

                        default:
                            fail(`Unexpected action number ${actions.length}: ${JSON.stringify(lastAction)}`);
                            break;
                    }
                });
            });
            store.dispatch(walletsWithdrawCcyFetch(payload));

            return promise;
        });
    });
});
