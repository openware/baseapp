it('deprecated: saga, reducer, components with redux are tested separatelly', () => {
    expect(true).toBeTruthy();
});

// import MockAdapter from 'axios-mock-adapter';
// import { MockStoreEnhanced } from 'redux-mock-store';
// import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
// import { rootSaga } from '../..';
// import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../helpers/jest';
// import { getTimezone, setTimezone } from '../../../helpers/timezone';
// import { Market } from '../markets';
// import { recentTradesFetch } from './actions';
// import { RECENT_TRADES_DATA, RECENT_TRADES_ERROR, RECENT_TRADES_FETCH } from './constants';

// // tslint:disable no-any no-magic-numbers
// const debug = false;

// describe('Trades module', () => {
//     let store: MockStoreEnhanced;
//     let sagaMiddleware: SagaMiddleware<{}>;
//     let mockAxios: MockAdapter;
//     let originalTz: string;

//     beforeEach(() => {
//         originalTz = getTimezone();
//         setTimezone('Europe/Paris');
//         mockAxios = setupMockAxios();
//         sagaMiddleware = createSagaMiddleware();
//         store = setupMockStore(sagaMiddleware, debug)();
//         sagaMiddleware.run(rootSaga);
//     });

//     afterEach(() => {
//         mockAxios.reset();
//         setTimezone(originalTz);
//     });

//     const fakeTrades = [
//         {
//             id: 162413,
//             price: '0.01',
//             total: '0.00059',
//             amount: '0.059',
//             market: 'bchbtc',
//             created_at: '2018-12-18T14:21:23+01:00',
//             taker_type: 'sell',
//         },
//         {
//             id: 162412,
//             price: '0.01',
//             total: '0.0001',
//             amount: '0.01',
//             market: 'bchbtc',
//             created_at: '2018-12-18T14:21:23+01:00',
//             taker_type: 'buy',
//         },
//         {
//             id: 162411,
//             price: '0.05',
//             total: '0.0005',
//             amount: '0.01',
//             market: 'bchbtc',
//             created_at: '2018-12-18T14:21:23+01:00',
//             taker_type: 'buy',
//         },
//     ];

//     const mockOrders = () => {
//         mockAxios.onGet('/public/markets/xrpbtc/trades').reply(200, fakeTrades);
//     };

//     const currentMarket: Market = {
//         name: 'XRP/BTC',
//         id: 'xrpbtc',
//         base_unit: 'xrp',
//         quote_unit: 'btc',
//         min_price: '0.0',
//         max_price: '0.0',
//         min_amount: '0.0',
//         amount_precision: 4,
//         price_precision: 4,
//     };

//     const expectTradesFetch = { payload: currentMarket, type: RECENT_TRADES_FETCH };
//     const expectedTradesData = {
//         type: RECENT_TRADES_DATA,
//         payload: [
//             {
//                 id: 162413,
//                 price: '0.01',
//                 total: '0.00059',
//                 amount: '0.059',
//                 market: 'bchbtc',
//                 created_at: '2018-12-18T14:21:23+01:00',
//                 taker_type: 'sell',
//             },
//             {
//                 id: 162412,
//                 price: '0.01',
//                 total: '0.0001',
//                 amount: '0.01',
//                 market: 'bchbtc',
//                 created_at: '2018-12-18T14:21:23+01:00',
//                 taker_type: 'buy',
//             },
//             {
//                 id: 162411,
//                 price: '0.05',
//                 total: '0.0005',
//                 amount: '0.01',
//                 market: 'bchbtc',
//                 created_at: '2018-12-18T14:21:23+01:00',
//                 taker_type: 'buy',
//             },
//         ],
//     };

//     describe('working scenario', () => {
//         const expectedTradesError = {
//             type: RECENT_TRADES_ERROR,
//             payload: {
//                 code: 500,
//                 message: ['Server error'],
//             },
//         };

//         it('should fetch trades', async () => {
//             mockOrders();
//             const promise = new Promise(resolve => {
//                 store.subscribe(() => {
//                     const actions = store.getActions();
//                     if (actions.length === 2) {
//                         expect(actions[0]).toEqual(expectTradesFetch);
//                         expect(actions[1]).toEqual(expectedTradesData);
//                         resolve();
//                     }
//                 });
//             });

//             store.dispatch(recentTradesFetch(currentMarket));

//             return promise;
//         });

//         it('should handle fetch orders error', async () => {
//             mockNetworkError(mockAxios);
//             const promise = new Promise(resolve => {
//                 store.subscribe(() => {
//                     const actions = store.getActions();
//                     if (actions.length === 2) {
//                         expect(actions[0]).toEqual(expectTradesFetch);
//                         expect(actions[1]).toEqual(expectedTradesError);
//                         resolve();
//                     }
//                 });
//             });
//             store.dispatch(recentTradesFetch(currentMarket));

//             return promise;
//         });
//     });

// });
