import { Grid } from '@openware/components';
import * as React from 'react';
import {
    InjectedIntlProps,
    injectIntl,
    intlShape,
} from 'react-intl';
import {connect, MapDispatchToPropsFunction, MapStateToProps} from 'react-redux';
import {
    Asks,
    Bids,
    MarketDepthsComponent,
    MarketsComponent,
    OpenOrdersComponent,
    OrderComponent,
    RecentTrades,
    TradingChart,
} from '../components';
import {
  RootState,
  selectCurrentMarket,
  selectUserInfo,
  selectUserLoggedIn,
  setCurrentPrice,
  User,
} from '../modules';
import { Market, marketsFetch, selectMarkets } from '../modules/markets';
import { depthFetch } from '../modules/orderBook';
import { rangerConnectFetch, RangerConnectFetch } from '../modules/ranger';
import { RangerState } from '../modules/ranger/reducer';
import { selectRanger } from '../modules/ranger/selectors';
import { selectWallets, Wallet, walletsFetch } from '../modules/wallets';

const breakpoints = {
    lg: 1200,
    md: 996,
    sm: 768,
    xs: 480,
    xxs: 0,
};

const cols = {
    lg: 24,
    md: 24,
    sm: 12,
    xs: 12,
    xxs: 12,
};

const layouts = {
    lg: [
        { x: 16, y: 0, w: 4, h: 14, i: '0', minH: 12, minW: 2 },
        { x: 16, y: 12, w: 8, h: 20, i: '1', minH: 18, minW: 4 },
        { x: 0, y: 0, w: 16, h: 39, i: '2', minH: 12, minW: 5 },
        { x: 16, y: 11, w: 4, h: 14, i: '3', minH: 8, minW: 3 },
        { x: 20, y: 11, w: 4, h: 14, i: '4', minH: 8, minW: 3 },
        { x: 16, y: 38, w: 8, h: 13, i: '5', minH: 12, minW: 5 },
        { x: 0, y: 40, w: 16, h: 22, i: '6', minH: 8, minW: 5 },
        { x: 26, y: 0, w: 4, h: 14, i: '7', minH: 8, minW: 4 },
    ],
    md: [
        { x: 0, y: 0, w: 4, h: 12, i: '0', minH: 12, minW: 2 },
        { x: 2, y: 13, w: 8, h: 18, i: '1', minH: 16, minW: 4 },
        { x: 5, y: 0, w: 19, h: 30, i: '2', minH: 12, minW: 5 },
        { x: 0, y: 12, w: 4, h: 12, i: '3', minH: 8, minW: 3 },
        { x: 4, y: 12, w: 4, h: 12, i: '4', minH: 8, minW: 3 },
        { x: 0, y: 10, w: 8, h: 11, i: '5', minH: 8, minW: 4 },
        { x: 8, y: 0, w: 19, h: 20, i: '6', minH: 6, minW: 5 },
        { x: 0, y: 0, w: 4, h: 12, i: '7', minH: 8, minW: 2 },
    ],
    sm: [
        {
            x: 0,
            y: 0,
            w: 12,
            h: 15,
            i: '0',
            minH: 15,
            minW: 4,
            draggable: false,
            resizable: false,
        },
        {
            x: 0,
            y: 12,
            w: 12,
            h: 24,
            i: '1',
            minH: 24,
            minW: 5,
            draggable: false,
            resizable: false,
        },
        {
            x: 0,
            y: 30,
            w: 12,
            h: 30,
            i: '2',
            minH: 30,
            minW: 5,
            draggable: false,
            resizable: false,
        },
        {
            x: 0,
            y: 60,
            w: 12,
            h: 12,
            i: '3',
            minH: 12,
            minW: 3,
            draggable: false,
            resizable: false,
        },
        {
            x: 0,
            y: 72,
            w: 12,
            h: 12,
            i: '4',
            minH: 12,
            minW: 3,
            draggable: false,
            resizable: false,
        },
        {
            x: 0,
            y: 72,
            w: 12,
            h: 20,
            i: '5',
            minH: 12,
            minW: 7,
            draggable: false,
            resizable: false,
        },
        {
            x: 0,
            y: 72,
            w: 12,
            h: 12,
            i: '6',
            minH: 12,
            minW: 7,
            draggable: false,
            resizable: false,
        },
        {
            x: 30,
            y: 0,
            w: 6,
            h: 15,
            i: '7',
            minH: 10,
            minW: 6,
            draggable: false,
            resizable: false,
        },
    ],
};

