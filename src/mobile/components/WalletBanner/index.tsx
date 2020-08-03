import * as React from 'react';
import {  Decimal } from '../../../components/Decimal';
import { areEqualSelectedProps } from '../../../helpers/areEqualSelectedProps';

interface Props {
    wallet: any;
}

const WalletBannerComponent = (props: Props) => {
    const { wallet: { currency, balance, locked } } = props;

    return (
        <div className="cr-wallet-banner-mobile">
            <div className="cr-wallet-banner-mobile__item">
                <span className="cr-wallet-banner-mobile__item-title">Total</span>
                <div className="cr-wallet-banner-mobile__item-info">
                    <Decimal fixed={7} children={+balance + +locked}/>
                    <span className="cr-wallet-banner-mobile__item-info-currency">{currency}</span>
                </div>
            </div>
            <div className="cr-wallet-banner-mobile__item">
                <span className="cr-wallet-banner-mobile__item-title">Available</span>
                <div className="cr-wallet-banner-mobile__item-info">
                    <Decimal fixed={7} children={balance}/>
                    <span className="cr-wallet-banner-mobile__item-info-currency">{currency}</span>
                </div>
            </div>
        </div>
    );
};

const WalletBanner = React.memo(WalletBannerComponent, areEqualSelectedProps('wallet', ['balance', 'locked', 'currency']));

export {
    WalletBanner,
};
