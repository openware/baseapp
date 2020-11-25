import { WalletRouteParams } from 'lib/url';
import React from 'react';
import { useParams } from 'react-router';

import './index.scss';

import { WalletItem, WalletItemProps } from '../item';
import { StringUtil } from 'lib/utils';
import { Wallet } from 'src/modules';

export interface WalletListProps {
    items: Wallet[];
}

const removeAlt = (str: string): string => str.replace('-alt', '');

/**
 * Component to display list of user wallets. It is scrollable and reacts on WalletItem click.
 */
export const WalletList: React.FC<WalletListProps> = ({
    items,
}) => {
    const { currency: activeCurrency } = useParams<WalletRouteParams>();

    return (
        <div className="n-wallet-list">
            {items.map(({ currency, ...rest }: WalletItemProps, i: number) => (
                <WalletItem
                    key={i}
                    className="n-wallet-list__item"
                    {...{
                        ...rest,
                        active: activeCurrency ? StringUtil.isEqual(currency, activeCurrency) : i === 0,
                        currency: removeAlt(currency),
                    }}
                />
            ))}
        </div>
    );
};
