const WebSocket = require('ws');
const Helpers = require('./helpers')

const isSubscribed = (streams, routingKey) => {
    for (const i in streams) {
        const stream = streams[i];
        if (routingKey.startsWith(stream) || routingKey.endsWith(stream)) {
            return true;
        }
    }
    return false;
}

const sendEvent = (ws, routingKey, event) => {
    try {
        if (isSubscribed(ws.streams, routingKey)) {
            const payload = {};
            payload[routingKey] = event;
            ws.send(JSON.stringify(payload));
        }
    } catch (error) {
        console.log(`failed to send ranger message: ${error}`);
    }
}

const tickersMock = (ws, markets) => () => {
    sendEvent(ws, "global.tickers", Helpers.getTickers(markets));
};

const balancesMock = (ws) => () => {
    sendEvent(ws, "balances", Helpers.getBalances());
};

const p2pOrdersMock = (ws, state) => () => {
    sendEvent(ws, `p2p`, Helpers.getP2POrder(state));
};

const p2pOffersMock = (ws, state) => () => {
    sendEvent(ws, `p2p`, Helpers.getP2POffer(state));
};

const p2pPublicOffersMock = (ws, state) => () => {
    sendEvent(ws, `p2p.event`, Helpers.getP2POffer(state));
};

/*
    Example: ["btcusd.update",{"asks":[["1000.0","0.1"]],"bids":[]}]
*/
const orderBookUpdateMock = (ws, marketId) => () => {
    sendEvent(ws, `${marketId}.update`, Helpers.getDepth(0));
};

// Inremental orderbook support
const orderBookSnapshotMock = (ws, marketId) => () => {
    ws.sequences[marketId] = 1;
    console.log(`orderBookSnapshotMock called: ${marketId}`);
    try {
        if (isSubscribed(ws.streams, `${marketId}.ob-inc`)) {
            console.log(`orderBookSnapshotMock sending: ${marketId}`);
            const payload = {};
            payload[`${marketId}.ob-snap`] = Helpers.getDepth(ws.sequences[marketId]);
            ws.send(JSON.stringify(payload));
        }
    } catch (error) {
        console.log(`failed to send ranger message: ${error}`);
    }
};

const orderBookIncrementMock = (ws, marketId) => () => {
    var event = Helpers.getDepthIncrement();
    event.sequence = ++ws.sequences[marketId];
    sendEvent(ws, `${marketId}.ob-inc`, event);
};

/*
    Success order scenario:
        * Private messages:
            ["order",{"id":758,"at":1546605232,"market":"macarstc","kind":"bid","price":"1.17","state":"wait","remaining_volume":"0.1","origin_volume":"0.1"}]
            ["order",{"id":758,"at":1546605232,"market":"macarstc","kind":"bid","price":"1.17","state":"done","remaining_volume":"0.0","origin_volume":"0.1"}]
            ["trade",{"id":312,"kind":"bid","at":1546605232,"price":"1.17","remaining_volume":"0.1","ask_id":651,"bid_id":758,"market":"macarstc"}]

        * Public messages:
            ["macarstc.trades",{"trades":[{"tid":312,"type":"buy","date":1546605232,"price":"1.17","amount":"0.1"}]}]
*/

// Those functions are the same used in k-line mocked API
const minDay = 6;
const maxDay = 10;
const fakePeriod = 86400;

const timeToPrice = (time) => {
    return minDay + (maxDay - minDay) / 2 * (1 + Math.cos((time / fakePeriod) * 2 * Math.PI));
};

const timeToVolume = (time, periodInSeconds) => {
    return maxDay * 10 / 2 * (1 + Math.cos((time / fakePeriod) * 2 * Math.PI));
};

const kLine = (time, period) => {
    const periodInSeconds = parseInt(period * 60);
    const roundedTime = parseInt(time / periodInSeconds) * periodInSeconds;
    const open = timeToPrice(time);
    const close = timeToPrice(time + periodInSeconds);
    const delta = (maxDay - minDay) / fakePeriod * periodInSeconds * 2;
    const high = Math.max(open, close) + delta;
    const low = Math.min(open, close) - delta;
    const volume = timeToVolume(time, periodInSeconds);

    return [roundedTime, open, high, low, close, volume].map(String);
}

