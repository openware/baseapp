import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { rootSaga } from '../../..';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../helpers/jest';
import { Market } from '../../markets';
import { depthData, depthError, depthFetch } from '../actions';

// tslint:disable no-any no-magic-numbers
describe('Saga: depth', () => {
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

    const fakeMarket: Market = {
        id: 'btczar',
        name: 'BTC/ZAR',
        base_unit: 'btc',
        quote_unit: 'zar',
        min_price: '0.0',
        max_price: '0.0',
        min_amount: '0.0',
        amount_precision: 4,
        price_precision: 4,
};

    const fakeError = {
        code: 500,
        message: ['Server error'],
    };

    const fakeDepth = {
        asks: [
            [ '0.99', '1' ],
            [ '0.98', '20' ],
            [ '0.96', '1' ],
            [ '0.80', '1' ],
            [ '0.75', '1' ],
            [ '0.70', '1' ],
            [ '0.60', '0.1' ],
        ],
        bids: [
            [ '0.50', '0.041' ],
            [ '0.49', '0.5' ],
            [ '0.48', '0.2' ],
            [ '0.47', '0.1' ],
            [ '0.30', '10' ],
            [ '0.28', '2' ],
            [ '0.27', '5' ],
            [ '0.26', '25' ],
        ],
        loading: false,
    };

    const mockDepth = () => {
        mockAxios.onGet('/public/markets/btczar/depth').reply(200, fakeDepth);
    };

    const expectedActionsFetch = [depthFetch(fakeMarket), depthData(fakeDepth)];
    const expectedActionsError = [depthFetch(fakeMarket), depthError(fakeError)];

    it('should fetch depth', async () => {
        mockDepth();
        const promise = new Promise(resolve => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedActionsFetch.length) {
                    expect(actions).toEqual(expectedActionsFetch);
                    resolve();
                }
            });
        });

        store.dispatch(depthFetch(fakeMarket));

        return promise;
    });

    it('should trigger an error (marketDepth)', async () => {
        mockNetworkError(mockAxios);
        const promise = new Promise(resolve => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedActionsError.length) {
                    expect(actions).toEqual(expectedActionsError);
                    resolve();
                }
            });
        });
        store.dispatch(depthFetch(fakeMarket));

        return promise;
    });
});
