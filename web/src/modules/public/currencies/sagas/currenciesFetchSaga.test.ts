import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { rootSaga, sendError } from '../../..';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../helpers/jest';
import { CommonError } from '../../../types';
import { currenciesData, currenciesError, currenciesFetch } from '../actions';
import { Currency } from '../types';

describe('Saga: currenciesFetchSaga', () => {
    let store: MockStoreEnhanced;
    let sagaMiddleware: SagaMiddleware;
    let mockAxios: MockAdapter;

    beforeEach(() => {
        mockAxios = setupMockAxios();
        sagaMiddleware = createSagaMiddleware();
        store = setupMockStore(sagaMiddleware, false)();
        sagaMiddleware.run(rootSaga);
    });

    afterEach(() => {
        mockAxios.reset();
    });

    const fakeCurrencies: Currency[] = [
        {
            id: 'bch',
            name: 'Bitcoin Cash',
            symbol: '฿',
            explorer_transaction: 'https://testnet.blockchain.info/tx/',
            explorer_address: 'https://testnet.blockchain.info/address/',
            type: 'coin',
            deposit_fee: '0.0',
            min_confirmations: 6,
            min_deposit_amount: '0.0000748',
            withdraw_fee: '0.0',
            min_withdraw_amount: '0.0',
            withdraw_limit_24h: '0.1',
            withdraw_limit_72h: '0.2',
            deposit_enabled: true,
            withdrawal_enabled: true,
            base_factor: 100000000,
            precision: 8,
            icon_url: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Ethereum_logo_2014.svg',
        },

        {
            id: 'eur',
            name: 'Euro',
            symbol: '€',
            explorer_transaction: 'https://testnet.blockchain.info/tx/',
            explorer_address: 'https://testnet.blockchain.info/address/',
            type: 'coin',
            deposit_fee: '0.0',
            min_confirmations: 4,
            min_deposit_amount: '0.0000748',
            withdraw_fee: '0.0',
            min_withdraw_amount: '0.0',
            withdraw_limit_24h: '0.1',
            withdraw_limit_72h: '0.2',
            deposit_enabled: true,
            withdrawal_enabled: true,
            base_factor: 100000000,
            precision: 8,
            icon_url: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Ethereum_logo_2014.svg',
        },
    ];

    const mockCurrencies = () => {
        mockAxios.onGet('/public/currencies').reply(200, fakeCurrencies);
    };

    const error: CommonError = {
        message: ['Server error'],
        code: 500,
    };

    it('should fetch currencies', async () => {
        const expectedActions = [currenciesFetch(), currenciesData(fakeCurrencies)];
        mockCurrencies();
        const promise = new Promise(resolve => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedActions.length) {
                    expect(actions).toEqual(expectedActions);
                    setTimeout(resolve, 0.01);
                }
                if (actions.length > expectedActions.length) {
                    fail(`Unexpected action: ${JSON.stringify(actions.slice(-1)[0])}`);
                }
            });
        });
        store.dispatch(currenciesFetch());

        return promise;
    });

    it('should trigger an error on currencies fetch', async () => {
        const expectedActions = [
            currenciesFetch(),
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: currenciesError,
                },
            }),
        ];

        mockNetworkError(mockAxios);
        const promise = new Promise(resolve => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedActions.length) {
                    expect(actions).toEqual(expectedActions);
                    setTimeout(resolve, 0.01);
                }
            });
        });
        store.dispatch(currenciesFetch());

        return promise;
    });
});
