import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { CryptoIcon } from '../CryptoIcon';
import { Decimal } from '../Decimal';
import { Wallet } from '../../modules';

export interface CurrencyInfoProps {
    wallet: Wallet;
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
    const balance = props.wallet && props.wallet.balance ? props.wallet.balance.toString() : '0';
    const lockedAmount = props.wallet && props.wallet.locked ? props.wallet.locked.toString() : '0';
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
                    <Decimal fixed={selectedFixed} thousSep=",">{stringLocked}</Decimal>
                </span>
                </div>
                <div>
                <span className="cr-wallet-item__balance">
                    {currency}&nbsp;<FormattedMessage id="page.body.wallets.balance"/>
                </span>
                &nbsp;
                <span className="cr-wallet-item__balance-amount">
                    <Decimal fixed={selectedFixed} thousSep=",">{balance}</Decimal>
                </span>
                </div>
            </div>
        </div>
    );
};

export {
    CurrencyInfo,
};
