import * as React from 'react';
import { CryptoIcon } from '../../../components/CryptoIcon';
import { areEqualSelectedProps } from '../../../helpers/areEqualSelectedProps';

interface Props {
    wallet: {
        iconUrl?: string;
        currency: string;
        name: string;
        balance?: string;
    };
    onClick: (v: string) => void;
}

const WalletItemComponent = (props: Props) => {
    const { wallet: { currency, name, balance } } = props;

    return (
        <div className="cr-mobile-wallet-item" onClick={() => props.onClick(currency)}>
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
};

const WalletItem = React.memo(WalletItemComponent, areEqualSelectedProps('wallet', ['currency', 'name', 'balance']));

export {
    WalletItem,
};
