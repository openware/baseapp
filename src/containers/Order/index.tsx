import { Loader } from '@openware/components';
import * as React from 'react';
import {
    FormattedMessage,
    InjectedIntlProps,
    injectIntl,
} from 'react-intl';
import { connect } from 'react-redux';
import { Order, OrderProps, WalletItemProps } from '../../components';
import {
    RootState,
    selectCurrentPrice,
    selectDepthAsks,
    selectDepthBids, selectUserLoggedIn,
    selectWallets,
    setCurrentPrice,
    Wallet, walletsFetch,
} from '../../modules';
import { Market, selectCurrentMarket, selectMarketTickers } from '../../modules/public/markets';
import {
    orderExecuteFetch,
    selectOrderExecuteLoading,
} from '../../modules/user/orders';

interface ReduxProps {
    currentMarket: Market | undefined;
    executeLoading: boolean;
    marketTickers: {
        [key: string]: {
            last: string;
        },
    };
    bids: string[][];
    asks: string[][];
    wallets: WalletItemProps[];
    currentPrice: number | undefined;
}

interface StoreProps {
    orderSide: string;
    priceLimit: number | undefined;
    width: number;
}

interface DispatchProps {
    accountWallets: typeof walletsFetch;
    setCurrentPrice: typeof setCurrentPrice;
    orderExecute: typeof orderExecuteFetch;
}

type Props = ReduxProps & DispatchProps & InjectedIntlProps;

class OrderInsert extends React.PureComponent<Props, StoreProps> {
    constructor(props: Props) {
        super(props);

        this.state = {
            orderSide: 'buy',
            priceLimit: undefined,
            width: 0,
        };

        this.orderRef = React.createRef();
    }

    private getOrderTypes = [
        this.props.intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.orderType.limit' }),
        this.props.intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.orderType.market' }),
    ];

    private orderRef;

    public componentDidUpdate() {
        if (this.orderRef.current && this.state.width !== this.orderRef.current.clientWidth) {
            this.setState({
                width: this.orderRef.current.clientWidth,
            });
        }
    }

    public componentWillReceiveProps(next: Props) {
        const {userLoggedIn, accountWallets} = this.props;
        if (userLoggedIn && (!next.wallets || next.wallets.length === 0)) {
            accountWallets();
        }
        if (+next.currentPrice && next.currentPrice !== this.state.priceLimit) {
            this.setState({
                priceLimit: +next.currentPrice,
            });
        }
    }

    public render() {
        const { executeLoading, marketTickers, currentMarket, wallets, asks, bids } = this.props;
        if (!currentMarket) {
            return null;
        }
        const { priceLimit } = this.state;

        const walletBase = this.getWallet(currentMarket.base_unit, wallets);
        const walletQuote = this.getWallet(currentMarket.quote_unit, wallets);

        const to = currentMarket.base_unit;
        const from = currentMarket.quote_unit;

        const currentTicker = marketTickers[currentMarket.id];
        const defaultCurrentTicker = { last: '0' };
        const headerContent = (
            <div className="cr-table-header__content">
                <div className="cr-title-component"><FormattedMessage id="page.body.trade.header.newOrder" /></div>
            </div>
        );
        return (

            <div className={'pg-order'} ref={this.orderRef}>
                {this.state.width > 448 ? headerContent : undefined}
                <Order
                    asks={asks}
                    bids={bids}
                    disabled={executeLoading}
                    from={from}
                    availableBase={this.getAvailableValue(walletBase)}
                    availableQuote={this.getAvailableValue(walletQuote)}
                    onSubmit={this.handleSubmit}
                    priceMarketBuy={Number((currentTicker || defaultCurrentTicker).last)}
                    priceMarketSell={Number((currentTicker || defaultCurrentTicker).last)}
                    priceLimit={priceLimit}
                    to={to}
                    handleSendType={this.getOrderType}
                    orderTypes={this.getOrderTypes}
                    currentMarketAskPrecision={currentMarket.amount_precision}
                    currentMarketBidPrecision={currentMarket.price_precision}
                    amountText={this.props.intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.amount' })}
                    availableText={this.props.intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.available' })}
                    orderTypeText={this.props.intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.orderType' })}
                    priceText={this.props.intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.price' })}
                    totalText={this.props.intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.total' })}
                    labelFirst={this.props.intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.tabs.buy' })}
                    labelSecond={this.props.intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.tabs.sell' })}
                    submitBuyButtonText={this.props.intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.tabs.buy' })}
                    submitSellButtonText={this.props.intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.tabs.sell' })}
                    width={this.state.width}
                    listenInputPrice={this.listenInputPrice}
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
        this.props.setCurrentPrice();
        const resultData = {
            market: this.props.currentMarket.id,
            side: type,
            volume: amount.toString(),
            ord_type: (orderType as string).toLowerCase(),
        };
        const order = orderType === 'Limit' ? { ...resultData, price: price.toString() } : resultData;
        this.props.orderExecute(order);
    };

    private getWallet(currency: string, wallets: WalletItemProps[]) {
        const currencyLower = currency.toLowerCase();
        return wallets.find(w => w.currency === currencyLower) as Wallet;
    }

    private getOrderType = (index: number, label: string) => {
        this.setState({
            orderSide: label.toLowerCase(),
        });
    }

    private getAvailableValue(wallet: Wallet | undefined) {
        return wallet ? wallet.balance : 0;
    }

    private listenInputPrice = () => {
        this.setState({
            priceLimit: undefined,
        });
        this.props.setCurrentPrice();
    }
}

const mapStateToProps = (state: RootState) => ({
    bids: selectDepthBids(state),
    asks: selectDepthAsks(state),
    currentMarket: selectCurrentMarket(state),
    executeLoading: selectOrderExecuteLoading(state),
    marketTickers: selectMarketTickers(state),
    wallets: selectWallets(state),
    currentPrice: selectCurrentPrice(state),
    userLoggedIn: selectUserLoggedIn(state),
});

const mapDispatchToProps = dispatch => ({
    accountWallets: () => dispatch(walletsFetch()),
    orderExecute: payload => dispatch(orderExecuteFetch(payload)),
    setCurrentPrice: payload => dispatch(setCurrentPrice(payload)),
});

// tslint:disable-next-line no-any
const OrderComponent = injectIntl(connect(mapStateToProps, mapDispatchToProps)(OrderInsert as any)) as any;

export {
    OrderComponent,
};
