import { eventChannel } from 'redux-saga';
// tslint:disable-next-line no-submodule-imports
import { call, put, race, take, takeEvery } from 'redux-saga/effects';
import { rangerUrl } from '../../../api/config';
import { tradePush } from '../../history/trades/actions';
import { marketsTickersData, SetCurrentMarket, Ticker, TickerEvent } from '../../markets';
import { SET_CURRENT_MARKET } from '../../markets/constants';
import { depthData } from '../../orderBook';
import { userOrdersUpdate } from '../../orders';
import { recentTradesPush } from '../../recentTrades';
import { rangerSubscribeMarket, rangerUnsubscribeMarket } from '../actions';
import { RANGER_CONNECT_DATA, RANGER_DIRECT_WRITE, RANGER_DISCONNECT } from '../constants';

const streams: string[] = [
    'global.tickers',
    'order',
    'trade',
];

const generateSocketURI = (s: string[]) => `${rangerUrl()}/?stream=${s.sort().join('&stream=')}`;

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

// tslint:disable no-console
const initRanger = () => {
    const ws = new WebSocket(generateSocketURI(streams));
    const channel = eventChannel(emitter => {
        ws.onopen = () => {
            emitter({ type: RANGER_CONNECT_DATA });
        };
        ws.onerror = error => {
            console.log(`WebSocket error ${error}`);
            console.dir(error);
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
                    const m = String(routingKey).match(/([^.]*)\.trades/);
                    if (m) {
                        emitter(recentTradesPush({
                            trades: event.trades,
                            market: m[1],
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
                            emitter(tradePush(event));
                            return;

                        default:
                    }
                    console.log(`Unhandeled websocket channel: ${routingKey}`);

                }
            }
        };
        // unsubscribe function
        return () => {
            console.log('Socket off');
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

let previousMarketId: string;

function* switchMarket(action: SetCurrentMarket) {
    if (previousMarketId && previousMarketId !== action.payload.id) {
        yield put(rangerUnsubscribeMarket(previousMarketId));
    }
    previousMarketId = action.payload.id;
    yield put(rangerSubscribeMarket(action.payload.id));
}

export function* rangerSagas() {
    yield takeEvery(SET_CURRENT_MARKET, switchMarket);

    const [channel, ws] = yield call(initRanger);
    const { cancel } = yield race({
        task: [
            call(reader, channel),
            call(writter, ws),
        ],
        cancel: take(RANGER_DISCONNECT),
    });

    if (cancel) {
        ws.close();
    }
}