let tradeIndex = 100000;
let orderIndex = 100;

const matchedTradesMock = (ws, marketId) => {
    let kind = "bid";
    let price = 0.1;
    let volume = 1000;

    return function () {
        const shouldPushOrder = Math.random() < 0.1;
        const orderId = orderIndex++;
        const tradeId = tradeIndex++;
        kind = kind == "bid" ? "ask" : "bid";
        const takerType = Math.random() < 0.5 ? "buy" : "sell";
        const orderType = Math.random() < 0.5 ? "limit" : "market";
        price += price > 0.01 ? Math.random() < 0.5 ? +0.01 : -0.01 : 0.01;
        volume += 50;
        let bidId = kind == "bid" ? orderId : orderId - 10;
        let askId = kind == "ask" ? orderId : orderId - 10;
        let at = parseInt(Date.now() / 1000);
        let remainingVolume = volume;
        const executedVolume = volume - remainingVolume;

        const order = {
            "uuid": orderId + 1000000,
            "id": orderId,
            "at": at + 1,
            "market": marketId,
            "kind": kind,
            "price": price,
            "avg_price": price,
            "state": "wait",
            "remaining_volume": volume,
            "origin_volume": volume,
            "executed_volume": executedVolume,
            "side": takerType, 
            "created_at": at,
            "updated_at": at + 1,
            "order_type": orderType,
            "trades_count": 0
        };

        const privateTrade = {
            "uuid": orderId + 1000000,
            "id": tradeId,
            "price": price,
            "total": (volume * price).toFixed(4),
            "amount": volume,
            "market": marketId,
            "at": at + 1,
            "created_at": at,
            "taker_type": takerType
        };

        const publicTrade = {
            "tid": tradeId,
            "date": at,
            "taker_type": takerType,
            "price": price,
            "amount": volume
        };

        if (ws.authenticated && shouldPushOrder) {
            sendEvent(ws, "order", order);

            setTimeout(() => {
                remainingVolume = volume / (Math.random() + 2);
                sendEvent(ws, "order", { ...order, "remaining_volume": String(remainingVolume) });

                setTimeout(() => {
                    sendEvent(ws, "order", { ...order, "state": "done", "remaining_volume": "0.0" });
                    sendEvent(ws, "trade", privateTrade);
                }, 10000);
            }, 5000);
        }
        sendEvent(ws, `${marketId}.trades`, { "trades": [publicTrade] });
    }
};

