const WebSocket = require('ws');
const Helpers = require('./helpers')

function isSubscribed(streams, routingKey) {
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

/*
  Example: ["btcusd.update",{"asks":[["1000.0","0.1"]],"bids":[]}]
*/
const orderBookUpdateMock = (ws, marketId) => () => {
  sendEvent(ws, `${marketId}.update`, Helpers.getDepth());
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
  let price = 0.0001;
  let volume = 0.0001;
  return function () {
    const orderId = orderIndex++;
    const tradeId = tradeIndex++;
    kind = kind == "bid" ? "ask" : "bid";
    const takerType = Math.random() < 0.5 ? "buy" : "sell";
    price += 0.0001;
    volume += 0.00005;
    let bidId = kind == "bid" ? orderId : orderId - 10;
    let askId = kind == "ask" ? orderId : orderId - 10;
    let at = parseInt(Date.now() / 1000);
    if (ws.authenticated) {
      sendEvent(ws, "order", { "id": orderId, "at": at, "market": marketId, "kind": kind, "price": price, "state": "wait", "remaining_volume": volume, "origin_volume": volume });

      setTimeout(() => {
        const remainingVolume = volume / (Math.random() + 2);
        sendEvent(ws, "order", { "id": orderId, "at": at, "market": marketId, "kind": kind, "price": price, "state": "wait", "remaining_volume": String(remainingVolume), "origin_volume": volume });

        setTimeout(() => {
          sendEvent(ws, "order", { "id": orderId, "at": at, "market": marketId, "kind": kind, "price": price, "state": "done", "remaining_volume": "0.0", "origin_volume": volume });
          sendEvent(ws, "trade", { "id": tradeId, "kind": kind, "at": at, "price": price, "volume": volume, "ask_id": askId, "bid_id": bidId, "market": marketId });
        }, 1000);
      }, 1000);
    }
    sendEvent(ws, `${marketId}.trades`, { "trades": [{ "tid": tradeId, "taker_type": takerType, "date": at, "price": price, "amount": volume }] });
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
    const wss = new WebSocket.Server({ port: port });
    const url = `ws://0.0.0.0:${port}`.green
    console.log(`Ranger: listening on ${url}`);
    const ranger = this;
    wss.on('connection', function connection(ws, request) {
      ranger.initConnection(ws, request);
      ws.on('message', (message) => ranger.onMessage(ws, message));
      ws.on('close', () => ranger.closeConnection(ws));
    });

  }
  initConnection(ws, request) {
    ws.authenticated = true;
    ws.timers = [];
    ws.streams = [];

    console.log(`Ranger: connection accepted, url: ${request.url}`);
    this.subscribe(ws, Helpers.getStreamsFromUrl(request.url));
    ws.timers.push(setInterval(tickersMock(ws, this.markets), 3000));
    this.markets.forEach((name) => {
      let { baseUnit, quoteUnit, marketId } = Helpers.getMarketInfos(name);
      ws.timers.push(setInterval(orderBookUpdateMock(ws, marketId), 3000));
      ws.timers.push(setInterval(matchedTradesMock(ws, marketId), 1000))
      ws.timers.push(setInterval(klinesMock(ws, marketId), 2500))
    });
  }
  closeConnection(ws) {
    console.log('Ranger: connection closed');
    if (ws.timers) {
      ws.timers.forEach((t) => {
        clearInterval(t);
      })
    }
  }
  onMessage(ws, message) {
    if (message.length === 0)
      return;
    try {
      console.log('Ranger: received: %s', message);
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
    ws.send(JSON.stringify({ "success": { "message": "subscribed", "streams": ws.streams } }))
  }
  unsubscribe(ws, streams) {
    ws.streams = ws.streams.filter((value) => streams.indexOf(value) === -1);
    ws.send(JSON.stringify({ "success": { "message": "unsubscribed", "streams": ws.streams } }))
  }

}
module.exports = RangerMock;
