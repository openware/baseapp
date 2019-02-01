import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { Cryptobase } from '../../api/config';
import { createEchoServer as createEchoServer, setupMockStore } from '../../helpers/jest';
import { PrivateTradeEvent } from '../history/trades';
import { TRADES_PUSH } from '../history/trades/constants';
import { Ticker, TickerEvent } from '../markets';
import { MARKETS_TICKERS_DATA } from '../markets/constants';
import { DEPTH_DATA } from '../orderBook/constants';
import { PublicTradeEvent } from '../recentTrades';
import { RECENT_TRADES_PUSH } from '../recentTrades/constants';
import { OrderEvent } from '../types';
import { rangerConnectFetch, rangerDirectMessage, rangerDisconnectFetch, rangerSubscribeMarket, rangerUnsubscribeMarket } from './actions';
import { RANGER_CONNECT_DATA, RANGER_CONNECT_FETCH, RANGER_DIRECT_WRITE, RANGER_DISCONNECT_DATA, RANGER_DISCONNECT_FETCH } from './constants';
import { formatTicker, rangerSagas } from './sagas';

// tslint:disable no-any no-magic-numbers no-console
const debug = false;
const echoServerPort = 9099;

describe('Ranger module', () => {
    let store: MockStoreEnhanced;
    let sagaMiddleware: SagaMiddleware<{}>;
    let pingServer: any;

    beforeAll(() => {
        pingServer = createEchoServer(echoServerPort, debug);
        Cryptobase.config = {
            api: {
                gatewayUrl: '/api/v2',
                rangerUrl: `ws://localhost:${echoServerPort}`,
            },
            minutesUntilAutoLogout: '5',
            withCredentials: true,
            storage: {
                defaultStorageLimit: 10,
            },
            captcha: {
                captchaType: 'none',
                siteKey: '',
            },
        };
    });

    afterAll(() => {
        if (pingServer) {
            pingServer.close();
        }
    });

    beforeEach(() => {
        sagaMiddleware = createSagaMiddleware();
        store = setupMockStore(sagaMiddleware, debug)();
        sagaMiddleware.run(rangerSagas);
    });

    describe('channels subscription flow', () => {
        it('subscribes to market channels', () => {
            expect(rangerSubscribeMarket('abcd')).toEqual({
                type: RANGER_DIRECT_WRITE,
                payload: { event: 'subscribe', streams: ['abcd.trades'] },
            });
        });

        it('unsubscribes from market channels', () => {
            expect(rangerUnsubscribeMarket('abcd')).toEqual({
                type: RANGER_DIRECT_WRITE,
                payload: { event: 'unsubscribe', streams: ['abcd.trades'] },
            });
        });
    });

    describe('support disconnect action', () => {
        it('disconnects and trigger disconnect action', async () => {
            return new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    switch (actions.length) {
                        case 1:
                            expect(actions[0]).toEqual({ type: RANGER_CONNECT_FETCH, payload: { withAuth: false } });
                            return;

                        case 2:
                            expect(actions[1]).toEqual({ type: RANGER_CONNECT_DATA });
                            store.dispatch(rangerDisconnectFetch());
                            return;

                        case 3:
                            expect(actions[2]).toEqual({ type: RANGER_DISCONNECT_FETCH });
                            return;

                        case 4:
                            expect(actions[3]).toEqual({ type: RANGER_DISCONNECT_DATA });
                            setTimeout(resolve, 30);
                            return;

                        default:
                            fail(`Unexpected action ${actions.length}`);
                            break;
                    }
                });
                store.dispatch(rangerConnectFetch({ withAuth: false }));
            });
        });

    });

    describe('public events', () => {
        describe('markets tickers update', () => {
            const tickerEvents: { [pair: string]: TickerEvent } = {
                ethzar: { name: 'ETH/ZAR', base_unit: 'eth', quote_unit: 'zar', low: '0.001', high: '0.145', last: '0.134', open: 0.134, volume: '8.0', sell: '70.0', buy: '69.0', at: 1547625102601, avg_price: '69.5', price_change_percent: '+10.05%' },
                xrpbtc: { name: 'XRP/BTC', base_unit: 'xrp', quote_unit: 'btc', low: '0.001', high: '0.145', last: '0.134', open: 0.134, volume: '9.0', sell: '80.0', buy: '79.0', at: 1547625102601, avg_price: '69.5', price_change_percent: '+10.05%' },
                ltcbtc: { name: 'LTC/BTC', base_unit: 'ltc', quote_unit: 'btc', low: '0.001', high: '0.145', last: '0.134', open: 0.134, volume: '10.0', sell: '90.0', buy: '89.0', at: 1547625102601, avg_price: '69.5', price_change_percent: '+10.05%' },
            };
            const tickers: { [pair: string]: Ticker } = {
                ethzar: { low: '0.001', high: '0.145', last: '0.134', open: 0.134, vol: '8.0', sell: '70.0', buy: '69.0', avg_price: '69.5', price_change_percent: '+10.05%' },
                xrpbtc: { low: '0.001', high: '0.145', last: '0.134', open: 0.134, vol: '9.0', sell: '80.0', buy: '79.0', avg_price: '69.5', price_change_percent: '+10.05%' },
                ltcbtc: { low: '0.001', high: '0.145', last: '0.134', open: 0.134, vol: '10.0', sell: '90.0', buy: '89.0', avg_price: '69.5', price_change_percent: '+10.05%' },
            };
            const mockGlobalTickers = { 'global.tickers': tickerEvents };

            const expectedAction = {
                type: MARKETS_TICKERS_DATA,
                payload: tickers,
            };

            it('formats tickers info from events', () => {
                expect(formatTicker(tickerEvents)).toEqual(tickers);
            });

            it('should push market tickers', async () => {
                return new Promise(resolve => {
                    store.dispatch(rangerConnectFetch({ withAuth: false }));
                    store.subscribe(() => {
                        const actions = store.getActions();
                        switch (actions.length) {
                            case 1:
                                expect(actions[0]).toEqual({ type: RANGER_CONNECT_FETCH, payload: { withAuth: false } });
                                return;

                            case 2:
                                expect(actions[1]).toEqual({ type: RANGER_CONNECT_DATA });
                                store.dispatch(rangerDirectMessage(mockGlobalTickers));
                                return;

                            case 3:
                                expect(actions[2]).toEqual({ type: RANGER_DIRECT_WRITE, payload: mockGlobalTickers });
                                return;

                            case 4:
                                expect(actions[3]).toEqual(expectedAction);
                                setTimeout(resolve, 30);
                                return;

                            default:
                                fail(`Unexpected action ${actions.length}`);
                                break;
                        }
                    });
                });
            });
        });

        describe('market depth update', () => {
            const data = {
                asks: [
                    ['0.0005', '97.4'],
                    ['2.0', '0.8569'],
                    ['2.5', '1.0'],
                    ['3.0', '1.0'],
                ],
                bids: [
                    ['0.0001', '10.0'],
                    ['0.0000008', '8.9'],
                ],
            };
            const mockOrderBookUpdate = { 'eurbtc.update': data };
            const expectedAction = {
                type: DEPTH_DATA,
                payload: data,
            };
            it('should push order book', async () => {
                return new Promise(resolve => {
                    store.dispatch(rangerConnectFetch({ withAuth: false }));
                    store.subscribe(() => {
                        const actions = store.getActions();
                        switch (actions.length) {
                            case 1:
                                expect(actions[0]).toEqual({ type: RANGER_CONNECT_FETCH, payload: { withAuth: false } });
                                return;

                            case 2:
                                expect(actions[1]).toEqual({ type: RANGER_CONNECT_DATA });
                                store.dispatch(rangerDirectMessage(mockOrderBookUpdate));
                                return;

                            case 3:
                                expect(actions[2]).toEqual({ type: RANGER_DIRECT_WRITE, payload: mockOrderBookUpdate });
                                return;

                            case 4:
                                expect(actions[3]).toEqual(expectedAction);
                                setTimeout(resolve, 30);
                                return;

                            default:
                                fail(`Unexpected action ${actions.length}`);
                                break;
                        }
                    });
                });
            });
        });

        describe('trades', () => {
            const tradeEvent: PublicTradeEvent = {
                tid: 100022,
                type: 'buy',
                date: 1547464388,
                price: '0.0002',
                amount: '0.00015',
            };
            const mockTrades = {
                trades: [tradeEvent],
            };
            const expectedAction = {
                type: RECENT_TRADES_PUSH,
                payload: {
                    ...mockTrades,
                    market: 'eurbtc',
                },
            };
            it('should push trades', async () => {
                return new Promise(resolve => {
                    store.subscribe(() => {
                        const actions = store.getActions();
                        switch (actions.length) {
                            case 1:
                                expect(actions[0]).toEqual({ type: RANGER_CONNECT_FETCH, payload: { withAuth: false } });
                                return;

                            case 2:
                                expect(actions[1]).toEqual({ type: RANGER_CONNECT_DATA });
                                store.dispatch(rangerDirectMessage({ 'eurbtc.trades': mockTrades }));
                                return;

                            case 3:
                                expect(actions[2]).toEqual({ type: RANGER_DIRECT_WRITE, payload: { 'eurbtc.trades': mockTrades } });
                                return;

                            case 4:
                                expect(actions[3]).toEqual(expectedAction);
                                setTimeout(resolve, 30);
                                return;

                            default:
                                fail(`Unexpected action ${actions.length}`);
                                break;
                        }
                    });
                    store.dispatch(rangerConnectFetch({ withAuth: false }));
                });
            });
        });


    });

    describe('private events', () => {
        describe('should push new order', () => {
            const data: OrderEvent = { id: 758, at: 1546605232, market: 'eurbtc', kind: 'bid', price: '1.17', state: 'wait', volume: '0.1', origin_volume: '0.1' };
            const mockOrder = { order: data };
            const expectedAction = {
                type: 'orders/USER_ORDERS_UPDATE',
                payload: data,
            };
            it('should push user order', async () => {
                return new Promise(resolve => {
                    store.subscribe(() => {
                        const actions = store.getActions();
                        switch (actions.length) {
                            case 1:
                                expect(actions[0]).toEqual({ type: RANGER_CONNECT_FETCH, payload: { withAuth: true } });
                                return;

                            case 2:
                                expect(actions[1]).toEqual({ type: RANGER_CONNECT_DATA });
                                store.dispatch(rangerDirectMessage(mockOrder));
                                return;

                            case 3:
                                expect(actions[2]).toEqual({ type: RANGER_DIRECT_WRITE, payload: mockOrder });
                                return;

                            case 4:
                                expect(actions[3]).toEqual(expectedAction);
                                setTimeout(resolve, 30);
                                return;

                            default:
                                fail(`Unexpected action ${actions.length}`);
                                break;
                        }
                    });
                    store.dispatch(rangerConnectFetch({ withAuth: true }));
                });
            });
        });

        describe('should push close order', () => {
            const data: OrderEvent = { id: 758, at: 1546605232, market: 'eurbtc', kind: 'bid', price: '1.17', state: 'done', volume: '0.0', origin_volume: '0.1' };
            const mockOrder = { order: data };
            const expectedAction = {
                type: 'orders/USER_ORDERS_UPDATE',
                payload: data,
            };
            it('should push user order', async () => {
                return new Promise(resolve => {
                    store.subscribe(() => {
                        const actions = store.getActions();
                        switch (actions.length) {
                            case 1:
                                expect(actions[0]).toEqual({ type: RANGER_CONNECT_FETCH, payload: { withAuth: true } });
                                return;

                            case 2:
                                expect(actions[1]).toEqual({ type: RANGER_CONNECT_DATA });
                                store.dispatch(rangerDirectMessage(mockOrder));
                                return;

                            case 3:
                                expect(actions[2]).toEqual({ type: RANGER_DIRECT_WRITE, payload: mockOrder });
                                return;

                            case 4:
                                expect(actions[3]).toEqual(expectedAction);
                                setTimeout(resolve, 30);
                                return;

                            default:
                                fail(`Unexpected action ${actions.length}`);
                                break;
                        }
                    });
                    store.dispatch(rangerConnectFetch({ withAuth: true }));
                });
            });
        });

        describe('trade', () => {
            const privateTradeEvent: PrivateTradeEvent = {
                id: 312,
                kind: 'bid',
                at: 1546605232,
                price: '1.17',
                volume: '0.1',
                ask_id: 651,
                bid_id: 758,
                market: 'eurbtc',
            };
            const mockTrade = { trade: privateTradeEvent };
            const expectedTradeAction = {
                type: TRADES_PUSH,
                payload: privateTradeEvent,
            };
            it('should push trades', async () => {
                return new Promise(resolve => {
                    store.subscribe(() => {
                        const actions = store.getActions();
                        switch (actions.length) {
                            case 1:
                                expect(actions[0]).toEqual({ type: RANGER_CONNECT_FETCH, payload: { withAuth: true } });
                                return;

                            case 2:
                                expect(actions[1]).toEqual({ type: RANGER_CONNECT_DATA });
                                store.dispatch(rangerDirectMessage(mockTrade));
                                return;

                            case 3:
                                expect(actions[2]).toEqual({ type: RANGER_DIRECT_WRITE, payload: mockTrade });
                                return;

                            case 4:
                                expect(actions[3]).toEqual(expectedTradeAction);
                                setTimeout(resolve, 30);
                                return;

                            default:
                                fail(`Unexpected action ${actions.length}`);
                                break;
                        }
                    });
                    store.dispatch(rangerConnectFetch({ withAuth: true }));
                });
            });
        });
    });
});
