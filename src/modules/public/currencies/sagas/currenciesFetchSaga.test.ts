import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { rootSaga } from '../../..';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../helpers/jest';
import { alertData, alertPush } from '../../alert';
import {
    currenciesData,
    currenciesError,
    currenciesFetch,
} from '../actions';
import { Currency } from '../types';

// tslint:disable no-any no-magic-numbers
describe('Saga: currenciesFetchSaga', () => {
    let store: MockStoreEnhanced;
    let sagaMiddleware: SagaMiddleware<{}>;
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
            min_deposit_amount: '0.0000748',
            withdraw_fee: '0.0',
            min_withdraw_amount: '0.0',
            withdraw_limit_24h: '0.1',
            withdraw_limit_72h: '0.2',
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
            min_deposit_amount: '0.0000748',
            withdraw_fee: '0.0',
            min_withdraw_amount: '0.0',
            withdraw_limit_24h: '0.1',
            withdraw_limit_72h: '0.2',
            base_factor: 100000000,
            precision: 8,
            icon_url: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Ethereum_logo_2014.svg',
        },
    ];

    const mockCurrencies = () => {
        mockAxios.onGet('/public/currencies').reply(200, fakeCurrencies);
    };

    const alertDataPayload = {
        message: ['Server error'],
        code: 500,
        type: 'error',
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
        const expectedActions = [currenciesFetch(), currenciesError(), alertPush(alertDataPayload), alertData(alertDataPayload)];
        mockNetworkError(mockAxios);
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
});
