import { WalletItemProps } from '../components/WalletItem';
import { Market, Ticker } from '../modules/public/markets';

export interface MarketTicker {
    [key: string]: Ticker;
}

const findMarket = (askUnit: string, bidUnit: string, markets: Market[]): Market | null => {
    for (const market of markets) {
        if (market.ask_unit === askUnit && market.bid_unit === bidUnit ||
            market.ask_unit === bidUnit && market.bid_unit === askUnit) {
            return market;
        }
    }

    return null;
};

const isMarketPresent = (askUnit: string, bidUnit: string, markets: Market[]): boolean => {
    return (findMarket(askUnit, bidUnit, markets) !== null);
};

const findMarketTicker = (marketPair: string, marketTickers: MarketTicker) => {
    return marketTickers[marketPair];
};

const getWalletTotal = (wallet: WalletItemProps): number => {
    return Number(wallet.balance) + (Number(wallet.locked) || 0);
};

export const estimateWithMarket = (targetCurrency: string, walletCurrency: string, walletTotal: number, markets: Market[], marketTickers: MarketTicker): number => {
    const market = findMarket(targetCurrency, walletCurrency, markets);
    const marketTicker = findMarketTicker(market && market.id || '', marketTickers);

    if (market && marketTicker) {
        if (targetCurrency === market.ask_unit) {
            return Number(marketTicker.last) > 0 ? walletTotal * (1 / Number(marketTicker.last)) : 0;
        } else {
            return walletTotal * Number(marketTicker.last);
        }
    }

    return 0;
};

const estimateWithoutMarket = (targetCurrency: string, wallet: WalletItemProps, markets: Market[], marketTickers: MarketTicker): number => {
    const secondaryCurrencies: string[] = [];

    for (const market of markets) {
        if (market.ask_unit === targetCurrency) {
            secondaryCurrencies.push(market.bid_unit);
        }
        if (market.bid_unit === targetCurrency) {
            secondaryCurrencies.push(market.ask_unit);
        }
    }

    let selectedSecondaryCurrency = '';
    outer:
        for (const secondaryCurrency of secondaryCurrencies) {
            for (const market of markets) {
                if (market.ask_unit === secondaryCurrency && market.bid_unit === wallet.currency ||
                    market.bid_unit === secondaryCurrency && market.ask_unit === wallet.currency) {
                    selectedSecondaryCurrency = secondaryCurrency;
                    break outer;
                }
            }
        }

    if (selectedSecondaryCurrency) {
        const secondaryCurrencyValue = estimateWithMarket(selectedSecondaryCurrency, wallet.currency, getWalletTotal(wallet), markets, marketTickers);
        return estimateWithMarket(targetCurrency, selectedSecondaryCurrency, secondaryCurrencyValue, markets, marketTickers);
    } else {
        // 'No secondary currency found for', wallet.currency
    }

    return 0;
};

export const estimateValue = (targetCurrency: string, wallets: WalletItemProps[], markets: Market[], marketTickers: MarketTicker): number => {
    let estimatedValue = 0;

    for (const wallet of wallets) {
        if (wallet.currency === targetCurrency) {
            const walletTotal = Number(wallet.balance) + (Number(wallet.locked) || 0);
            estimatedValue += walletTotal;
        } else if (isMarketPresent(targetCurrency, wallet.currency, markets)) {
            estimatedValue += estimateWithMarket(targetCurrency, wallet.currency, getWalletTotal(wallet), markets, marketTickers);
        } else {
            estimatedValue += estimateWithoutMarket(targetCurrency, wallet, markets, marketTickers);
        }
    }

    return estimatedValue;
};

export const findPrecision = (unit: string, markets: Market[]) => {
    for (const market of markets) {
        if (market.ask_unit === unit) {
            return market.ask_precision;
        }
        if (market.bid_unit === unit) {
            return market.bid_precision;
        }
    }

    return 4;
};
