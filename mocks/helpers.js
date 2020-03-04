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
            let { baseUnit, quoteUnit, marketId } = Helpers.getMarketInfos(name);
            const change = (10 + Math.random() * 10) * (Math.random() > 0.5 ? 1 : -1);
            const coeffChange = 1 + parseFloat(change / 1000);
            const open = 0.134 * coeffChange;
            const last = 0.134 / coeffChange;
            const price_change_percent = (last - open) / last * 100;
            const signPrefix = price_change_percent >= 0 ? '+' : '-';

            tickers[marketId] = {
                "name": name,
                "base_unit": baseUnit,
                "quote_unit": quoteUnit,
                "low": `${0.001 * coeffChange}`,
                "high": `${0.145 * coeffChange}`,
                "last": `${last}`,
                "open": open,
                "volume": `${150 * coeffChange}`,
                "sell": "0.0",
                "buy": "0.0",
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
        "bch":  [getBalanceValue("10.12", 8), getLockedValue("0.001", 8)],
        "btc": [getBalanceValue("0.21026373", 8), getLockedValue("0.0001", 8)],
        "dash": [getBalanceValue("5", 6), getLockedValue("0.0005", 6)],
        "eth": [getBalanceValue("5", 6), getLockedValue("0.0002", 6)],
        "usd":  [getBalanceValue("1000", 2), getLockedValue("100", 2)]
      }
    },
    getDepth: () => {
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
          ]
      }
    },
    getDepthIncrement: () => {
      const delta = 2 * (1 + Math.cos(2 * Math.PI * Date.now() / 1000 / 3600))
      const fV = (volume) => String(parseFloat(volume) + delta * 10);

      if (Math.random() < 0.5) {
        return {
          "asks": ["15.0", fV("1.5")],
        }
      }
      return {
        "bids": ["10.95", fV("1.5")],
      }
    },
    getStreamsFromUrl: (url) => url.replace("/", "").split(/[&?]stream=/).filter(stream => stream.length > 0),
    unique: (list) => list.filter((value, index, self) => self.indexOf(value) === index)
}

module.exports = Helpers;
