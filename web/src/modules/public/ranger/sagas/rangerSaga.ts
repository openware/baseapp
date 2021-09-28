import { Channel, eventChannel, EventChannel } from 'redux-saga';
import { all, call, cancel, delay, fork, put, race, select, take, takeEvery } from 'redux-saga/effects';
import { p2pOffersUpdate } from 'src/modules';
import { p2pUserOffersUpdate } from 'src/modules/user/p2pOffers';
import { p2pOrdersDataWS } from 'src/modules/user/p2pOrders';
import { isFinexEnabled, rangerUrl } from '../../../../api';
import { store } from '../../../../store';
import { pushHistoryEmit } from '../../../user/history';
import { selectOpenOrdersList, userOpenOrdersUpdate } from '../../../user/openOrders';
import { userOrdersHistoryRangerData} from '../../../user/ordersHistory';
import { updateP2PWalletsDataByRanger, updateWalletsDataByRanger, walletsAddressDataWS } from '../../../user/wallets';
import { alertPush } from '../../alert';
import { klinePush } from '../../kline';
import { Market, marketsTickersData, selectCurrentMarket, SetCurrentMarket } from '../../markets';
import { MARKETS_SET_CURRENT_MARKET, MARKETS_SET_CURRENT_MARKET_IFUNSET } from '../../markets/constants';
import { depthData, depthDataIncrement, depthDataSnapshot, selectOrderBookSequence } from '../../orderBook';
import { recentTradesPush } from '../../recentTrades';
import {
    RangerConnectFetch,
    rangerDisconnectData,
    rangerDisconnectFetch,
    rangerSubscribeMarket,
    rangerUnsubscribeMarket,
    rangerUserOrderUpdate,
    subscriptionsUpdate,
    UserOrderUpdate,
} from '../actions';
import {
    RANGER_CONNECT_DATA,
    RANGER_CONNECT_FETCH,
    RANGER_DIRECT_WRITE,
    RANGER_DISCONNECT_DATA,
    RANGER_DISCONNECT_FETCH,
    RANGER_USER_ORDER_UPDATE,
} from '../constants';
import { formatTicker, generateSocketURI, streamsBuilder } from '../helpers';
import { selectSubscriptions } from '../selectors';

interface RangerBuffer {
    messages: object[];
}

