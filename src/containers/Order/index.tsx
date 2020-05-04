/* tslint:disable */
import * as React from 'react';
import { Spinner } from 'react-bootstrap';
import {
    FormattedMessage,
    InjectedIntlProps,
    injectIntl,
} from 'react-intl';
import { connect } from 'react-redux';
import { Order, OrderProps, WalletItemProps } from '../../components';
import {
    alertPush,
    RootState,
    selectCurrentPrice,
    selectDepthAsks,
    selectDepthBids,
    selectUserLoggedIn,
    selectWallets,
    setCurrentPrice,
    Wallet,
    walletsFetch,
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
    walletsFetch: typeof walletsFetch;
    setCurrentPrice: typeof setCurrentPrice;
    orderExecute: typeof orderExecuteFetch;
    pushAlert: typeof alertPush;
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

    public componentDidMount() {
        if (!this.props.wallets.length) {
            this.props.walletsFetch();
        }
    }

    public componentDidUpdate() {
        if (this.orderRef.current && this.state.width !== this.orderRef.current.clientWidth) {
            this.setState({
                width: this.orderRef.current.clientWidth,
            });
        }
    }

    public componentWillReceiveProps(next: Props) {
        const { userLoggedIn } = this.props;

        if (userLoggedIn && !next.wallets.length) {
            this.props.walletsFetch();
        }

        if (+next.currentPrice && next.currentPrice !== this.state.priceLimit) {
            this.setState({
                priceLimit: +next.currentPrice,
            });
        }
    }

    public getListOfTranslations = () => {
        return {
            amountText: this.props.intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.amount' }),
            availableText: this.props.intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.available' }),
            orderTypeText: this.props.intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.orderType' }),
            priceText: this.props.intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.price' }),
            totalText: this.props.intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.total' }),
            labelFirst: this.props.intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.tabs.buy' }),
            labelSecond: this.props.intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.tabs.sell' }),
            submitBuyButtonText: this.props.intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.tabs.buy' }),
            submitSellButtonText: this.props.intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.tabs.sell' }),
        };
    };

    public render() {
        const { executeLoading, marketTickers, currentMarket, wallets, asks, bids } = this.props;
        if (!currentMarket) {
            return null;
        }
        const { priceLimit } = this.state;

        const walletBase = this.getWallet(currentMarket.base_unit, wallets);
        const walletQuote = this.getWallet(currentMarket.quote_unit, wallets);

        const currentTicker = marketTickers[currentMarket.id];
        const defaultCurrentTicker = { last: '0' };
        const headerContent = (
            <div className="cr-table-header__content">
                <div className="cr-title-component"><FormattedMessage id="page.body.trade.header.newOrder" /></div>
            </div>
        );

        const translations = this.getListOfTranslations();
        return (
            <div className={'pg-order'} ref={this.orderRef}>
                {this.state.width > 448 ? headerContent : undefined}
                <Order
                    asks={asks}
                    bids={bids}
                    disabled={executeLoading}
                    currentMarket={currentMarket}
                    availableBase={this.getAvailableValue(walletBase)}
                    availableQuote={this.getAvailableValue(walletQuote)}
                    onSubmit={this.handleSubmit}
                    priceMarketBuy={Number((currentTicker || defaultCurrentTicker).last)}
                    priceMarketSell={Number((currentTicker || defaultCurrentTicker).last)}
                    priceLimit={priceLimit}
                    handleSendType={this.getOrderType}
                    orderTypes={this.getOrderTypes}
                    width={this.state.width}
                    listenInputPrice={this.listenInputPrice}
                    {...translations}
                />
                {executeLoading && <div className="pg-order--loading"><Spinner animation="border" variant="primary" /></div>}
            </div>
        );
    }

    private handleSubmit = (value: OrderProps) => {
        const { currentMarket } = this.props;

        if (!currentMarket) {
            return;
        }

        const {
            amount,
            available,
            orderType,
            price,
            type,
        } = value;

        this.props.setCurrentPrice();

        const resultData = {
            market: currentMarket.id,
            side: type,
            volume: amount.toString(),
            ord_type: (orderType as string).toLowerCase(),
        };

        const order = orderType === 'Limit' ? { ...resultData, price: price.toString() } : resultData;
        let orderAllowed = true;

        if (+resultData.volume < +currentMarket.min_amount) {
            this.props.pushAlert({
                message: [this.props.intl.formatMessage(
                    { id: 'error.order.create.minAmount' },
                    { amount: currentMarket.min_amount, currency: currentMarket.base_unit.toUpperCase()},
                )],
                type: 'error',
            });

            orderAllowed = false;
        }

        if (+price < +currentMarket.min_price) {
            this.props.pushAlert({
                message: [this.props.intl.formatMessage(
                    { id: 'error.order.create.minPrice' },
                    { price: currentMarket.min_price, currency: currentMarket.quote_unit.toUpperCase()},
                )],
                type: 'error',
            });

            orderAllowed = false;
        }

        if (+currentMarket.max_price && +price > +currentMarket.max_price) {
            this.props.pushAlert({
                message: [this.props.intl.formatMessage(
                    { id: 'error.order.create.maxPrice' },
                    { price: currentMarket.max_price, currency: currentMarket.quote_unit.toUpperCase()},
                )],
                type: 'error',
            });

            orderAllowed = false;
        }

        if ((+available < (+amount * +price) && order.side === 'buy') ||
            (+available < +amount && order.side === 'sell')) {
            this.props.pushAlert({
                message: [this.props.intl.formatMessage(
                    { id: 'error.order.create.available' },
                    { available: available, currency: order.side === 'buy' ?
                        currentMarket.quote_unit.toUpperCase() :
                        currentMarket.base_unit.toUpperCase(),
                    },
                )],
                type: 'error',
            });

            orderAllowed = false;
        }

        if (orderAllowed) {
            this.props.orderExecute(order);
        }
    };

    private getWallet(currency: string, wallets: WalletItemProps[]) {
        const currencyLower = currency.toLowerCase();

        return wallets.find(w => w.currency === currencyLower) as Wallet;
    }

    private getOrderType = (index: number, label: string) => {
        this.setState({
            orderSide: label.toLowerCase(),
        });
    };

    private getAvailableValue(wallet: Wallet | undefined) {
        return wallet && wallet.balance ? Number(wallet.balance) : 0;
    }

    private listenInputPrice = () => {
        this.setState({
            priceLimit: undefined,
        });
        this.props.setCurrentPrice();
    };
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
    walletsFetch: () => dispatch(walletsFetch()),
    orderExecute: payload => dispatch(orderExecuteFetch(payload)),
    pushAlert: payload => dispatch(alertPush(payload)),
    setCurrentPrice: payload => dispatch(setCurrentPrice(payload)),
});

// tslint:disable-next-line no-any
const OrderComponent = injectIntl(connect(mapStateToProps, mapDispatchToProps)(OrderInsert as any)) as any;

export {
    OrderComponent,
};
