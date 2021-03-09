import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import {
    useCurrenciesFetch,
} from '../../hooks';
import {
    marketsFetch,
    selectMarkets,
    selectWallets,
    walletsFetch,
    Market,
} from '../../modules'
import { SwipeIcon } from '../../assets/images/swipe';
import { QuickExchangeForm, DropdownComponent } from '../../components';

interface QuickExchangeInterface {
    amount: string;
    currency: string;
    iconURL: string;
};

const DEFAULT_VALUE: QuickExchangeInterface = {
    amount: '',
    currency: '',
    iconURL: '',
}

export const QuickExchangeContainer = () => {
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();

    const [exchange, setExchange] = useState<QuickExchangeInterface>(DEFAULT_VALUE);
    const [receive, setReceive] = useState<QuickExchangeInterface>(DEFAULT_VALUE)

    const wallets = useSelector(selectWallets) || [];
    const markets = useSelector(selectMarkets) || [];

    useCurrenciesFetch();

    React.useEffect(() => {
        dispatch(walletsFetch());
        dispatch(marketsFetch({type: 'qe'}))
    }, []);

    const onlyUnique = (value, index, self) => (self.indexOf(value) === index);

    const getCurrencyForMarket = (markets: Market[]) => {
        const marketBaseUnits = markets.map(item => (item.base_unit));
        const marketQuoteUnits = markets.map(item => (item.quote_unit));

        const marketCurrencies =  marketBaseUnits.concat(...marketQuoteUnits)
            .filter(onlyUnique);
        return marketCurrencies;
    }

    const handleUpdateField= (field: string, formSide: string) => (value: string | number) => {
        const side = formSide === 'exchange' ? {...exchange} : {...receive};
        const updatedFields = {
            ...side,
            [field]: field === 'currency' ? walletsList[value] : value,
        }

        formSide === 'exchange' ? setExchange(updatedFields) : setReceive(updatedFields);
    }

    const swipeFields = () => {
        const newReceive = {...receive};
        const newExchange = {...exchange};

        setExchange(newReceive);
        setReceive(newExchange);
    }

    const translate = useCallback((id: string) => formatMessage({ id: id }), [formatMessage]);

    const walletsList = wallets.length ? wallets.map(item => item.currency && item.currency.toUpperCase()) : [];

    const marketCurrencies = markets.length ? getCurrencyForMarket(markets) : [];

    return (
        <div className="cr-quick-exchange">
            <div className="cr-quick-exchange__header">{translate('page.body.quick.exchange.header')}</div>
            <div>
                <QuickExchangeForm
                    field="exchange"
                    handleChangeInput={handleUpdateField('amount', 'exchange')}
                    value={exchange.amount}
                />
                <DropdownComponent
                    className="pg-confirm__content-address__row__content-number-dropdown"
                    list={walletsList}
                    selectedValue={exchange.currency}
                    onSelect={handleUpdateField('currency', 'exchange')}
                    placeholder="Currency"
                />
            </div>
                <SwipeIcon onClick={swipeFields} />
            <div>
                <QuickExchangeForm
                    field="receive"
                    handleChangeInput={handleUpdateField('amount', 'receive')}
                    value={receive.amount}
                />
                <DropdownComponent
                    className="pg-confirm__content-address__row__content-number-dropdown"
                    list={walletsList}
                    selectedValue={receive.currency}
                    onSelect={handleUpdateField('currency', 'receive')}
                    placeholder="Currency"
                />
            </div>
        </div>
    );
};
