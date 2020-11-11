import { AppUrl, WalletRouteParams } from 'lib/url';
import React, { useCallback } from 'react';
import { useParams } from 'react-router';

import './index.scss';

import { WalletItem, WalletItemProps } from '../item';

export interface WalletListProps {
    walletItems: WalletItemProps[];
    activeIndex: number;
    /**
     * Callback function which is invoked whenever wallet item is clicked
     */
    onWalletSelectionChange(item: WalletItemProps): void;
    /**
     * Callback function which is invoked whenever wallet item is clicked
     */
    onActiveIndexChange(index: number): void;
}

const removeAlt = (str: string): string => str.replace('-alt', '');

/**
 * Component to display list of user wallets. It is scrollable and reacts on WalletItem click.
 */
export const WalletList: React.FC<WalletListProps> = ({
    onWalletSelectionChange,
    onActiveIndexChange,
    activeIndex,
    walletItems,
}) => {
    const { currency: activeCurrency } = useParams<WalletRouteParams>();

    const handleClick = useCallback(
        (i: number, p: WalletItemProps) => {
            if (onWalletSelectionChange) {
                onWalletSelectionChange(p);
            }
            if (onActiveIndexChange) {
                onActiveIndexChange(i);
            }
        },
        [onWalletSelectionChange, onActiveIndexChange]
    );

    return (
        <div className="n-wallet-list">
            {walletItems.map(({ currency, ...rest }: WalletItemProps, i: number) => (
                <a key={i} className="n-wallet-list__item" href={AppUrl.wallet.url({ currency: currency.toLowerCase() })}>
                    <WalletItem
                        key={i}
                        {...{
                            ...rest,
                            active: activeCurrency ? currency === activeCurrency : i === 0,
                            currency: removeAlt(currency),
                        }}
                    />
                </a>
            ))}
        </div>
    );
};
