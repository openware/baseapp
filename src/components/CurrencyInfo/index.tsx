import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Decimal } from '../Decimal';
import { WalletItemProps } from '../WalletItem';
import { CryptoIcon } from '../CryptoIcon';

export interface CurrencyInfoProps {
    wallet: WalletItemProps;
}

interface CurrencyIconProps {
    icon?: string | null;
    currency: string;
}

const CurrencyIcon: React.FunctionComponent<CurrencyIconProps> = (props: CurrencyIconProps) => {
    return props.icon ?
        <img alt="" className="cr-wallet-item__single__image-icon" src={props.icon} /> :
        <CryptoIcon code={props.currency} />;
};

const CurrencyInfo: React.FunctionComponent<CurrencyInfoProps> = (props: CurrencyInfoProps) => {
    const balance = (props.wallet || { balance: 0 }).balance.toString();
    const lockedAmount = (props.wallet || { locked: 0 }).locked;
    const currency = (props.wallet || { currency: '' }).currency.toUpperCase();
    const selectedFixed = (props.wallet || { fixed: 0 }).fixed;

    const stringLocked = lockedAmount ? lockedAmount.toString() : undefined;
    const iconUrl = props.wallet ? props.wallet.iconUrl : null;


    return (
        <div className="cr-wallet-item__single">
            <CurrencyIcon icon={iconUrl} currency={currency}/>
            <div className="cr-wallet-item__single-balance">
                <div>
                    <div className="cr-wallet-item__amount-locked">
                        <FormattedMessage id="page.body.wallets.locked" />
                    </div>
                    <span className="cr-wallet-item__balance-locked">
                    <Decimal fixed={selectedFixed}>{stringLocked}</Decimal>
                </span>
                </div>
                <div>
                <span className="cr-wallet-item__balance">
                    {currency}&nbsp;<FormattedMessage id="page.body.wallets.balance"/>
                </span>
                &nbsp;
                <span className="cr-wallet-item__balance-amount">
                    <Decimal fixed={selectedFixed}>{balance}</Decimal>
                </span>
                </div>
            </div>
        </div>
    );
};

export {
    CurrencyInfo,
};
