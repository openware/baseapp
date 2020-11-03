import * as React from 'react';
import { useIntl } from 'react-intl';

import { Decimal } from '../../../components/Decimal';
import { DEFAULT_CCY_PRECISION } from '../../../constants';
import { areEqualSelectedProps } from '../../../helpers/areEqualSelectedProps';

interface Props {
    wallet: any;
}

const WalletBannerComponent = (props: Props) => {
    const {
        wallet: { currency, balance = 0, locked = 0, fixed = DEFAULT_CCY_PRECISION },
    } = props;
    const intl = useIntl();

    return (
        <div className="cr-wallet-banner-mobile">
            <div className="cr-wallet-banner-mobile__item">
                <span className="cr-wallet-banner-mobile__item-title">
                    {intl.formatMessage({ id: 'page.mobile.wallets.banner.total' })}
                </span>
                <div className="cr-wallet-banner-mobile__item-info">
                    <Decimal fixed={fixed} children={+(balance || 0) + +(locked || 0)} />
                    <span className="cr-wallet-banner-mobile__item-info-currency">{currency}</span>
                </div>
            </div>
            <div className="cr-wallet-banner-mobile__item">
                <span className="cr-wallet-banner-mobile__item-title">
                    {intl.formatMessage({ id: 'page.mobile.wallets.banner.available' })}
                </span>
                <div className="cr-wallet-banner-mobile__item-info">
                    <Decimal fixed={fixed} children={balance || 0} />
                    <span className="cr-wallet-banner-mobile__item-info-currency">{currency}</span>
                </div>
            </div>
        </div>
    );
};

const WalletBanner = React.memo(
    WalletBannerComponent,
    areEqualSelectedProps('wallet', ['balance', 'locked', 'currency', 'fixed'])
);

export { WalletBanner };
