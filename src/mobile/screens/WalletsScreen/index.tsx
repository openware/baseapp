import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { VALUATION_PRIMARY_CURRENCY, VALUATION_SECONDARY_CURRENCY } from '../../../constants';
import { estimateUnitValue, estimateValue } from '../../../helpers/estimateValue';
import { selectCurrencies } from '../../../modules/public/currencies';
import {
    selectMarkets,
    selectMarketTickers,
} from '../../../modules/public/markets';

import { selectWallets, walletsFetch } from '../../../modules/user/wallets';
import { WalletItem, WalletsBanner } from '../../components';

const WalletsMobileScreen = () => {
    const dispatch = useDispatch();
    const markets = useSelector(selectMarkets);
    const currencies = useSelector(selectCurrencies);
    const wallets = useSelector(selectWallets);
    const tickers = useSelector(selectMarketTickers);
    const stableDispatch = React.useCallback(dispatch, []);
    const estimatedValue = estimateValue(VALUATION_PRIMARY_CURRENCY, currencies, wallets, markets, tickers);
    const estimatedSecondaryValue = estimateUnitValue(VALUATION_SECONDARY_CURRENCY, VALUATION_PRIMARY_CURRENCY, +estimatedValue, currencies, markets, tickers);


    React.useEffect(() => {
        if (wallets.length === 0) {
            stableDispatch(walletsFetch());
        }
    }, [stableDispatch, wallets]);

    return <div>
        <WalletsBanner
            estimatedValue={estimatedValue}
            estimateUnitValue={estimatedSecondaryValue}
        />
        {wallets.map((item, index) =>
            <WalletItem
                currency={item.currency}
                name={item.name}
                balance={item.balance}
                key={index}
            />)}
    </div>;
};

export {
    WalletsMobileScreen,
};
