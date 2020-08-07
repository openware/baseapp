import * as React from 'react';
import { useIntl } from 'react-intl';
import { VALUATION_PRIMARY_CURRENCY, VALUATION_SECONDARY_CURRENCY } from '../../../constants';

interface Props {
    estimatedValue: string;
    estimateUnitValue: string;
}

const WalletsBanner = React.memo((props: Props) => {
    const intl = useIntl();

    return (
        <div className="cr-mobile-wallets-banner">
            <div className="cr-mobile-wallets-banner__title">
                {intl.formatMessage({ id: 'page.body.wallets.estimated_value' })}
            </div>
            <div className="cr-mobile-wallets-banner__body">
                <div className="cr-mobile-wallets-banner__body-wrap">
                    <span className="cr-mobile-wallets-banner__body-number">{props.estimatedValue}</span>
                    <span className="cr-mobile-wallets-banner__body-currency">{VALUATION_PRIMARY_CURRENCY.toUpperCase()}</span>
                </div>
                <div className="cr-mobile-wallets-banner__body-wrap">
                    <span className="cr-mobile-wallets-banner__body-number">{props.estimateUnitValue}</span>
                    <span className="cr-mobile-wallets-banner__body-currency">{VALUATION_SECONDARY_CURRENCY.toUpperCase()}</span>
                </div>
            </div>
        </div>
    );
});

export {
    WalletsBanner,
};
