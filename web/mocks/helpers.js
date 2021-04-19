const getRandomArbitrary = (min, max, precision) => {
    const randomValue = Math.random() * (max - min) + min;

    return precision ? randomValue.toFixed(precision) : randomValue;
}

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
}


const Helpers = {
    getMarketInfos: (marketName) => {
        let pairs = marketName.split("/");
        let baseUnit = pairs[0].toLowerCase();
        let quoteUnit = pairs[1].toLowerCase();
        let marketId = `${baseUnit}${quoteUnit}`;

        return {
            baseUnit,
            quoteUnit,
            marketId,
        }
    },
    getTickers: (markets) => {
        let tickers = {}
        markets.forEach(name => {
            let { marketId } = Helpers.getMarketInfos(name);
            const change = (10 + Math.random() * 10) * (Math.random() > 0.5 ? 1 : -1);
            const coeffChange = 1 + parseFloat(change / 1000);
            const open = 0.134 * coeffChange;
            const last = 0.134 / coeffChange;
            const price_change_percent = (last - open) / last * 100;
            const signPrefix = price_change_percent >= 0 ? '+' : '-';

            tickers[marketId] = {
                "amount": `${15 * coeffChange}`,
                "low": `${0.001 * coeffChange}`,
                "high": `${0.145 * coeffChange}`,
                "last": `${last}`,
                "open": open,
                "volume": `${3500 * coeffChange}`,
                "avg_price": "0.0",
                "price_change_percent": `${signPrefix}${Math.abs(price_change_percent.toFixed(2))}%`,
                "at": Date.now() / 1000,
            }
        });

        return tickers;
    },
    getBalances: () => {
        const getBalanceValue = (value, precision) => ((Math.random() > 0.5 ? 1 : -1) * Math.random() / 10 + +value).toFixed(precision);
        const getLockedValue = (value, precision) => (Math.random() / 10 + +value).toFixed(precision);

        return {
            "bch":  [getBalanceValue("10.12", 8), getLockedValue("0.001", 8), 'spot'],
            "btc": [getBalanceValue("0.21026373", 8), getLockedValue("0.0001", 8), 'spot'],
            "dash": [getBalanceValue("5", 6), getLockedValue("0.0005", 6), 'spot'],
            "eth": [getBalanceValue("5", 6), getLockedValue("0.0002", 6), 'spot'],
            "usd":  [getBalanceValue("1000", 2), getLockedValue("100", 2), 'p2p']
        }
    },
    getDepth: (sequence) => {
        const delta = 2 * (1 + Math.cos(2 * Math.PI * Date.now() / 1000 / 3600))
        const fV = (volume) => String(parseFloat(volume) + delta * 10);

        return {
            "asks": [
                ["15.0", fV("1.5")],
                ["20.0", fV("80")],
                ["20.5", fV("10.0")],
                ["30.0", fV("1.0")]
            ],
            "bids": [
                ["10.95", fV("1.5")],
                ["10.90", fV("45")],
                ["10.85", fV("35")],
                ["10.70", fV("10")],
            ],
            "sequence": sequence,
        }
    },
    getDepthIncrement: (sequence) => {
        const delta = getRandomArbitrary(1, 100, 2) * (1 + Math.cos(2 * Math.PI * Date.now() / 1000 / 3600))
        const fV = (volume) => String(parseFloat(volume) + delta);
        const countOfAsks = getRandomInt(1, 5);
        const countOfBids = getRandomInt(1, 5);
        const sideProbability = Math.random();
        const asks = [];
        const bids = [];
        
        for (var i = 0; i < countOfAsks; i++) {
            asks.push([getRandomArbitrary(15, 20, 1), fV("1.5")]);
        }
    
        for (var i = 0; i < countOfBids; i++) {
            bids.push([getRandomArbitrary(10, 12, 2), fV("1.5")]);
        }

        if (sideProbability < 0.25) {
            return {
                "asks": asks,
                "sequence": sequence,
            }
        }

        if (sideProbability < 0.5) {
            return {
                "bids": bids,
                "sequence": sequence,
            }
        }

        return {
            "bids": asks,
            "asks": bids,
            "sequence": sequence,
        }
    },
    getP2POrder: (state) => {
        return {
            "event": `p2p_order.${state}`,
            "payload": {
                "id":82030,
                "user_uid":"U487205863",
                "base":"usdt",
                "quote":"usd",
                "side":"sell",
                "price":"1",
                "origin_amount":"6",
                "available_amount":"6",
                "min_order_amount":"10",
                "max_order_amount":"100",
                "time_limit":10,
                "state": state,
                "payment_methods":null,
                "offer": {
                    "id": 8,
                    "uid": "IDD9046D42A4",
                    "base": "ngnt",
                    "quote": "ngn",
                    "side": "buy",
                    "price": "123",
                    "origin_amount": "12",
                    "available_amount": "12",
                    "min_order_amount": "1",
                    "max_order_amount": "2",
                    "time_limit": 900000,
                    "state": "wait",
                    "description": "asd",
                    "reply": "",
                    "payment_methods": [
                        {
                            "id": 24,
                            "user_uid": "IDD9046D42A4",
                            "payment_method_id": 6,
                            "data": {
                                "card_number": "1312123123123123"
                            },
                            "created_at": "2021-04-16T14:12:46.547Z",
                            "updated_at": "2021-04-16T14:12:46.547Z",
                            "payment_method": {
                                "id": 6,
                                "type": "Bank Transfer",
                                "name": "Mono transfer",
                                "options": {
                                    "card_number": {
                                        "name": "Card Number",
                                        "type": "short_answer",
                                        "required": true,
                                        "description": "Your card number"
                                    }
                                },
                                "enabled": true,
                                "created_at": "2021-04-16T10:49:57.13Z",
                                "updated_at": "2021-04-16T10:49:57.13Z"
                            }
                        },
                         {
                            "id": 25,
                            "user_uid": "IDD9046D42A4",
                            "payment_method_id": 7,
                            "data": {
                                "card_number": "1312123123123123",
                                "account_name": "Boss"
                            },
                            "created_at": "2021-04-16T14:12:46.547Z",
                            "updated_at": "2021-04-16T14:12:46.547Z",
                            "payment_method": {
                                "id": 6,
                                "type": "Bank Transfer",
                                "name": "PrivatBank",
                                "options": {
                                    "card_number": {
                                        "name": "Card Number",
                                        "type": "short_answer",
                                        "required": true,
                                        "description": "Your card number"
                                    }
                                },
                                "enabled": true,
                                "created_at": "2021-04-16T10:49:57.13Z",
                                "updated_at": "2021-04-16T10:49:57.13Z"
                            }
                        }
                    ],
                    "user": {
                        "user_uid": "IDD9046D42A4",
                        "user_user": "email",
                        "user_nickname": "kek",
                        "offers_count": 1
                    },
                    "created_at": "2021-04-16T14:42:10.167Z",
                    "updated_at": "2021-04-16T14:42:10.167Z"
                }
            }
        }
    },
    getStreamsFromUrl: (url) => url.replace("/", "").split(/[&?]stream=/).filter(stream => stream.length > 0),
    unique: (list) => list.filter((value, index, self) => self.indexOf(value) === index)
}

module.exports = Helpers;
