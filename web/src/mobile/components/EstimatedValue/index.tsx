import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { VALUATION_PRIMARY_CURRENCY, VALUATION_SECONDARY_CURRENCY } from '../../../constants';
import { estimateUnitValue, estimateValue } from '../../../helpers/estimateValue';
import { useMarketsFetch, useMarketsTickersFetch, useWalletsFetch } from '../../../hooks';
import { selectCurrencies, selectMarkets, selectMarketTickers, selectWallets } from '../../../modules';

const EstimatedValueMobile = React.memo(() => {
    const intl = useIntl();

    const wallets = useSelector(selectWallets) || [];
    const markets = useSelector(selectMarkets);
    const currencies = useSelector(selectCurrencies);
    const tickers = useSelector(selectMarketTickers);
    const estimatedValue = estimateValue(VALUATION_PRIMARY_CURRENCY, currencies, wallets, markets, tickers);
    const estimatedSecondaryValue = estimateUnitValue(VALUATION_SECONDARY_CURRENCY, VALUATION_PRIMARY_CURRENCY, +estimatedValue, currencies, markets, tickers);

    useWalletsFetch();
    useMarketsFetch();
    useMarketsTickersFetch();

    return (
        <div className="cr-mobile-wallets-banner">
            <div className="cr-mobile-wallets-banner__title">
                {intl.formatMessage({ id: 'page.body.wallets.estimated_value' })}
            </div>
            <div className="cr-mobile-wallets-banner__body">
                <div className="cr-mobile-wallets-banner__body-wrap">
                    <span className="cr-mobile-wallets-banner__body-number">{estimatedValue}</span>
                    <span className="cr-mobile-wallets-banner__body-currency">{VALUATION_PRIMARY_CURRENCY.toUpperCase()}</span>
                </div>
                <div className="cr-mobile-wallets-banner__body-wrap">
                    <span className="cr-mobile-wallets-banner__body-number">{estimatedSecondaryValue}</span>
                    <span className="cr-mobile-wallets-banner__body-currency">{VALUATION_SECONDARY_CURRENCY.toUpperCase()}</span>
                </div>
            </div>
        </div>
    );
});

export {
    EstimatedValueMobile,
};
