import { Channel, delay, eventChannel } from 'redux-saga';
// tslint:disable-next-line no-submodule-imports
import { all, call, cancel, fork, put, race, select, take, takeEvery } from 'redux-saga/effects';
import { rangerUrl } from '../../../../api';
import { store } from '../../../../store';
import { pushHistoryEmit } from '../../../user/history';
import { userOpenOrdersUpdate } from '../../../user/openOrders';
import { userOrdersHistoryRangerData} from '../../../user/ordersHistory';
import { klinePush } from '../../kline';
import { Market, marketsTickersData, selectCurrentMarket, SetCurrentMarket } from '../../markets';
import { MARKETS_SET_CURRENT_MARKET } from '../../markets/constants';
import { depthData } from '../../orderBook';
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
    { withAuth }: RangerConnectFetch['payload'],
    market: Market | undefined,
    prevSubs: string[],
    buffer: RangerBuffer,
): [Channel<{}>, WebSocket] => {
    const baseUrl = `${rangerUrl()}/${withAuth ? 'private' : 'public'}`;
    const streams = streamsBuilder(withAuth, prevSubs, market);

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
            // tslint:disable-next-line no-any
            let payload: { [pair: string]: any } = {};

            try {
                payload = JSON.parse(data as string);
            } catch (e) {
                window.console.error(`Error parsing : ${e.data}`);
            }

            for (const routingKey in payload) {
                if (payload.hasOwnProperty(routingKey)) {
                    const event = payload[routingKey];

                    const currentMarket = selectCurrentMarket(store.getState());
                    const orderBookMatch = routingKey.match(/([^.]*)\.update/);

                    // public
                    if (orderBookMatch) {
                        if (currentMarket && orderBookMatch[1] === currentMarket.id) {
                            emitter(depthData(event));
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
                            emitter(rangerUserOrderUpdate(event));
                            return;

                        // private
                        case 'trade':
                            emitter(pushHistoryEmit(event));
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

const switchMarket = () => {
    let previousMarket: Market;
    return function*(action: SetCurrentMarket) {
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
    const buffer: RangerBuffer = { messages: new Array() };
    let pipes;
    yield takeEvery(MARKETS_SET_CURRENT_MARKET, switchMarket());
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
            yield call(delay, 1000);
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
