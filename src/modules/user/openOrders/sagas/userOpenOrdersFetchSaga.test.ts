import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { rootSaga } from '../../..';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../helpers/jest';
import { Market } from '../../../../modules';
import { alertPush } from '../../../public/alert';
import { OrderAPI } from '../../../types';
import { userOpenOrdersData, userOpenOrdersError, userOpenOrdersFetch } from '../actions';


describe('Open Orders Cancel', () => {
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

    const fakeError = {
        code: 500,
        message: ['Server error'],
        type: 'error',
    };

    const fakeMarket: Market = {
        id:'ethusd',
        name:'ETH/USD',
        base_unit:'eth',
        quote_unit:'usd',
        min_price:'0.0',
        max_price:'0.0',
        min_amount:'0.0',
        amount_precision:4,
        price_precision:4,
    };

    const fakeOpenOrders: OrderAPI[] = [
        {
            id: 162,
            side: 'buy',
            price: '0.3',
            state: 'wait',
            created_at: '2018-11-29T16:54:46+01:00',
            remaining_volume: '123.1234',
            origin_volume: '123.1234',
            executed_volume: '0',
            market: 'ethusd',
            ord_type: 'limit',
            avg_price: '0.3',
        },
        {
            id: 16,
            side: 'sell',
            price: '0.3',
            state: 'wait',
            created_at: '2018-11-29T16:54:46+01:00',
            remaining_volume: '123.1234',
            origin_volume: '123.1234',
            executed_volume: '0',
            market: 'ethusd',
            ord_type: 'limit',
            avg_price: '0.3',
        },
    ];

    const fakeFetchPayload = { market: fakeMarket };


    const mockGetOpenOrders = () => {
        mockAxios.onGet(`/market/orders?market=ethusd&state=wait`).reply(200, fakeOpenOrders);
    };

    const expectedActionsFetch = [
        userOpenOrdersFetch(fakeFetchPayload),
        userOpenOrdersData(fakeOpenOrders),
    ];
    const expectedActionsError = [
        userOpenOrdersFetch(fakeFetchPayload),
        userOpenOrdersError(),
        alertPush(fakeError),
    ];

    it('should fetch open orders', async () => {
        mockGetOpenOrders();
        const promise = new Promise(resolve => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedActionsFetch.length) {
                    expect(actions).toEqual(expectedActionsFetch);
                    resolve();
                }
            });
        });
        store.dispatch(userOpenOrdersFetch(fakeFetchPayload));

        return promise;
    });

    it('should trigger an error', async () => {
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
        store.dispatch(userOpenOrdersFetch(fakeFetchPayload));

        return promise;
    });
});
