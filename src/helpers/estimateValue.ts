// eslint-disable
import { Decimal } from '../components/Decimal';
import { WalletItemProps } from '../components/WalletItem';
import { DEFAULT_CCY_PRECISION } from '../constants';
import { Currency } from '../modules/public/currencies';
import { Market, Ticker } from '../modules/public/markets';
import { handleCCYPrecision } from './';

export interface MarketTicker {
    [key: string]: Ticker;
}

const findMarket = (askUnit: string, bidUnit: string, markets: Market[]): Market | null => {
    for (const market of markets) {
        if ((market.base_unit === askUnit && market.quote_unit === bidUnit) ||
            (market.base_unit === bidUnit && market.quote_unit === askUnit)) {
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
    return (Number(wallet.balance) || 0) + (Number(wallet.locked) || 0);
};

export const estimateWithMarket = (targetCurrency: string, walletCurrency: string, walletTotal: number, currencies: Currency[], markets: Market[], marketTickers: MarketTicker): number => {
    const formattedTargetCurrency = targetCurrency.toLowerCase();
    const formattedWalletCurrency = walletCurrency.toLowerCase();
    const market = findMarket(formattedTargetCurrency, formattedWalletCurrency, markets);
    const marketTicker = findMarketTicker((market && market.id) || '', marketTickers);
    const targetCurrencyPrecision = handleCCYPrecision(currencies, formattedTargetCurrency, DEFAULT_CCY_PRECISION);

    if (formattedTargetCurrency === formattedWalletCurrency) {
        return Number(Decimal.format(walletTotal, targetCurrencyPrecision));
    }

    if (market && marketTicker) {
        if (formattedTargetCurrency === market.base_unit) {
            const precisedValue = Number(Decimal.format(walletTotal * (Number(marketTicker.last) !== 0 ? 1 / Number(marketTicker.last) : 0), targetCurrencyPrecision));

            return precisedValue;
        } else {
            const precisedValue = Number(Decimal.format(walletTotal * Number(marketTicker.last), targetCurrencyPrecision));

            return precisedValue;
        }
    }

    return 0;
};

const estimateWithoutMarket = (targetCurrency: string, walletCurrency: string, walletTotal: number, currencies: Currency[], markets: Market[], marketTickers: MarketTicker): number => {
    const secondaryCurrencies: string[] = [];
    const formattedTargetCurrency = targetCurrency.toLowerCase();
    const formattedWalletCurrency = walletCurrency.toLowerCase();

    for (const market of markets) {
        if (market.base_unit === formattedTargetCurrency) {
            secondaryCurrencies.push(market.quote_unit);
        }
        if (market.quote_unit === formattedTargetCurrency) {
            secondaryCurrencies.push(market.base_unit);
        }
    }

    let selectedSecondaryCurrency = '';
    outer:
        for (const secondaryCurrency of secondaryCurrencies) {
            for (const market of markets) {
                if ((market.base_unit === secondaryCurrency && market.quote_unit === formattedWalletCurrency) ||
                    (market.quote_unit === secondaryCurrency && market.base_unit === formattedWalletCurrency)) {
                    selectedSecondaryCurrency = secondaryCurrency;
                    break outer;
                }
            }
        }

    if (selectedSecondaryCurrency) {
        const secondaryCurrencyValue = estimateWithMarket(selectedSecondaryCurrency, formattedWalletCurrency, walletTotal, currencies, markets, marketTickers);

        return estimateWithMarket(targetCurrency, selectedSecondaryCurrency, secondaryCurrencyValue, currencies, markets, marketTickers);
    } else {
        // 'No secondary currency found for', wallet.currency
    }

    return 0;
};

export const estimateValue = (targetCurrency: string, currencies: Currency[], wallets: WalletItemProps[], markets: Market[], marketTickers: MarketTicker): string => {
    const formattedTargetCurrency = targetCurrency.toLowerCase();
    let estimatedValue = 0;

    if (wallets && wallets.length) {
        for (const wallet of wallets) {
            const formattedWalletCurrency = wallet.currency.toLowerCase();

            if (formattedWalletCurrency === formattedTargetCurrency) {
                const walletTotal = (Number(wallet.balance) || 0) + (Number(wallet.locked) || 0);
                estimatedValue += walletTotal;
            } else if (isMarketPresent(formattedTargetCurrency, formattedWalletCurrency, markets)) {
                estimatedValue += estimateWithMarket(formattedTargetCurrency, formattedWalletCurrency, getWalletTotal(wallet), currencies, markets, marketTickers);
            } else {
                estimatedValue += estimateWithoutMarket(formattedTargetCurrency, wallet.currency, getWalletTotal(wallet), currencies, markets, marketTickers);
            }
        }
    }

    const targetCurrencyPrecision = handleCCYPrecision(currencies, formattedTargetCurrency, DEFAULT_CCY_PRECISION);
    const precisedEstimatedValue = Decimal.format(estimatedValue, targetCurrencyPrecision);

    return precisedEstimatedValue;
};

export const estimateUnitValue = (targetCurrency: string, currentCurrency: string, total: number, currencies: Currency[], markets: Market[], marketTickers: MarketTicker): string => {
    const estimated = estimateWithMarket(targetCurrency, currentCurrency, total, currencies, markets, marketTickers) || estimateWithoutMarket(targetCurrency, currentCurrency, total, currencies, markets, marketTickers);
    const formattedTargetCurrency = targetCurrency.toLowerCase();
    const targetCurrencyPrecision = handleCCYPrecision(currencies, formattedTargetCurrency, DEFAULT_CCY_PRECISION);

    return Decimal.format(estimated, targetCurrencyPrecision);
};

export const findPrecision = (unit: string, markets: Market[]) => {
    for (const market of markets) {
        if (market.base_unit === unit) {
            return market.amount_precision;
        }
        if (market.quote_unit === unit) {
            return market.price_precision;
        }
    }

    return 4;
};
