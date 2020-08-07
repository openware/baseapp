import * as React from 'react';
import { CryptoIcon } from '../../../components/CryptoIcon';

interface Props {
    iconUrl?: string;
    currency: string;
    name: string;
    balance?: string;
}

const WalletItem = React.memo((props: Props) => {
    const { currency, name, balance } = props;

    return (
        <div className="cr-mobile-wallet-item">
            <div>
                <CryptoIcon className="cr-wallet-item__icon" code={currency.toUpperCase()} />
                <span className="cr-mobile-wallet-item__currency">{currency}</span>
                <span className="cr-mobile-wallet-item__name">{name}</span>
            </div>
            <div className="cr-mobile-wallet-item__balance">
                <span>{balance || '0'}</span>
            </div>
        </div>
    );
});

export {
    WalletItem,
};