const initRanger = (
    { withAuth, withP2P }: RangerConnectFetch['payload'],
    market: Market | undefined,
    prevSubs: string[],
    buffer: RangerBuffer,
): [EventChannel<any>, WebSocket] => {
    const baseUrl = `${rangerUrl()}/${withAuth ? 'private' : 'public'}`;
    const streams = streamsBuilder(withAuth, withP2P, prevSubs, market);

    const ws = new WebSocket(generateSocketURI(baseUrl, streams));
    const channel = eventChannel(emitter => {
        ws.onopen = () => {
            emitter({ type: RANGER_CONNECT_DATA });
            while (buffer.messages.length > 0) {
                const message = buffer.messages.shift();
                ws.send(JSON.stringify(message));
            }
        };
        ws.onerror = error => {
            window.console.log(`WebSocket error ${error}`);
            window.console.dir(error);
        };
        ws.onclose = event => {
            channel.close();
        };
        ws.onmessage = ({ data }) => {
            let payload: { [pair: string]: any } = {};

            try {
                payload = JSON.parse(data as string);
            } catch (e) {
                window.console.error(`Error parsing : ${e.data}`);
            }

            for (const routingKey in payload) {
                if (payload.hasOwnProperty(routingKey)) {
                    const event = payload[routingKey];

                    const currentMarket = store && selectCurrentMarket(store.getState());
                    const orderBookMatch = routingKey.match(/([^.]*)\.update/);
                    const orderBookMatchSnap = routingKey.match(/([^.]*)\.ob-snap/);
                    const orderBookMatchInc = routingKey.match(/([^.]*)\.ob-inc/);

                    // public
                    if (orderBookMatch) {
                        if (currentMarket && orderBookMatch[1] === currentMarket.id) {
                            emitter(depthData(event));
                        }

                        return;
                    }

                    // public
                    if (orderBookMatchSnap) {
                        if (currentMarket && orderBookMatchSnap[1] === currentMarket.id) {
                            emitter(depthDataSnapshot(event));
                        }

                        return;
                    }

                    // public
                    if (orderBookMatchInc) {
                        if (currentMarket && orderBookMatchInc[1] === currentMarket.id) {
                            const previousSequence = selectOrderBookSequence(store.getState());
                            if (previousSequence === null) {
                                window.console.log('OrderBook increment received before snapshot');

                                return;
                            }
                            if (previousSequence + 1 !== event.sequence) {
                                window.console.log(`Bad sequence detected in incremental orderbook previous: ${previousSequence}, event: ${event.sequence}`);
                                emitter(rangerDisconnectFetch());

                                return;
                            }
                            emitter(depthDataIncrement(event));
                        }

                        return;
                    }

                    // public
                    const klineMatch = String(routingKey).match(/([^.]*)\.kline-(.+)/);
                    if (klineMatch) {
                        emitter(
                            klinePush({
                                marketId: klineMatch[1],
                                kline: event,
                                period: klineMatch[2],
                            }),
                        );

                        return;
                    }

                    // public
                    const tradesMatch = String(routingKey).match(/([^.]*)\.trades/);
                    if (tradesMatch) {
                        emitter(
                            recentTradesPush({
                                trades: event.trades,
                                market: tradesMatch[1],
                            }),
                        );

                        return;
                    }

                    switch (routingKey) {
                        // public
                        case 'global.tickers':
                            emitter(marketsTickersData(formatTicker(event)));

                            return;

                        // public
                        case 'success':
                            switch (event.message) {
                                case 'subscribed':
                                case 'unsubscribed':
                                    emitter(subscriptionsUpdate({ subscriptions: event.streams }));

                                    return;
                                default:
                            }

                            return;

                        // private
                        case 'order':
                            if (isFinexEnabled() && event) {
                                switch (event.state) {
                                    case 'wait':
                                    case 'trigger_wait':
                                    case 'pending':
                                        const orders = selectOpenOrdersList(store.getState());
                                        const updatedOrder = orders.length && orders.find(order => event.uuid && order.uuid === event.uuid);
                                        if (!updatedOrder) {
                                            emitter(alertPush({ message: ['success.order.created'], type: 'success'}));
                                        }
                                        break;
                                    case 'done':
                                        emitter(alertPush({ message: ['success.order.done'], type: 'success'}));
                                        break;
                                    case 'reject':
                                    case 'execution_reject':
                                        emitter(alertPush({ message: ['error.order.rejected'], type: 'error'}));
                                        break;
                                    default:
                                        break;
                                }
                            }

                            emitter(rangerUserOrderUpdate(event));

                            return;

                        // private
                        case 'trade':
                            emitter(pushHistoryEmit(event));

                            return;

                        // private
                        case 'balances':
                            emitter(updateP2PWalletsDataByRanger({ ws: true, balances: event }));
                            emitter(updateWalletsDataByRanger({ ws: true, balances: event }));

                            return;

                        // private
                        case 'deposit_address':
                            emitter(walletsAddressDataWS(event));

                            return;

                        // public
                        case 'p2p.event':
                            const p2pPublicOffersMatch = event && String(event.event).includes('p2p_offer');

                            if (p2pPublicOffersMatch) {
                                emitter(p2pOffersUpdate(event.payload));
                                return;
                            }

                            return;

                        // private
                        case 'p2p':
                            const p2pOrdersMatch = event && String(event.event).includes('p2p_order');

                            if (p2pOrdersMatch) {
                                emitter(p2pOrdersDataWS(event.payload));

                                return;
                            }

                            const p2pOffersMatch = event && String(event.event).includes('p2p_offer');

                            if (p2pOffersMatch) {
                                emitter(p2pUserOffersUpdate(event.payload));

                                return;
                            }

                            return;
                        default:
                    }
                    window.console.log(`Unhandeled websocket channel: ${routingKey}`);
                }
            }
        };

        // unsubscribe function
        return () => {
            emitter(rangerDisconnectData());
        };
    });

    return [channel, ws];
};

