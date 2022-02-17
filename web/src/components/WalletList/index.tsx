import React, { useCallback } from 'react';
import { Wallet, Currency, Ticker, Market } from '../../modules';
import { WalletItem } from '../WalletItem';
export interface WalletListProps {
    walletItems: Wallet[];
    activeIndex: number;
    currencies: Currency[];
    tickers:{
        [key: string]: Ticker,
    }
    markets: Market[];
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
    currencies,
    markets,
    tickers,
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
                        currencies={currencies}
                        tickers={tickers}
                        markets={markets}
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
