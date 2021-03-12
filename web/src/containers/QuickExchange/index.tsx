import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { Button } from 'react-bootstrap';
import { useCurrenciesFetch } from '../../hooks';
import {
    marketsFetch,
    selectMarkets,
    selectWallets,
    walletsFetch,
    marketPriceFetch,
    Market,
} from '../../modules'
import { SwipeIcon } from '../../assets/images/swipe';
import { QuickExchangeForm, DropdownComponent } from '../../components';
import { onlyUnique, getCurrencyForMarket, getCurrencyFiltred, getMarket, getWallets, getWallet } from './helpers';

interface QuickExchangeInterface {
    amount: string;
    currency: string;
    iconURL: string;
};

const DEFAULT_VALUE: QuickExchangeInterface = {
    amount: '',
    currency: '',
    iconURL: '',
};

export const QuickExchangeContainer = () => {
    const [base, setBaseData] = useState<QuickExchangeInterface>(DEFAULT_VALUE);
    const [quote, setQuoteData] = useState<QuickExchangeInterface>(DEFAULT_VALUE);
    const [type, setType] = useState('buy');
    const [dropdownKey, setDropdownKey] = useState('');

    const { formatMessage } = useIntl();
    const dispatch = useDispatch();

    const wallets = useSelector(selectWallets) || [];
    const markets = useSelector(selectMarkets) || [];

    const translate = useCallback((id: string) => formatMessage({ id: id }), [formatMessage]);

    useCurrenciesFetch();

    React.useEffect(() => {
        dispatch(walletsFetch());
        dispatch(marketsFetch({type: 'qe'}));
    }, []);

    React.useEffect(() => {
        if (base.currency && quote.currency) {
            const market = base.currency + quote.currency;
            dispatch(marketPriceFetch({ market, side: type }));
        }
    }, [base, quote, type]);

    const marketCurrency = getCurrencyForMarket(markets);
    const marketsBaseUnit = getCurrencyFiltred(quote.currency, base.currency, dropdownKey, marketCurrency, markets);
    const marketsQuoteUnit = getCurrencyFiltred(base.currency, quote.currency, dropdownKey, marketCurrency, markets);
    const walletsBaseUnit = getWallets(wallets, marketsBaseUnit);
    const walletsQuoteUnit = getWallets(wallets, marketsQuoteUnit);
    const walletBase = getWallet(base.currency, wallets);

    const walletsBaseList = walletsBaseUnit.length ? walletsBaseUnit.map(item => item.currency && item.currency.toUpperCase()) : [];
    const walletsQuoteList = walletsQuoteUnit.length ? walletsQuoteUnit.map(item => item.currency && item.currency.toUpperCase()) : [];

    const handleChangeInput = (formSide: string) => (value: string) => {
        const side = formSide === 'exchange' ? base : quote;
        const updatedFields = {
            ...side,
            amount: value,
        };

        formSide === 'exchange' ? setBaseData(updatedFields) : setQuoteData(updatedFields);
    };

    const handleChangeDropdownBase = (index: number) => {
        const market = { id: '' };
        const value = walletsBaseList[index];
        const marketExists = markets.some(item => item.id === (value + quote.currency).toLowerCase());
        const marketMirrorExists = markets.some(item => item.id === (quote.currency + value).toLowerCase());

        if (marketExists) {
            market.id = (value + quote.currency).toLowerCase();
            const currentMarket = getMarket(market.id, markets);

            if (currentMarket) {
                setType('buy');
            }
        } else if (marketMirrorExists) {
            market.id = (quote.currency + value).toLowerCase();
            const currentMarket = getMarket(market.id, markets);

            if (currentMarket) {
                setType('sell');
            }
        }

        if (base.currency !== value && value !== '') {
            const newBaseCurrency: QuickExchangeInterface = {
                amount: '',
                currency: value,
                iconURL: '',
            };

            setQuoteData(DEFAULT_VALUE);
            setBaseData(newBaseCurrency);
        }

        setDropdownKey('base_unit');
    };

    const handleChangeDropdownQuote = (index: number) => {
        const market = { id: '' };
        const value = walletsQuoteList[index];
        const marketExists = markets.some(item => item.id === (base.currency + value).toLowerCase());
        const marketMirrorExists = markets.some(item => item.id === (value + base.currency).toLowerCase());

        if (marketExists) {
            market.id = (base.currency + value).toLowerCase();
            const currentMarket = getMarket(market.id, markets);

            if (currentMarket) {
                setType('buy');
            }
        } else if (marketMirrorExists) {
            market.id = (value + base.currency).toLowerCase();
            const currentMarket = getMarket(market.id, markets);

            if (currentMarket) {
                setType('sell');
            }
        }

        if (quote.currency !== value && quote.currency !== '') {
            const newQuoteCurrency: QuickExchangeInterface = {
                amount: '',
                currency: value,
                iconURL: '',
            };
            setBaseData(DEFAULT_VALUE);
            setQuoteData(newQuoteCurrency);
        }

        setDropdownKey('quote_unit');
    };


    const swipeFields = () => {
        setType(type === 'buy' ? 'sell' : 'buy');
        setBaseData(quote);
        setQuoteData(base);
    };


    const handleSubmitExchange = () => {
        console.log('submit');
    };

    return (
        <div className="cr-quick-exchange">
            <div className="cr-quick-exchange__header">
                {translate('page.body.quick.exchange.header')}
            </div>
            <div className="cr-quick-exchange__body">
                <div className="cr-quick-exchange__body-currency-block">
                    <QuickExchangeForm
                        field="exchange"
                        handleChangeInput={handleChangeInput('exchange')}
                        value={base.amount}
                    />
                    <DropdownComponent
                        className="cr-quick-exchange__body-currency-block-dropdown"
                        list={walletsBaseList}
                        selectedValue={base.currency}
                        onSelect={handleChangeDropdownBase}
                        placeholder="Currency"
                    />
                </div>
                <div className="cr-quick-exchange__body-swap">
                    <SwipeIcon onClick={swipeFields} />
                </div>
                <div className="cr-quick-exchange__body-currency-block">
                    <QuickExchangeForm
                        field="receive"
                        handleChangeInput={handleChangeInput('receive')}
                        value={quote.amount}
                    />
                    <DropdownComponent
                        className="cr-quick-exchange__body-currency-block-dropdown"
                        list={walletsQuoteList}
                        selectedValue={quote.currency}
                        onSelect={handleChangeDropdownQuote}
                        placeholder="Currency"
                    />
                </div>
                <div className="cr-quick-exchange__body-summary">
                    <div className="cr-quick-exchange__body-summary-currency">
                        <div className="cr-quick-exchange__body-summary-currency-label">
                            You exchange
                        </div>
                        <div className="cr-quick-exchange__body-summary-currency-value">
                            {base.amount} {base.currency.toUpperCase()}
                        </div>
                    </div>
                    <div className="cr-quick-exchange__body-summary-icons">
                        Icons
                    </div>
                    <div className="cr-quick-exchange__body-summary-currency">
                        <div className="cr-quick-exchange__body-summary-currency-label">
                            You receive
                        </div>
                        <div className="cr-quick-exchange__body-summary-currency-value">
                            {quote.amount} {quote.currency.toUpperCase()}
                        </div>
                    </div>
                </div>
                <div className="cr-quick-exchange__body-info">
                    <div className="cr-quick-exchange__body-info-price">
                        Estimated price: <span>~0.04147820 {base.currency.toUpperCase()}</span>
                    </div>
                    <div className="cr-quick-exchange__body-info-warning">
                        Slippage is higher than 1%. Enter a lower amount to get a better price
                    </div>
                </div>
                <div className="cr-quick-exchange__body-button">
                    <Button
                        onClick={handleSubmitExchange}
                        size="lg"
                        variant="primary"
                    >
                        Exchange
                    </Button>
                </div>
            </div>
        </div>
    );
};
