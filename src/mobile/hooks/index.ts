import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    currenciesFetch,
    marketsFetch,
    marketsTickersFetch,
    selectCurrencies,
    selectMarkets,
    selectMarketTickers,
    selectWallets,
    walletsFetch,
} from '../../modules';


const useTickersFetch = () => {
    const tickers = useSelector(selectMarketTickers);
    const dispatch = useDispatch();

    React.useEffect(() => {
        if (!tickers) {
            dispatch(marketsTickersFetch());
        }
    }, [dispatch]);
};

const useCurrenciesFetch = () => {
    const currencies = useSelector(selectCurrencies);
    const dispatch = useDispatch();

    React.useEffect(() => {
        if (currencies.length === 0) {
            dispatch(currenciesFetch());
        }
    }, [dispatch]);
};

const useWalletsFetch = () => {
    const wallets = useSelector(selectWallets);
    const dispatch = useDispatch();

    React.useEffect(() => {
        if (wallets.length === 0) {
            dispatch(walletsFetch());
        }
    }, [dispatch]);
};

const useMarketsFetch = () => {
    const markets = useSelector(selectMarkets);
    const dispatch = useDispatch();

    React.useEffect(() => {
        if (markets.length === 0) {
            dispatch(marketsFetch());
        }
    }, [dispatch]);
};


export {
    useMarketsFetch,
    useWalletsFetch,
    useCurrenciesFetch,
    useTickersFetch,
};
