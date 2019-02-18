import { Channel, eventChannel } from 'redux-saga';
// tslint:disable-next-line no-submodule-imports
import { all, call, fork, put, race, select, take, takeEvery } from 'redux-saga/effects';
import { rangerUrl } from '../../../../api';
import { userOpenOrdersUpdate } from '../../../user/openOrders';
import { klinePush } from '../../kline';
import { Market, marketsTickersData, selectCurrentMarket, SetCurrentMarket } from '../../markets';
import { SET_CURRENT_MARKET } from '../../markets/constants';
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
import {
    selectSubscriptions,
} from '../selectors';

const initRanger = ({ withAuth }: RangerConnectFetch['payload'], market: Market | undefined, prevSubs: string[]): [Channel<{}>, WebSocket] => {
    const baseUrl = `${rangerUrl()}/${withAuth ? 'private' : 'public'}`;
    const streams = streamsBuilder(withAuth, prevSubs, market);

    const ws = new WebSocket(generateSocketURI(baseUrl, streams));
    const channel = eventChannel(emitter => {
        ws.onopen = () => {
            emitter({ type: RANGER_CONNECT_DATA });
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

                    // public
                    if (/([^.]*)\.update/.test(routingKey)) {
                        emitter(depthData(event));
                        return;
                    }

                    // public
                    const klineMatch = String(routingKey).match(/([^.]*)\.kline-(.+)/);
                    if (klineMatch) {
                        emitter(klinePush({
                            marketId: klineMatch[1],
                            kline: event,
                            period: klineMatch[2],
                        }));
                        return;
                    }

                    // public
                    const tradesMatch = String(routingKey).match(/([^.]*)\.trades/);
                    if (tradesMatch) {
                        emitter(recentTradesPush({
                            trades: event.trades,
                            market: tradesMatch[1],
                        }));
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
                                    emitter(subscriptionsUpdate({subscriptions: event.streams}));
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
                            // emitter(pushHistoryEmit(event));
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

const wsStateToString = (socket: WebSocket) => {
    switch (socket.readyState) {
        case socket.OPEN: return 'OPEN';
        case socket.CLOSED: return 'CLOSED';
        case socket.CLOSING: return 'CLOSING';
        case socket.CONNECTING: return 'CONNECTING';
        default: return `UNKNOWN ${socket.readyState}`;
    }
};

function* writter(socket: WebSocket) {
    while (true) {
        const data = yield take(RANGER_DIRECT_WRITE);
        switch (socket.readyState) {
            case socket.OPEN:
                socket.send(JSON.stringify(data.payload));
                break;
            default:
                window.console.log(`Ranger state is ${wsStateToString(socket)}`);
                break;
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
        yield put(rangerSubscribeMarket(action.payload));
    };
};

function* watchDisconnect(socket: WebSocket, channel: Channel<{}>) {
    yield take(RANGER_DISCONNECT_FETCH);
    socket.close();
}

function* bindSocket(channel: Channel<{}>, socket: WebSocket) {
    yield all([
        call(reader, channel),
        call(writter, socket),
        call(watchDisconnect, socket, channel),
    ]);
}

const delay = async (ms: number) => {
    return new Promise(resolve => setTimeout(() => resolve(true), ms));
};

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

function* getSubscriptions() {
    try {
        return yield select(selectSubscriptions);
    } catch (error) {
        return [];
    }
}

export function* rangerSagas() {
    let channel: Channel<{}>;
    let socket: WebSocket;
    let initialized = false;
    let connectFetchPayload: RangerConnectFetch['payload'] | undefined;

    yield takeEvery(SET_CURRENT_MARKET, switchMarket());
    yield takeEvery(RANGER_USER_ORDER_UPDATE, dispatchCurrentMarketOrderUpdates);

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
            [channel, socket] = yield call(initRanger, connectFetchPayload, market, prevSubs);
            initialized = true;
            yield fork(bindSocket, channel, socket);
        }
    }
}
