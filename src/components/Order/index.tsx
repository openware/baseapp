import {
    Loader,
    Order,
    OrderProps,
    WalletItemProps,
} from '@openware/components';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState, selectWallets } from '../../modules';
import { selectCurrentMarket, selectMarketTickers } from '../../modules/markets';
import {
    feesFetch,
    MarketFees,
    orderExecuteFetch,
    selectFees,
    selectOrderExecuteError,
    selectOrderExecuteLoading,
} from '../../modules/orders';
import { CommonError } from '../../modules/types';

interface ReduxProps {
    currentMarket: {
        id: string;
        name: string;
    };
    fees: MarketFees[];
    executeLoading: boolean;
    marketTickers: {
        [key: string]: {
            last: string;
        },
    };
    executeError?: CommonError;
    wallets: WalletItemProps[];
}

// tslint:disable
interface StoreProps {
    orderSide: string;
    wallet?: any;
}

interface DispatchProps {
    feesFetch: typeof feesFetch;
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

    public componentDidMount() {
        this.props.feesFetch();
    }

    public componentWillReceiveProps(next: Props) {
        if ((next.currentMarket.id !== this.props.currentMarket.id) || !this.state.wallet) {
            this.setState({
                wallet: this.getWallet(this.state.orderSide),
            });
        }
    }

    public render() {
        const { executeError, executeLoading, marketTickers, fees } = this.props;
        const { wallet } = this.state;
        const currentMarketId = this.props.currentMarket.id;
        const to = currentMarketId.slice(0, 3);
        const from = currentMarketId.slice(-3);

        const currentTicker = marketTickers[currentMarketId];
        const defaultCurrentTicker = { last: '0' };
        const orderFees = this.getTradingFees(fees);

        return (
            <div className={'pg-order'}>
                <div className="cr-table-header__content">
                    <div className="cr-title-component">Insert New Order</div>
                </div>
                {executeError && <span className="pg-order__error">{executeError.message}</span>}
                <Order
                    disabled={executeLoading}
                    feeBuy={Number(orderFees.bid.value)}
                    feeSell={Number(orderFees.ask.value)}
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

    private getTradingFees(fees: MarketFees[]) {
        const emptyFees = {
            ask: {
                value: 0,
            },
            bid: {
                value: 0,
            },
        };
        const { currentMarket } = this.props;
        const foundFee = fees.find((fee: MarketFees) => !!fee[currentMarket.id]) || {};
        return foundFee[currentMarket.id] ? foundFee[currentMarket.id] : emptyFees;
    }

    private getWallet(orderSide: string) {
        const { wallets, currentMarket } = this.props;
        const currentMarketName = orderSide === 'sell' ?
            (currentMarket ? currentMarket.name.split('/')[0] : '') :
            (currentMarket ? currentMarket.name.split('/')[1] : '');

        const wallet = wallets && wallets.find(w => w.currency === currentMarketName.toLowerCase());
        return wallet;
    }

    private getOrderType = (index: number, label: string) => {
        this.setState({
            orderSide: label.toLowerCase(),
            wallet: this.getWallet(label.toLowerCase()),
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
    fees: selectFees(state),
});

const mapDispatchToProps = dispatch => ({
    feesFetch: () => dispatch(feesFetch()),
    orderExecute: payload => dispatch(orderExecuteFetch(payload)),
});

// tslint:disable-next-line
const OrderComponent = connect(mapStateToProps, mapDispatchToProps)(OrderInsert as any);

export {
    OrderComponent,
};
