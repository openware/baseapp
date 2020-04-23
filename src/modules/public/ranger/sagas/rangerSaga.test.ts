import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { rangerSagas } from '.';
import { Cryptobase, defaultConfig } from '../../../../api';
import { createEchoServer, setupMockStore } from '../../../../helpers/jest';
import { OrderEvent } from '../../../types';
import { PrivateTradeEvent } from '../../../user/history';
import { HISTORY_PUSH_EMIT } from '../../../user/history/constants';
import { KLINE_PUSH } from '../../kline/constants';
import { Market, Ticker, TickerEvent } from '../../markets';
import { MARKETS_TICKERS_DATA } from '../../markets/constants';
import { PublicTradeEvent } from '../../recentTrades';
import { RECENT_TRADES_PUSH } from '../../recentTrades/constants';
import {
    rangerConnectFetch,
    rangerDirectMessage,
    rangerDisconnectFetch,
    rangerSubscribeKlineMarket,
    rangerSubscribeMarket,
    rangerUnsubscribeKlineMarket,
    rangerUnsubscribeMarket,
} from '../actions';
import {
    RANGER_CONNECT_DATA,
    RANGER_CONNECT_FETCH,
    RANGER_DIRECT_WRITE,
    RANGER_DISCONNECT_DATA,
    RANGER_DISCONNECT_FETCH,
    RANGER_SUBSCRIPTIONS_DATA,
    RANGER_USER_ORDER_UPDATE,
} from '../constants';

// tslint:disable no-any no-magic-numbers no-console
const debug = false;
const echoServerPort = 9100;