const klinesMock = (ws, marketId) => () => {
    let at = parseInt(Date.now() / 1000);

    sendEvent(ws, `${marketId}.kline-1m`, kLine(at, 1));
    sendEvent(ws, `${marketId}.kline-5m`, kLine(at, 5));
    sendEvent(ws, `${marketId}.kline-15m`, kLine(at, 15));
    sendEvent(ws, `${marketId}.kline-30m`, kLine(at, 30));
    sendEvent(ws, `${marketId}.kline-1h`, kLine(at, 60));
    sendEvent(ws, `${marketId}.kline-2h`, kLine(at, 120));
    sendEvent(ws, `${marketId}.kline-4h`, kLine(at, 240));
    sendEvent(ws, `${marketId}.kline-6h`, kLine(at, 360));
    sendEvent(ws, `${marketId}.kline-12h`, kLine(at, 720));
    sendEvent(ws, `${marketId}.kline-1d`, kLine(at, 1440));
    sendEvent(ws, `${marketId}.kline-3d`, kLine(at, 4320));
    sendEvent(ws, `${marketId}.kline-1w`, kLine(at, 10080));
};
class RangerMock {
    constructor(port, markets) {
        this.markets = markets;
        this.port = port;
        this.start();
    }
    start() {
        this.wss = new WebSocket.Server({ port: this.port });
        const url = `ws://0.0.0.0:${this.port}`.green
        console.log(`Ranger: listening on ${url}`);
        const ranger = this;
        this.wss.on('connection', function connection(ws, request) {
            ranger.initConnection(ws, request);
            ws.on('message', (message) => ranger.onMessage(ws, message));
            ws.on('close', () => ranger.closeConnection(ws));
        });
    }
    close() {
        this.wss.close();
    }
    initConnection(ws, request) {
        ws.authenticated = true;
        ws.timers = [];
        ws.streams = [];
        ws.sequences = {};

        console.log(`Ranger: connection accepted, url: ${request.url}`);
        this.subscribe(ws, Helpers.getStreamsFromUrl(request.url));
        ws.timers.push(setInterval(tickersMock(ws, this.markets), 3000));
        ws.timers.push(setInterval(balancesMock(ws), 3000));
        ws.timers.push(setInterval(p2pOrdersMock(ws, 'approved'), 3000));
        ws.timers.push(setInterval(p2pOrdersMock(ws, 'cancelled'), 30000));
        ws.timers.push(setInterval(p2pOffersMock(ws, 'cancelled'), 30000));
        ws.timers.push(setInterval(p2pOffersMock(ws, 'created'), 30000));
        ws.timers.push(setInterval(p2pOffersMock(ws, 'updated'), 30000)); 
        ws.timers.push(setInterval(p2pPublicOffersMock(ws, 'cancelled'), 30000));
        ws.timers.push(setInterval(p2pPublicOffersMock(ws, 'created'), 30000));
        ws.timers.push(setInterval(p2pPublicOffersMock(ws, 'updated'), 30000));    

        this.markets.forEach((name) => {
            let { marketId } = Helpers.getMarketInfos(name);
            ws.timers.push(setInterval(orderBookIncrementMock(ws, marketId), 200));
            ws.timers.push(setInterval(orderBookUpdateMock(ws, marketId), 2000));
            ws.timers.push(setInterval(matchedTradesMock(ws, marketId), 10000));
            ws.timers.push(setInterval(klinesMock(ws, marketId), 2500));
        });
        ws.timers.push(setTimeout(() => {sendEvent(ws, "deposit_address", { address: "a4E49HU6CTHyYMmsYt3F1ar1q5W89t3hfQ?dt=1", currencies:["xrp"], type:"create" })}, 15000));
    }
    closeConnection() {
        console.log('Ranger: connection closed');
    }
    onMessage(ws, message) {
        if (message.length === 0)
            return;
        try {
            console.log('Ranger: received message: %s', message);
            var payload = JSON.parse(message);

            if ("jwt" in payload) {
                if (payload["jwt"] === "Bearer null") {
                    ws.send(JSON.stringify({ "error": { "message": "Authentication failed." } }));
                } else {
                    ws.send(JSON.stringify({ "success": { "message": "Authenticated." } }));
                    ws.authenticated = true;
                }
            }
            switch (payload["event"]) {
                case "subscribe":
                    this.subscribe(ws, payload["streams"]);
                    break;

                case "unsubscribe":
                    this.unsubscribe(ws, payload["streams"]);
                    break;
            }
        } catch (err) {
            console.log(`Ranger: Something went wrong: ${err} (message: ${message})`);
        }

    }
    subscribe(ws, streams) {
        ws.streams = Helpers.unique(ws.streams.concat(streams));
        console.log(`subcribed to : ${ws.streams}`)
        this.markets.forEach((name) => {
            let { marketId } = Helpers.getMarketInfos(name);
            orderBookSnapshotMock(ws, marketId)();
        });
        ws.send(JSON.stringify({ "success": { "message": "subscribed", "streams": ws.streams } }))
    }
    unsubscribe(ws, streams) {
        ws.streams = ws.streams.filter((value) => streams.indexOf(value) === -1);
        ws.send(JSON.stringify({ "success": { "message": "unsubscribed", "streams": ws.streams } }))
    }
}

module.exports = RangerMock;