const handleLayoutChange = () => {
    return;
};

interface ReduxProps {
    currentMarket: Market | undefined;
    markets: Market[];
    wallets: Wallet [];
    user: User;
    rangerState: RangerState;
    userLoggedIn: boolean;
}

interface DispatchProps {
    depthFetch: typeof depthFetch;
    marketsFetch: typeof marketsFetch;
    accountWallets: typeof walletsFetch;
    rangerConnect: typeof rangerConnectFetch;
    setCurrentPrice: typeof setCurrentPrice;
}

interface StateProps {
    orderComponentResized: number;
}

type Props = DispatchProps & ReduxProps & InjectedIntlProps & StateProps;

class Trading extends React.Component<Props, StateProps> {
    //tslint:disable-next-line:no-any
    public static propsTypes: React.ValidationMap<any> = {
        intl: intlShape.isRequired,
    };

    public readonly state = {
        orderComponentResized: 5,
    };

    private gridItems = [
        {
            i: 0,
            render: () => <MarketsComponent />,
        },
        {
            i: 1,
            render: () => <OrderComponent size={this.state.orderComponentResized} />,
        },
        {
            i: 2,
            render: () => <TradingChart />,
        },
        {
            i: 3,
            render: () => <Bids />,
        },
        {
            i: 4,
            render: () => <Asks />,
        },
        {
            i: 5,
            render: () => <MarketDepthsComponent />,
        },
        {
            i: 6,
            render: () => <OpenOrdersComponent/>,
        },
        {
            i: 7,
            render: () => <RecentTrades/>,
        },
    ];

    public async componentDidMount() {
        const { wallets, markets, currentMarket, userLoggedIn, rangerState: { connected } } = this.props;

        if (markets.length < 1) {
            this.props.marketsFetch();
        }
        if (!wallets || wallets.length === 0) {
            this.props.accountWallets();
        }
        if (currentMarket) {
            this.props.depthFetch(currentMarket);
        }
        if (!connected) {
            this.props.rangerConnect({ withAuth: userLoggedIn });
        }
    }

    public componentWillUnmount() {
        this.props.setCurrentPrice('');
    }

    public componentWillReceiveProps(nextProps) {
        const { userLoggedIn } = this.props;
        if (userLoggedIn !== nextProps.userLoggedIn) {
            this.props.rangerConnect({ withAuth: nextProps.userLoggedIn });
        }
        if (nextProps.currentMarket && this.props.currentMarket !== nextProps.currentMarket) {
            this.props.depthFetch(nextProps.currentMarket);
        }
    }

    public translate = (e: string) => {
        return this.props.intl.formatMessage({id: e});
    };

    public render() {
        const rowHeight = 14;
        const allGridItems = [...this.gridItems];

        return (
            <div className={'pg-trading-screen'}>
                <div className={'pg-trading-wrap'}>
                    <Grid
                        breakpoints={breakpoints}
                        className="layout"
                        children={allGridItems}
                        cols={cols}
                        draggableHandle=".cr-table-header__content, .pg-trading-screen__tab-panel, .draggable-container"
                        layouts={layouts}
                        rowHeight={rowHeight}
                        onLayoutChange={handleLayoutChange}
                        handleResize={this.handleResize}
                    />
                </div>
            </div>
        );
    }

    private handleResize = (layout, oldItem, newItem,
                            placeholder, e, element) => {
        if (oldItem.i === '1') {
            this.setState({
                orderComponentResized: newItem.w,
            });
        }
    }
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    currentMarket: selectCurrentMarket(state),
    markets: selectMarkets(state),
    wallets: selectWallets(state),
    user: selectUserInfo(state),
    rangerState: selectRanger(state),
    userLoggedIn: selectUserLoggedIn(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    marketsFetch: () => dispatch(marketsFetch()),
    depthFetch: payload => dispatch(depthFetch(payload)),
    accountWallets: () => dispatch(walletsFetch()),
    rangerConnect: (payload: RangerConnectFetch['payload']) => dispatch(rangerConnectFetch(payload)),
    setCurrentPrice: payload => dispatch(setCurrentPrice(payload)),
});

const TradingScreen = injectIntl(connect(mapStateToProps, mapDispatchToProps)(Trading));

export {
    TradingScreen,
};