function* writter(socket: WebSocket, buffer: { messages: object[] }) {
    while (true) {
        const data = yield take(RANGER_DIRECT_WRITE);
        if (socket.readyState === socket.OPEN) {
            socket.send(JSON.stringify(data.payload));
        } else {
            buffer.messages.push(data.payload);
        }
    }
}

function* reader(channel) {
    while (true) {
        const action = yield take(channel);
        yield put(action);
    }
}

let previousMarket: Market | undefined;

const switchMarket = (subscribeOnInitOnly: boolean) => {
    return function*(action: SetCurrentMarket) {
        if (subscribeOnInitOnly && previousMarket !== undefined) {
            return;
        }
        if (previousMarket && previousMarket.id !== action.payload.id) {
            yield put(rangerUnsubscribeMarket(previousMarket));
        }
        previousMarket = action.payload;
        if (action.payload) {
            yield put(rangerSubscribeMarket(action.payload));
        }
    };
};

function* watchDisconnect(socket: WebSocket, channel: Channel<{}>) {
    yield take(RANGER_DISCONNECT_FETCH);
    socket.close();
}

function* bindSocket(channel: Channel<{}>, socket: WebSocket, buffer: RangerBuffer) {
    return yield all([call(reader, channel), call(writter, socket, buffer), call(watchDisconnect, socket, channel)]);
}

function* dispatchCurrentMarketOrderUpdates(action: UserOrderUpdate) {
    let market;

    try {
        market = yield select(selectCurrentMarket);
    } catch (error) {
        market = undefined;
    }

    if (market && action.payload.market === market.id) {
        yield put(userOpenOrdersUpdate(action.payload));
    }
}

function* dispatchOrderHistoryUpdates(action: UserOrderUpdate) {
    yield put(userOrdersHistoryRangerData(action.payload));
}

function* getSubscriptions() {
    try {
        return yield select(selectSubscriptions);
    } catch (error) {
        return [];
    }
}

export function* rangerSagas() {
    let initialized = false;
    let connectFetchPayload: RangerConnectFetch['payload'] | undefined;
    const buffer: RangerBuffer = { messages: [] };
    let pipes;
    yield takeEvery(MARKETS_SET_CURRENT_MARKET, switchMarket(false));
    yield takeEvery(MARKETS_SET_CURRENT_MARKET_IFUNSET, switchMarket(true));
    yield takeEvery(RANGER_USER_ORDER_UPDATE, dispatchCurrentMarketOrderUpdates);
    yield takeEvery(RANGER_USER_ORDER_UPDATE, dispatchOrderHistoryUpdates);

    while (true) {
        const { connectFetch, disconnectData } = yield race({
            connectFetch: take(RANGER_CONNECT_FETCH),
            disconnectData: take(RANGER_DISCONNECT_DATA),
        });
        let market: Market | undefined;

        if (connectFetch) {
            if (initialized) {
                yield put(rangerDisconnectFetch());
                yield take(RANGER_DISCONNECT_DATA);
            }
            connectFetchPayload = connectFetch.payload;
        }

        if (disconnectData) {
            yield delay(1000);
        }

        try {
            market = yield select(selectCurrentMarket);
        } catch (error) {
            market = undefined;
        }

        if (connectFetchPayload) {
            const prevSubs = yield getSubscriptions();
            const [channel, socket] = yield call(initRanger, connectFetchPayload, market, prevSubs, buffer);
            initialized = true;
            if (pipes) {
                yield cancel(pipes);
            }
            pipes = yield fork(bindSocket, channel, socket, buffer);
        }
    }
}
