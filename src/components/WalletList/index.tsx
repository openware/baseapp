import * as React from 'react';
import { WalletItem, WalletItemProps } from '../WalletItem';

interface WalletListProps {
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
export class WalletList
    extends React.Component<WalletListProps> {

    constructor(props: WalletListProps) {
        super(props);
    }
    public itemState = (i: number) => {
        return this.props.activeIndex === i;
    };
    public makeWalletItem = (props: WalletItemProps, i: number) => (
        <li
            key={i}
            style={style}
            onClick={this.handleClick.bind(this, i, props)}
        >
            <WalletItem
                key={i}
                {...{
                    ...props,
                    active: this.itemState(i),
                    currency: removeAlt(props.currency),
                }}
            />
        </li>
    );
    public handleClick = (i: number, props: WalletItemProps) => {
        if (this.props.onWalletSelectionChange) {
            this.props.onWalletSelectionChange(props);
        }
        if (this.props.onActiveIndexChange) {
            this.props.onActiveIndexChange(i);
        }
    };

    public render() {
        return (
            <ul className="cr-wallet-list">
                {this.props.walletItems.map(this.makeWalletItem)}
            </ul>
        );
    }
}

export {
    WalletListProps,
};
