import { Market, Wallet } from '../../modules';

const onlyUnique = (value, index, self) => self.indexOf(value) === index;

const getCurrencyForMarket = (markets: Market[]) => {
    const marketBaseUnits = markets.map(item => item.base_unit);
    const marketQuoteUnits = markets.map(item => item.quote_unit);

    const marketCurrencies =  marketBaseUnits.concat(...marketQuoteUnits).filter(onlyUnique);
    return marketCurrencies;
};

const getMarket = (marketID: string, markets: Market[]) => markets.find(w => w.id === marketID.toLowerCase()) as Market;

const getMarkets = (
    key: string,
    currency: string,
    quoteCurrency: string,
    markets: Market[],
    currencyMarkets: string[],
) => {
    if (key === 'base_unit' && !quoteCurrency) {
        const filtredMarkets = markets.filter(w => (w.base_unit === currency || w.quote_unit === currency));
        return getCurrencyForMarket(filtredMarkets);
    }

    if (key === 'quote_unit' && !quoteCurrency) {
        const filtredMarkets = markets.filter(w => (w.base_unit === currency || w.quote_unit === currency));
        return  getCurrencyForMarket(filtredMarkets);
    }

    return currencyMarkets;
};

const getCurrencyFiltred = (
    currency: string,
    quoteCurrency: string,
    key: string,
    currencyMarkets: string[],
    markets: Market[],
) => {
    const currencyLower = currency.toLowerCase();
    const currenciesMarket = getMarkets(key, currencyLower, quoteCurrency, markets, currencyMarkets);

    return currenciesMarket.filter(w => w !== currencyLower) as string[];
};

const getWallet = (currency: string, wallets: Wallet[]) => wallets.find(w => w.currency === currency.toLowerCase()) as Wallet;

const getWallets = (wallets: Wallet[], marketsUnits: string[]) => wallets.filter(w => marketsUnits.indexOf(w.currency) !== -1);

const getAvailableValue = (wallet: Wallet | undefined) => wallet ? wallet.balance : 0;

const cleanPositiveFloatInput = (text: string) => {
    let cleanInput = text
        .replace(',', '.')
        .replace(/-+/, '')
        .replace(/^0+/, '0')
        .replace(/\.+/, '.')
        .replace(/^0+([1-9])/, '$1');

    if (cleanInput[0] === '.') {
        cleanInput = `0${cleanInput}`;
    }

    return cleanInput;
};

const getBaseAmount = (wallet: Wallet, value: string, marketPrice: string, prevBaseAmount: string, prevQuoteAmount: string) => {
    if (+value <= +wallet.balance) {
        const quotePrice = Number(value || '0') * Number(marketPrice);

        return [value, String(quotePrice)];
    }

    return [prevBaseAmount, prevQuoteAmount];
};

const getQuoteAmount = (wallet: Wallet, value: string, marketPrice: string, prevBaseAmount: string, prevQuoteAmount: string) => {
    const baseValue = Number(value || '0') / Number(marketPrice);

    if (+wallet.balance >= baseValue) {
        return [String(baseValue), value];
    }

    return [prevBaseAmount, prevQuoteAmount];
};

export {
    onlyUnique,
    getCurrencyForMarket,
    getCurrencyFiltred,
    getMarkets,
    getWallets,
    getWallet,
    getAvailableValue,
    cleanPositiveFloatInput,
    getMarket,
    getBaseAmount,
    getQuoteAmount,
};