describe('Ranger module', () => {
    let store: MockStoreEnhanced;
    let sagaMiddleware: SagaMiddleware<{}>;
    let pingServer: any;

    beforeAll(() => {
        pingServer = createEchoServer(echoServerPort, debug);
        Cryptobase.config = {
            ...defaultConfig,
            api: {
                authUrl: '',
                tradeUrl: '',
                applogicUrl: '',
                rangerUrl: `ws://localhost:${echoServerPort}`,
                arkeUrl: '',
                finexUrl: '',
            },
            rangerReconnectPeriod: '0.1',
        };
    });

    afterAll(() => {
        if (pingServer) {
            pingServer.close();
        }
    });

    beforeEach(() => {
        sagaMiddleware = createSagaMiddleware();
        store = setupMockStore(sagaMiddleware, debug)({
            app: {
                ranger: {
                    withAuth: false,
                    connected: false,
                    subscriptions: [],
                },
            },
        });
        sagaMiddleware.run(rangerSagas);
    });

    const marketExample: Market = {
        id: 'abcdefg',
        name: 'ABCD/EFG',
        base_unit: 'abcd',
        quote_unit: 'efg',
        min_price: '0.015',
        max_price: '0.016',
        min_amount: '0.00001',
        amount_precision: 6,
        price_precision: 6,
    };

    describe('automatically reconnect when connection is lost', async () => {
        it('reconnects after some time', async () => {
            return new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    const lastAction = actions.slice(-1)[0];

                    switch (actions.length) {
                        case 1:
                            expect(lastAction).toEqual({ type: RANGER_CONNECT_FETCH, payload: { withAuth: false } });

                            return;

                        case 2:
                            expect(lastAction).toEqual({ type: RANGER_CONNECT_DATA });
                            pingServer.close();
                            break;

                        case 3:
                            expect(lastAction).toEqual({ type: RANGER_DISCONNECT_DATA });
                            pingServer = createEchoServer(echoServerPort, debug);
                            break;

                        case 4:
                            expect(lastAction).toEqual({ type: RANGER_CONNECT_DATA });
                            resolve();
                            break;

                        default:
                            break;
                    }
                });

                store.dispatch(rangerConnectFetch({ withAuth: false }));
            });
        });

        it('bufferizes messages sent while the connection was not ready and send them once connection is back', async () => {
            return new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    const lastAction = actions.slice(-1)[0];
                    const msg1 = rangerDirectMessage({
                        success: {
                            message: 'subscribed',
                            streams: ['etheur.trades'],
                        },
                    });
                    const msg2 = rangerDirectMessage({
                        success: {
                            message: 'subscribed',
                            streams: ['btceur.trades'],
                        },
                    });
                    switch (actions.length) {
                        case 1:
                            expect(lastAction).toEqual({ type: RANGER_CONNECT_FETCH, payload: { withAuth: false } });

                            return;

                        case 2:
                            expect(lastAction).toEqual({ type: RANGER_CONNECT_DATA });
                            pingServer.close();
                            break;

                        case 3:
                            expect(lastAction).toEqual({ type: RANGER_DISCONNECT_DATA });
                            store.dispatch(msg1);
                            store.dispatch(msg2);
                            break;

                        case 4:
                            expect(lastAction).toEqual(msg1);
                            break;

                        case 5:
                            expect(lastAction).toEqual(msg2);
                            pingServer = createEchoServer(echoServerPort, debug);
                            break;

                        case 6:
                            expect(lastAction).toEqual({ type: RANGER_CONNECT_DATA });
                            break;

                        case 7:
                            expect(lastAction).toEqual({
                                type: RANGER_SUBSCRIPTIONS_DATA,
                                payload: { subscriptions: ['etheur.trades'] },
                            });
                            break;

                        case 8:
                            expect(lastAction).toEqual({
                                type: RANGER_SUBSCRIPTIONS_DATA,
                                payload: { subscriptions: ['btceur.trades'] },
                            });
                            resolve();
                            break;

                        default:
                            fail();
                            break;
                    }
                });

                store.dispatch(rangerConnectFetch({ withAuth: false }));
            });
        });
    });

    describe('channels subscription flow', () => {
        it('subscribes to market channels', () => {
            expect(rangerSubscribeMarket(marketExample)).toEqual({
                type: RANGER_DIRECT_WRITE,
                payload: { event: 'subscribe', streams: ['abcdefg.trades', 'abcdefg.update'] },
            });
        });

        it('unsubscribes from market channels', () => {
            expect(rangerUnsubscribeMarket(marketExample)).toEqual({
                type: RANGER_DIRECT_WRITE,
                payload: { event: 'unsubscribe', streams: ['abcdefg.trades', 'abcdefg.update'] },
            });
        });

        it('subscribes to market kline channel', () => {
            expect(rangerSubscribeKlineMarket(marketExample.id, '1w')).toEqual({
                type: RANGER_DIRECT_WRITE,
                payload: { event: 'subscribe', streams: ['abcdefg.kline-1w'] },
            });
        });

        it('unsubscribes from market kline channel', () => {
            expect(rangerUnsubscribeKlineMarket(marketExample.id, '1w')).toEqual({
                type: RANGER_DIRECT_WRITE,
                payload: { event: 'unsubscribe', streams: ['abcdefg.kline-1w'] },
            });
        });
    });

    describe('support disconnect action', () => {
        it('disconnects and trigger disconnect action', async () => {
            return new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    const lastAction = actions.slice(-1)[0];
                    switch (actions.length) {
                        case 1:
                            expect(lastAction).toEqual({ type: RANGER_CONNECT_FETCH, payload: { withAuth: false } });

                            return;

                        case 2:
                            expect(lastAction).toEqual({ type: RANGER_CONNECT_DATA });
                            store.dispatch(rangerDisconnectFetch());

                            return;

                        case 3:
                            expect(lastAction).toEqual({ type: RANGER_DISCONNECT_FETCH });

                            return;

                        case 4:
                            expect(lastAction).toEqual({ type: RANGER_DISCONNECT_DATA });
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
        describe('kline event', () => {
            const cases = (() => {
                const klineString = ['1549638900', '0.007', '0.007', '0.007', '0.007', '0'];
                const klinNumber = [1549744200, 0.007, 0.007, 0.0069, 0.007, 0.011];
                const klineEventString: { [pair: string]: string[] } = { 'kyneth.kline-5m': klineString };
                const klineEventNumber: { [pair: string]: number[] } = { 'dasheth.kline-15m': klinNumber };

                return [
                    {
                        description: 'string klines',
                        kline: klineString,
                        event: klineEventString,
                        period: '5m',
                        marketId: 'kyneth',
                    },
                    {
                        description: 'number klines',
                        kline: klinNumber,
                        event: klineEventNumber,
                        period: '15m',
                        marketId: 'dasheth',
                    },
                ];
            })();

            for (const { description, kline, event, period, marketId } of cases) {
                const expectedAction = {
                    type: KLINE_PUSH,
                    payload: {
                        marketId,
                        kline,
                        period,
                    },
                };
                it(`should push ${description} update`, async () => {
                    return new Promise(resolve => {
                        store.dispatch(rangerConnectFetch({ withAuth: false }));
                        store.subscribe(() => {
                            const actions = store.getActions();
                            const lastAction = actions.slice(-1)[0];
                            switch (actions.length) {
                                case 1:
                                    expect(lastAction).toEqual({
                                        type: RANGER_CONNECT_FETCH,
                                        payload: { withAuth: false },
                                    });

                                    return;

                                case 2:
                                    expect(lastAction).toEqual({ type: RANGER_CONNECT_DATA });
                                    store.dispatch(rangerDirectMessage(event));

                                    return;

                                case 3:
                                    expect(lastAction).toEqual({ type: RANGER_DIRECT_WRITE, payload: event });

                                    return;

                                case 4:
                                    expect(lastAction).toEqual(expectedAction);
                                    setTimeout(resolve, 30);

                                    return;

                                default:
                                    fail(`Unexpected action ${actions.length}`);
                                    break;
                            }
                        });
                    });
                });
            }
        });

        describe('markets tickers update', () => {
            const tickerEvents: { [pair: string]: TickerEvent } = {
                ethzar: {
                    amount: '4.0',
                    name: 'ETH/ZAR',
                    base_unit: 'eth',
                    quote_unit: 'zar',
                    low: '0.001',
                    high: '0.145',
                    last: '0.134',
                    open: 0.134,
                    volume: '8.0',
                    at: 1547625102601,
                    avg_price: '69.5',
                    price_change_percent: '+10.05%',
                },
                xrpbtc: {
                    amount: '3.3',
                    name: 'XRP/BTC',
                    base_unit: 'xrp',
                    quote_unit: 'btc',
                    low: '0.001',
                    high: '0.145',
                    last: '0.134',
                    open: 0.134,
                    volume: '9.0',
                    at: 1547625102601,
                    avg_price: '69.5',
                    price_change_percent: '+10.05%',
                },
                ltcbtc: {
                    amount: '5.0',
                    name: 'LTC/BTC',
                    base_unit: 'ltc',
                    quote_unit: 'btc',
                    low: '0.001',
                    high: '0.145',
                    last: '0.134',
                    open: 0.134,
                    volume: '10.0',
                    at: 1547625102601,
                    avg_price: '69.5',
                    price_change_percent: '+10.05%',
                },
            };
            const tickers: { [pair: string]: Ticker } = {
                ethzar: {
                    amount: '4.0',
                    low: '0.001',
                    high: '0.145',
                    last: '0.134',
                    open: 0.134,
                    volume: '8.0',
                    avg_price: '69.5',
                    price_change_percent: '+10.05%',
                },
                xrpbtc: {
                    amount: '3.3',
                    low: '0.001',
                    high: '0.145',
                    last: '0.134',
                    open: 0.134,
                    volume: '9.0',
                    avg_price: '69.5',
                    price_change_percent: '+10.05%',
                },
                ltcbtc: {
                    amount: '5.0',
                    low: '0.001',
                    high: '0.145',
                    last: '0.134',
                    open: 0.134,
                    volume: '10.0',
                    avg_price: '69.5',
                    price_change_percent: '+10.05%',
                },
            };
            const mockGlobalTickers = { 'global.tickers': tickerEvents };

            const expectedAction = {
                type: MARKETS_TICKERS_DATA,
                payload: tickers,
            };

            it('should push market tickers', async () => {
                return new Promise(resolve => {
                    store.dispatch(rangerConnectFetch({ withAuth: false }));
                    store.subscribe(() => {
                        const actions = store.getActions();
                        const lastAction = actions.slice(-1)[0];
                        switch (actions.length) {
                            case 1:
                                expect(lastAction).toEqual({
                                    type: RANGER_CONNECT_FETCH,
                                    payload: { withAuth: false },
                                });

                                return;

                            case 2:
                                expect(lastAction).toEqual({ type: RANGER_CONNECT_DATA });
                                store.dispatch(rangerDirectMessage(mockGlobalTickers));

                                return;

                            case 3:
                                expect(lastAction).toEqual({ type: RANGER_DIRECT_WRITE, payload: mockGlobalTickers });

                                return;

                            case 4:
                                expect(lastAction).toEqual(expectedAction);
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
                asks: [['0.0005', '97.4'], ['2.0', '0.8569'], ['2.5', '1.0'], ['3.0', '1.0']],
                bids: [['0.0001', '10.0'], ['0.0000008', '8.9']],
            };
            const mockOrderBookUpdate = { 'eurbtc.update': data };

            it('should not push order book if market is not selected', async () => {
                return new Promise(resolve => {
                    store.dispatch(rangerConnectFetch({ withAuth: false }));
                    store.subscribe(() => {
                        const actions = store.getActions();
                        const lastAction = actions.slice(-1)[0];
                        switch (actions.length) {
                            case 1:
                                expect(actions[0]).toEqual({
                                    type: RANGER_CONNECT_FETCH,
                                    payload: { withAuth: false },
                                });

                                return;

                           case 2:
                                expect(lastAction).toEqual({ type: RANGER_CONNECT_DATA });
                                store.dispatch(rangerDirectMessage(mockOrderBookUpdate));

                                return;

                            case 3:
                                expect(lastAction).toEqual({ type: RANGER_DIRECT_WRITE, payload: mockOrderBookUpdate });
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
                taker_type: 'buy',
                date: 1547464388,
                price: '0.0002',
                amount: '0.00015',
                total: '0.00000003',
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
                        const lastAction = actions.slice(-1)[0];
                        switch (actions.length) {
                            case 1:
                                expect(lastAction).toEqual({
                                    type: RANGER_CONNECT_FETCH,
                                    payload: { withAuth: false },
                                });

                                return;

                            case 2:
                                expect(lastAction).toEqual({ type: RANGER_CONNECT_DATA });
                                store.dispatch(rangerDirectMessage({ 'eurbtc.trades': mockTrades }));

                                return;

                            case 3:
                                expect(lastAction).toEqual({
                                    type: RANGER_DIRECT_WRITE,
                                    payload: { 'eurbtc.trades': mockTrades },
                                });

                                return;

                            case 4:
                                expect(lastAction).toEqual(expectedAction);
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
            const data: OrderEvent = {
                id: 758,
                at: 1546605232,
                market: 'eurbtc',
                kind: 'bid',
                price: '1.17',
                state: 'wait',
                remaining_volume: '0.1',
                origin_volume: '0.1',
            };
            const mockOrder = { order: data };
            const expectedAction = {
                type: RANGER_USER_ORDER_UPDATE,
                payload: data,
            };
            it('should push user order', async () => {
                return new Promise(resolve => {
                    store.subscribe(() => {
                        const actions = store.getActions();
                        const lastAction = actions.slice(-1)[0];
                        switch (actions.length) {
                            case 1:
                                expect(lastAction).toEqual({ type: RANGER_CONNECT_FETCH, payload: { withAuth: true } });

                                return;

                            case 2:
                                expect(lastAction).toEqual({ type: RANGER_CONNECT_DATA });
                                store.dispatch(rangerDirectMessage(mockOrder));

                                return;

                            case 3:
                                expect(lastAction).toEqual({ type: RANGER_DIRECT_WRITE, payload: mockOrder });

                                return;

                            case 4:
                                expect(lastAction).toEqual(expectedAction);
                                setTimeout(resolve, 30);

                                return;
                            case 5:
                                expect(lastAction).toEqual({
                                    type: 'ordersHistory/RANGER_DATA',
                                    payload:
                                        {
                                            id: 758,
                                            at: 1546605232,
                                            market: 'eurbtc',
                                            kind: 'bid',
                                            price: '1.17',
                                            state: 'wait',
                                            remaining_volume: '0.1',
                                            origin_volume: '0.1',
                                        },
                                });

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
            const data: OrderEvent = {
                id: 758,
                at: 1546605232,
                market: 'eurbtc',
                kind: 'bid',
                price: '1.17',
                state: 'done',
                remaining_volume: '0.0',
                origin_volume: '0.1',
            };
            const mockOrder = { order: data };
            const expectedAction = {
                type: RANGER_USER_ORDER_UPDATE,
                payload: data,
            };
            it('should push user order', async () => {
                return new Promise(resolve => {
                    store.subscribe(() => {
                        const actions = store.getActions();
                        const lastAction = actions.slice(-1)[0];
                        switch (actions.length) {
                            case 1:
                                expect(lastAction).toEqual({ type: RANGER_CONNECT_FETCH, payload: { withAuth: true } });

                                return;

                            case 2:
                                expect(lastAction).toEqual({ type: RANGER_CONNECT_DATA });
                                store.dispatch(rangerDirectMessage(mockOrder));

                                return;

                            case 3:
                                expect(lastAction).toEqual({ type: RANGER_DIRECT_WRITE, payload: mockOrder });

                                return;

                            case 4:
                                expect(lastAction).toEqual(expectedAction);
                                setTimeout(resolve, 30);

                                return;
                            case 5:
                                expect(lastAction).toEqual({
                                    type: 'ordersHistory/RANGER_DATA',
                                    payload:
                                        {
                                            id: 758,
                                            at: 1546605232,
                                            market: 'eurbtc',
                                            kind: 'bid',
                                            price: '1.17',
                                            state: 'done',
                                            remaining_volume: '0.0',
                                            origin_volume: '0.1',
                                        },
                                });

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
                price: '1.17',
                total: '0.117',
                amount: '0.1',
                market: 'eurbtc',
                created_at: '5292292012',
                taker_type: 'buy',
            };
            const mockTrade = { trade: privateTradeEvent };
            const expectedTradeAction = {
                type: HISTORY_PUSH_EMIT,
                payload: privateTradeEvent,
            };
            it('should push trades', async () => {
                return new Promise(resolve => {
                    store.subscribe(() => {
                        const actions = store.getActions();
                        const lastAction = actions.slice(-1)[0];
                        switch (actions.length) {
                            case 1:
                                expect(lastAction).toEqual({ type: RANGER_CONNECT_FETCH, payload: { withAuth: true } });

                                return;

                            case 2:
                                expect(lastAction).toEqual({ type: RANGER_CONNECT_DATA });
                                store.dispatch(rangerDirectMessage(mockTrade));

                                return;

                            case 3:
                                expect(lastAction).toEqual({ type: RANGER_DIRECT_WRITE, payload: mockTrade });
                                setTimeout(resolve, 30);

                                return;

                            case 4:
                                expect(lastAction).toEqual(expectedTradeAction);
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
