import {
    Loader,
    Order,
    OrderProps,
    WalletItemProps,
} from '@openware/components';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState, selectWallets } from '../../modules';
import { Market, selectCurrentMarket, selectMarketTickers } from '../../modules/markets';
import {
    orderExecuteFetch,
    selectOrderExecuteError,
    selectOrderExecuteLoading,
} from '../../modules/orders';
import { CommonError } from '../../modules/types';

interface ReduxProps {
    currentMarket: Market | undefined;
    executeLoading: boolean;
    marketTickers: {
        [key: string]: {
            last: string;
        },
    };
    executeError?: CommonError;
    wallets: WalletItemProps[];
}

interface StoreProps {
    orderSide: string;
    // tslint:disable-next-line no-any
    wallet?: any;
}

interface DispatchProps {
    orderExecute: typeof orderExecuteFetch;
}

type Props = ReduxProps & DispatchProps;

class OrderInsert extends React.PureComponent<Props, StoreProps> {
    constructor(props: Props) {
        super(props);

        this.state = {
            orderSide: 'buy',
            wallet: undefined,
        };
    }

    public componentWillReceiveProps(next: Props) {
        if (next.wallets && (next.wallets.length === 0)) {
            this.setState({
                wallet: undefined,
            });
        }
        if ((next.currentMarket && (!this.props.currentMarket || next.currentMarket.id !== this.props.currentMarket.id)) || !this.state.wallet) {
            this.setState({
                wallet: this.getWallet(this.state.orderSide, next.currentMarket),
            });
        }
    }

    public render() {
        if (!this.props.currentMarket) {
            return null;
        }
        const { executeError, executeLoading, marketTickers, currentMarket } = this.props;
        const { wallet } = this.state;
        const to = currentMarket.ask_unit;
        const from = currentMarket.bid_unit;

        const currentTicker = marketTickers[currentMarket.id];
        const defaultCurrentTicker = { last: '0' };

        return (
            <div className={'pg-order'}>
                <div className="cr-table-header__content">
                    <div className="cr-title-component">Insert New Order</div>
                </div>
                {executeError && <span className="pg-order__error">{executeError.message}</span>}
                <Order
                    disabled={executeLoading}
                    feeBuy={Number(currentMarket.ask_fee || 0)}
                    feeSell={Number(currentMarket.ask_fee || 0)}
                    from={from}
                    available={this.getAvailableValue(wallet)}
                    onSubmit={this.handleSubmit}
                    priceMarketBuy={Number((currentTicker || defaultCurrentTicker).last)}
                    priceMarketSell={Number((currentTicker || defaultCurrentTicker).last)}
                    to={to}
                    handleSendType={this.getOrderType}
                />
                {executeLoading && <Loader />}
            </div>
        );
    }

    private handleSubmit = (value: OrderProps) => {
        if (!this.props.currentMarket) {
            return;
        }
        const { type, price, orderType, amount } = value;
        const resultData = {
            market: this.props.currentMarket.id,
            side: type,
            volume: amount.toString(),
            ord_type: (orderType as string).toLowerCase(),
        };
        const order = orderType === 'Limit' ? { ...resultData, price: price.toString() } : resultData;
        this.props.orderExecute(order);
    };

    private getWallet(orderSide: string, market?: Market) {
        const { wallets } = this.props;
        const currentMarket = market ? market : this.props.currentMarket;
        const currentMarketName = orderSide === 'sell' ?
            (currentMarket ? currentMarket.name.split('/')[0] : '') :
            (currentMarket ? currentMarket.name.split('/')[1] : '');

        const wallet = wallets && wallets.find(w => w.currency === currentMarketName.toLowerCase());
        return wallet;
    }

    private getOrderType = (index: number, label: string) => {
        const wallet = this.getWallet(label.toLowerCase());
        this.setState({
            orderSide: label.toLowerCase(),
            wallet,
        });
    }

    private getAvailableValue(wallet) {
        return wallet ? wallet.balance : 0;
    }
}

const mapStateToProps = (state: RootState) => ({
    currentMarket: selectCurrentMarket(state),
    executeError: selectOrderExecuteError(state),
    executeLoading: selectOrderExecuteLoading(state),
    marketTickers: selectMarketTickers(state),
    wallets: selectWallets(state),
});

const mapDispatchToProps = dispatch => ({
    orderExecute: payload => dispatch(orderExecuteFetch(payload)),
});

// tslint:disable-next-line
const OrderComponent = connect(mapStateToProps, mapDispatchToProps)(OrderInsert as any);

export {
    OrderComponent,
};
