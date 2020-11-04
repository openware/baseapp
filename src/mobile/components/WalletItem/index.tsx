import * as React from 'react';

import { CryptoIcon } from '../../../components/CryptoIcon';
import { Decimal } from '../../../components/Decimal';
import { DEFAULT_CCY_PRECISION } from '../../../constants';
import { areEqualSelectedProps } from '../../../helpers/areEqualSelectedProps';

interface Props {
    wallet;
    onClick: (v: string) => void;
}

const WalletItemComponent = (props: Props) => {
    const {
        wallet: { currency = '', name, balance = 0, fixed = DEFAULT_CCY_PRECISION },
    } = props;

    return (
        <div className="cr-mobile-wallet-item" onClick={() => props.onClick(currency)}>
            <div>
                <CryptoIcon className="cr-wallet-item__icon" code={currency.toUpperCase()} />
                <span className="cr-mobile-wallet-item__currency">{currency}</span>
                <span className="cr-mobile-wallet-item__name">{name}</span>
            </div>
            <div className="cr-mobile-wallet-item__balance">
                <span>
                    <Decimal fixed={fixed}>{balance || 0}</Decimal>
                </span>
            </div>
        </div>
    );
};

export const WalletItem = React.memo(
    WalletItemComponent,
    areEqualSelectedProps('wallet', ['currency', 'name', 'balance', 'fixed'])
);
