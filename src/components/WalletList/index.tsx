import * as React from 'react';
import { WalletItem, WalletItemProps } from '../WalletItem';

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

const style: React.CSSProperties = {
    listStyleType: 'none',
    padding: 'calc(var(--gap) * 0.5) calc(var(--gap))',
};

/**
 * Component to display list of user wallets. It is scrollable and reacts on WalletItem click.
 */
export const WalletList: React.FC<WalletListProps> = (props: WalletListProps) => {
    const handleClick = (i: number, p: WalletItemProps) => {
        if (props.onWalletSelectionChange) {
            props.onWalletSelectionChange(p);
        }
        if (props.onActiveIndexChange) {
            props.onActiveIndexChange(i);
        }
    };

    const makeWalletItem = (p: WalletItemProps, i: number) => (
        <li
            key={i}
            style={style}
            onClick={() => handleClick(i, p)}
        >
            <WalletItem
                key={i}
                {...{
                    ...p,
                    active: props.activeIndex === i,
                    currency: removeAlt(p.currency),
                }}
            />
        </li>
    );

    return (
        <ul className="cr-wallet-list">
            {props.walletItems.map(makeWalletItem)}
        </ul>
    );
};
