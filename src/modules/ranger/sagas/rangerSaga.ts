import { Channel, eventChannel } from 'redux-saga';
// tslint:disable-next-line no-submodule-imports
import { all, call, fork, put, race, select, take, takeEvery } from 'redux-saga/effects';
import { rangerUrl } from '../../../api';
import { klinePush } from '../../kline';
import { Market, marketsTickersData, selectCurrentMarket, SetCurrentMarket, Ticker, TickerEvent } from '../../markets';
import { SET_CURRENT_MARKET } from '../../markets/constants';
import { depthData } from '../../orderBook';
import { userOrdersUpdate } from '../../orders';
import { recentTradesPush } from '../../recentTrades';
import {
    marketStreams,
    RangerConnectFetch,
    rangerDisconnectData,
    rangerDisconnectFetch,
    rangerSubscribeMarket,
    rangerUnsubscribeMarket,
} from '../actions';
import {
    RANGER_CONNECT_DATA,
    RANGER_CONNECT_FETCH,
    RANGER_DIRECT_WRITE,
    RANGER_DISCONNECT_DATA,
    RANGER_DISCONNECT_FETCH,
} from '../constants';

const generateSocketURI = (baseUrl: string, s: string[]) => `${baseUrl}/?stream=${s.sort().join('&stream=')}`;

export const formatTicker = (events: { [pair: string]: TickerEvent }): { [pair: string]: Ticker } => {
    const tickers = {};
    for (const market in events) {
        if (events.hasOwnProperty(market)) {
            const event: TickerEvent = events[market];
            const { open, low, high, last, volume, sell, buy, avg_price, price_change_percent } = event;
            tickers[market] = { open, low, high, last, sell, buy, vol: volume, avg_price, price_change_percent };
        }
    }
    return tickers;
};

const streamsBuilder = (withAuth: boolean, period: string, market: Market | undefined) => {
    let streams: string[] = [
        'global.tickers',
        'order',
        'trade',
    ];
    if (market) {
        streams = streams.concat(marketStreams(market).channels);
    }
    return streams;
};

// tslint:disable no-console
const initRanger = ({ withAuth }: RangerConnectFetch['payload'], market: Market | undefined): [Channel<{}>, WebSocket] => {
    const baseUrl = `${rangerUrl()}/${withAuth ? 'private' : 'public'}`;
    const streams = streamsBuilder(withAuth, '1m', market);

    const ws = new WebSocket(generateSocketURI(baseUrl, streams));
    const channel = eventChannel(emitter => {
        ws.onopen = () => {
            emitter({ type: RANGER_CONNECT_DATA });
        };
        ws.onerror = error => {
            console.log(`WebSocket error ${error}`);
            console.dir(error);
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
                console.error(`Error parsing : ${e.data}`);
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
                            return;

                        // private
                        case 'order':
                            emitter(userOrdersUpdate(event));
                            return;

                        // private
                        case 'trade':
                            // emitter(pushHistoryEmit(event));
                            return;

                        default:
                    }
                    console.log(`Unhandeled websocket channel: ${routingKey}`);

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
                console.log(`Ranger state is ${wsStateToString(socket)}`);
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

export function* rangerSagas() {
    let channel: Channel<{}>;
    let socket: WebSocket;
    let initialized = false;
    let connectFetchPayload: RangerConnectFetch['payload'] | undefined;

    yield takeEvery(SET_CURRENT_MARKET, switchMarket());

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
            [channel, socket] = yield call(initRanger, connectFetchPayload, market);
            initialized = true;
            yield fork(bindSocket, channel, socket);
        }
    }
}
