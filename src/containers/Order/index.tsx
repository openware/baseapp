/* tslint:disable */
import * as React from 'react';
import { Spinner } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { formatWithSeparators, Order, OrderProps, WalletItemProps, Decimal } from '../../components';
import { FilterPrice } from '../../filters';
import { IntlProps } from '../../';
import {
    alertPush,
    RootState,
    selectCurrentPrice,
    selectDepthAsks,
    selectDepthBids,
    selectMobileDeviceState,
    selectUserLoggedIn,
    selectWallets,
    setCurrentPrice,
    Wallet,
    walletsFetch,
} from '../../modules';
import {
    Market,
    selectCurrentMarket,
    selectCurrentMarketFilters,
    selectMarketTickers,
} from '../../modules/public/markets';
import { orderExecuteFetch, selectOrderExecuteLoading } from '../../modules/user/orders';

interface ReduxProps {
    currentMarket: Market | undefined;
    currentMarketFilters: FilterPrice[];
    executeLoading: boolean;
    marketTickers: {
        [key: string]: {
            last: string;
        };
    };
    bids: string[][];
    asks: string[][];
    wallets: WalletItemProps[];
    currentPrice: number | undefined;
    isMobileDevice: boolean;
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

interface OwnProps {
    userLoggedIn: boolean;
    currentPrice: string;
    defaultTabIndex?: number;
}

type Props = ReduxProps & DispatchProps & OwnProps & IntlProps;

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

    public UNSAFE_componentWillReceiveProps(next: Props) {
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

    public render() {
        const {
            asks,
            bids,
            currentMarket,
            currentMarketFilters,
            defaultTabIndex,
            executeLoading,
            isMobileDevice,
            marketTickers,
            wallets,
        } = this.props;
        const { priceLimit } = this.state;

        if (!currentMarket) {
            return null;
        }

        const walletBase = this.getWallet(currentMarket.base_unit, wallets);
        const walletQuote = this.getWallet(currentMarket.quote_unit, wallets);

        const currentTicker = marketTickers[currentMarket.id];
        const defaultCurrentTicker = { last: '0' };
        const headerContent = (
            <div className="cr-table-header__content">
                <div className="cr-title-component">
                    <FormattedMessage id="page.body.trade.header.newOrder" />
                </div>
            </div>
        );

        return (
            <div className={'pg-order'} ref={this.orderRef}>
                {this.state.width > 448 ? headerContent : undefined}
                <Order
                    asks={asks}
                    bids={bids}
                    disabled={executeLoading}
                    from={currentMarket.quote_unit}
                    availableBase={this.getAvailableValue(walletBase)}
                    availableQuote={this.getAvailableValue(walletQuote)}
                    onSubmit={this.handleSubmit}
                    priceMarketBuy={Number((currentTicker || defaultCurrentTicker).last)}
                    priceMarketSell={Number((currentTicker || defaultCurrentTicker).last)}
                    priceLimit={priceLimit}
                    to={currentMarket.base_unit}
                    handleSendType={this.getOrderType}
                    currentMarketAskPrecision={currentMarket.amount_precision}
                    currentMarketBidPrecision={currentMarket.price_precision}
                    width={this.state.width}
                    listenInputPrice={this.listenInputPrice}
                    defaultTabIndex={defaultTabIndex}
                    currentMarketFilters={currentMarketFilters}
                    isMobileDevice={isMobileDevice}
                    translate={this.translate}
                />
                {executeLoading && (
                    <div className="pg-order--loading">
                        <Spinner animation="border" variant="primary" />
                    </div>
                )}
            </div>
        );
    }

    private handleSubmit = (value: OrderProps) => {
        const { currentMarket } = this.props;

        if (!currentMarket) {
            return;
        }

        const { amount, available, orderType, price, type } = value;

        this.props.setCurrentPrice(0);

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
                message: [
                    this.translate('error.order.create.minAmount', {
                        amount: Decimal.format(currentMarket.min_amount, currentMarket.amount_precision, ','),
                        currency: currentMarket.base_unit.toUpperCase(),
                    }),
                ],
                type: 'error',
            });

            orderAllowed = false;
        }

        if (+price < +currentMarket.min_price) {
            this.props.pushAlert({
                message: [
                    this.translate('error.order.create.minPrice', {
                        price: Decimal.format(currentMarket.min_price, currentMarket.price_precision, ','),
                        currency: currentMarket.quote_unit.toUpperCase(),
                    }),
                ],
                type: 'error',
            });

            orderAllowed = false;
        }

        if (+currentMarket.max_price && +price > +currentMarket.max_price) {
            this.props.pushAlert({
                message: [
                    this.translate('error.order.create.maxPrice', {
                        price: Decimal.format(currentMarket.max_price, currentMarket.price_precision, ','),
                        currency: currentMarket.quote_unit.toUpperCase(),
                    }),
                ],
                type: 'error',
            });

            orderAllowed = false;
        }

        if (
            (+available < +amount * +price && order.side === 'buy') ||
            (+available < +amount && order.side === 'sell')
        ) {
            this.props.pushAlert({
                message: [
                    this.translate('error.order.create.available', {
                        available: formatWithSeparators(String(available), ','),
                        currency:
                            order.side === 'buy'
                                ? currentMarket.quote_unit.toUpperCase()
                                : currentMarket.base_unit.toUpperCase(),
                    }),
                ],
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

        return wallets.find((w) => w.currency === currencyLower) as Wallet;
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
        this.props.setCurrentPrice(0);
    };

    private translate = (id: string, value?: any) => this.props.intl.formatMessage({ id }, { ...value });
}

const mapStateToProps = (state: RootState) => ({
    bids: selectDepthBids(state),
    asks: selectDepthAsks(state),
    currentMarket: selectCurrentMarket(state),
    currentMarketFilters: selectCurrentMarketFilters(state),
    executeLoading: selectOrderExecuteLoading(state),
    marketTickers: selectMarketTickers(state),
    wallets: selectWallets(state),
    currentPrice: selectCurrentPrice(state),
    userLoggedIn: selectUserLoggedIn(state),
    isMobileDevice: selectMobileDeviceState(state),
});

const mapDispatchToProps = (dispatch) => ({
    walletsFetch: () => dispatch(walletsFetch()),
    orderExecute: (payload) => dispatch(orderExecuteFetch(payload)),
    pushAlert: (payload) => dispatch(alertPush(payload)),
    setCurrentPrice: (payload) => dispatch(setCurrentPrice(payload)),
});

// tslint:disable-next-line no-any
const OrderComponent = injectIntl(connect(mapStateToProps, mapDispatchToProps)(OrderInsert as any)) as any;

export { OrderComponent };
