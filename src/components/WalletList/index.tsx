import React, { useCallback } from 'react';
import { Wallet } from '../../modules';
import { WalletItem } from '../WalletItem';

export interface WalletListProps {
    walletItems: Wallet[];
    activeIndex: number;
    /**
     * Callback function which is invoked whenever wallet item is clicked
     */
    onWalletSelectionChange(item: Wallet): void;
    /**
     * Callback function which is invoked whenever wallet item is clicked
     */
    onActiveIndexChange(index: number): void;
}

const removeAlt = (str: string): string => str.replace('-alt', '');

const style: React.CSSProperties = {
    listStyleType: 'none',
    padding: 'calc(var(--gap) * 0.5) calc(var(--gap))',
};

/**
 * Component to display list of user wallets. It is scrollable and reacts on WalletItem click.
 */
export const WalletList: React.FC<WalletListProps> = ({
    onWalletSelectionChange,
    onActiveIndexChange,
    activeIndex,
    walletItems,
}) => {
    const handleClick = useCallback(
        (i: number, p: Wallet) => {
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
        <ul className="cr-wallet-list">
            {walletItems.map((p: Wallet, i: number) => (
                <li key={i} style={style} onClick={() => handleClick(i, p)}>
                    <WalletItem
                        key={i}
                        {...{
                            ...p,
                            active: activeIndex === i,
                            currency: removeAlt(p.currency),
                        }}
                    />
                </li>
            ))}
        </ul>
    );
};
