/* tslint:disable */
import * as React from 'react';
import { Spinner } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { TRIGGER_BUY_PRICE_MULT, TRIGGER_BUY_PRICE_ADJUSTED_TYPES } from '../../constants'
import {
    formatWithSeparators,
    Order,
    OrderProps,
    Decimal,
    LockedComponent,
} from '../../components';
import { FilterPrice } from '../../filters';
import { IntlProps } from '../../';
import {
    alertPush,
    MemberLevels,
    memberLevelsFetch,
    RootState,
    selectCurrentPrice,
    selectDepthAsks,
    selectDepthBids,
    selectMemberLevels,
    selectMobileDeviceState,
    selectUserInfo,
    selectUserLoggedIn,
    selectWallets,
    setCurrentPrice,
    User,
    Wallet,
    walletsFetch,
} from '../../modules';
import {
    Market,
    selectCurrentMarket,
    selectCurrentMarketFilters,
    selectMarketTickers,
} from '../../modules/public/markets';
import {
    orderExecuteFetch,
    selectOrderExecuteLoading,
} from '../../modules/user/orders';

interface ReduxProps {
    currentMarket?: Market;
    currentMarketFilters: FilterPrice[];
    executeLoading: boolean;
    marketTickers: {
        [key: string]: {
            last: string;
        },
    };
    bids: string[][];
    asks: string[][];
    wallets: Wallet[];
    currentPrice?: number;
    isMobileDevice: boolean;
    memberLevels: MemberLevels;
    user: User;
    userLoggedIn: boolean;
}

interface StoreProps {
    orderSide: string;
    priceLimit: number | null;
    trigger: number | null;
    width: number;
}

interface DispatchProps {
    walletsFetch: typeof walletsFetch;
    memberLevelsFetch: typeof memberLevelsFetch;
    setCurrentPrice: typeof setCurrentPrice;
    orderExecute: typeof orderExecuteFetch;
    pushAlert: typeof alertPush;
}

interface OwnProps {
    defaultTabIndex?: number;
}

type Props = ReduxProps & DispatchProps & OwnProps & IntlProps;

class OrderInsert extends React.PureComponent<Props, StoreProps> {
    constructor(props: Props) {
        super(props);

        this.state = {
            orderSide: 'buy',
            priceLimit: null,
            trigger: null,
            width: 0,
        };

        this.orderRef = React.createRef();
    }

    private orderRef;

    public componentDidMount() {
        if (!this.props.wallets.length) {
            this.props.walletsFetch();
        }

        if (!this.props.memberLevels) {
            this.props.memberLevelsFetch();
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
                trigger: +next.currentPrice,
            });
        }
    }

    public getContent = () => {
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
            user,
            memberLevels,
            userLoggedIn,
        } = this.props;
        const { priceLimit, trigger } = this.state;

        const walletBase = this.getWallet(currentMarket.base_unit, wallets);
        const walletQuote = this.getWallet(currentMarket.quote_unit, wallets);

        const currentTicker = marketTickers[currentMarket.id];
        const defaultCurrentTicker = { last: '0' };

        const allowed = memberLevels && (user.level >= memberLevels.trading.minimum_level);

        if (!userLoggedIn) {
            return (
                <LockedComponent
                    text={this.translate('page.body.trade.header.newOrder.locked.login.text')}
                    link={'/signin'}
                    buttonText={this.translate('page.body.trade.header.newOrder.locked.login.buttonText')}
                />
            );
        } else if (!allowed) {
            return (
                <LockedComponent
                    text={this.translate('page.body.trade.header.newOrder.locked.minLevel.text')}
                    link={'/profile'}
                    buttonText={this.translate('page.body.trade.header.newOrder.locked.minLevel.buttonText')}
                />
            );
        } else {
            return (
                <Order
                    asks={asks}
                    bids={bids}
                    disabled={executeLoading}
                    marketId={currentMarket.id}
                    from={currentMarket.quote_unit}
                    availableBase={this.getAvailableValue(walletBase)}
                    availableQuote={this.getAvailableValue(walletQuote)}
                    onSubmit={this.handleSubmit}
                    priceMarketBuy={Number((currentTicker || defaultCurrentTicker).last)}
                    priceMarketSell={Number((currentTicker || defaultCurrentTicker).last)}
                    priceLimit={priceLimit}
                    trigger={trigger}
                    to={currentMarket.base_unit}
                    handleSendType={this.getOrderType}
                    currentMarketAskPrecision={currentMarket.amount_precision}
                    currentMarketBidPrecision={currentMarket.price_precision}
                    orderTypes={this.formattedOrderTypes()}
                    width={this.state.width}
                    listenInputPrice={this.listenInputPrice}
                    listenInputTrigger={this.listenInputTrigger}
                    defaultTabIndex={defaultTabIndex}
                    currentMarketFilters={currentMarketFilters}
                    isMobileDevice={isMobileDevice}
                    translate={this.translate}
                />
            );
        }
    }

    public render() {
        const { currentMarket, executeLoading } = this.props;

        if (!currentMarket) {
            return null;
        }

        return (
            <div className={'pg-order'} ref={this.orderRef}>
                <div className="cr-table-header__content">
                    <div className="cr-title-component">{this.translate("page.body.trade.header.newOrder")}</div>
                </div>
                {this.getContent()}
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
            trigger,
            type,
        } = value;

        this.props.setCurrentPrice(0);

        const withPrice = typeof price !== 'undefined';
        const withTrigger = typeof trigger !== 'undefined';
        const actualOrderPrice = withPrice ? price : trigger;
        const priceMult = TRIGGER_BUY_PRICE_ADJUSTED_TYPES.includes((orderType as string).toLowerCase()) ? TRIGGER_BUY_PRICE_MULT : 1;

        const resultData = {
            market: currentMarket.id,
            side: type,
            volume: amount.toString(),
            ord_type: (orderType as string).toLowerCase().replace('-', '_'),
            ...(withPrice && { price: price.toString() }),
            ...(withTrigger && { trigger_price: trigger.toString() }),
        };

        let orderAllowed = true;

        if (+resultData.volume < +currentMarket.min_amount) {
            this.props.pushAlert({
                message: [this.translate(
                    'error.order.create.minAmount',
                    {
                        amount: Decimal.format(currentMarket.min_amount, currentMarket.amount_precision, ',' ),
                        currency: currentMarket.base_unit.toUpperCase(),
                    },
                )],
                type: 'error',
            });

            orderAllowed = false;
        }

        if (withPrice && +price < +currentMarket.min_price) {
            this.props.pushAlert({
                message: [this.translate(
                    'error.order.create.minPrice',
                    {
                        price: Decimal.format(currentMarket.min_price, currentMarket.price_precision, ','),
                        currency: currentMarket.quote_unit.toUpperCase(),
                    },
                )],
                type: 'error',
            });

            orderAllowed = false;
        }

        if (withTrigger && +trigger < +currentMarket.min_price) {
            this.props.pushAlert({
                message: [this.translate(
                    'error.order.create.minTriggerPrice',
                    {
                        price: Decimal.format(currentMarket.min_price, currentMarket.price_precision, ','),
                        currency: currentMarket.quote_unit.toUpperCase(),
                    },
                )],
                type: 'error',
            });

            orderAllowed = false;
        }

        if (+currentMarket.max_price && withPrice && +price > +currentMarket.max_price) {
            this.props.pushAlert({
                message: [this.translate(
                    'error.order.create.maxPrice',
                    {
                        price: Decimal.format(currentMarket.max_price, currentMarket.price_precision, ','),
                        currency: currentMarket.quote_unit.toUpperCase(),
                    },
                )],
                type: 'error',
            });

            orderAllowed = false;
        }

        // if both price and trigger is defined then Order will be created with Price value no matter if trigger is bigger than max price
        if (+currentMarket.max_price && withTrigger && !withPrice && +trigger > +currentMarket.max_price) {
            this.props.pushAlert({
                message: [this.translate(
                    'error.order.create.maxTriggerPrice',
                    {
                        price: Decimal.format(currentMarket.max_price, currentMarket.price_precision, ','),
                        currency: currentMarket.quote_unit.toUpperCase(),
                    },
                )],
                type: 'error',
            });

            orderAllowed = false;
        }

        if ((+available < (+amount * +actualOrderPrice * priceMult) && resultData.side === 'buy') ||
            (+available < +amount && resultData.side === 'sell')) {
            this.props.pushAlert({
                message: [this.translate(
                    'error.order.create.available',
                    {
                        available: formatWithSeparators(String(available), ','),
                        currency: resultData.side === 'buy' ? (
                            currentMarket.quote_unit.toUpperCase()
                        ) : (
                            currentMarket.base_unit.toUpperCase()
                        ),
                    },
                )],
                type: 'error',
            });

            orderAllowed = false;
        }

        if (orderAllowed) {
            this.props.orderExecute(resultData);
        }
    };

    private getWallet(currency: string, wallets: Wallet[]) {
        const currencyLower = currency.toLowerCase();

        return wallets.find(w => w.currency === currencyLower) as Wallet;
    }

    private formattedOrderTypes = () => this.props.currentMarket?.features?.order_types.filter(ot => ot !== 'fok').map(ot => {
        const result = ot.substring(0, 1)?.toUpperCase() + ot.substring(1);
        return result.replace('_', '-');
    });

    private getOrderType = (index: number, label: string) => {
        this.setState({
            orderSide: label.toLowerCase(),
        });
    };

    private getAvailableValue(wallet?: Wallet) {
        return wallet && wallet.balance ? Number(wallet.balance) : 0;
    }

    private listenInputPrice = () => {
        this.setState({
            priceLimit: null,
        });
        this.props.setCurrentPrice(0);
    };

    private listenInputTrigger = () => {
        this.setState({
            trigger: null,
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
    memberLevels: selectMemberLevels(state),
    user: selectUserInfo(state),
});

const mapDispatchToProps = dispatch => ({
    walletsFetch: () => dispatch(walletsFetch()),
    memberLevelsFetch: () => dispatch(memberLevelsFetch()),
    orderExecute: payload => dispatch(orderExecuteFetch(payload)),
    pushAlert: payload => dispatch(alertPush(payload)),
    setCurrentPrice: payload => dispatch(setCurrentPrice(payload)),
});

// tslint:disable-next-line no-any
const OrderComponent = injectIntl(connect(mapStateToProps, mapDispatchToProps)(OrderInsert as any)) as any;

export {
    OrderComponent,
};
