import { Grid } from '@openware/components';
import * as React from 'react';
import { connect, MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
    MarketDepthsComponent,
    OpenOrdersComponent,
    OrderBook,
    OrderComponent,
    RecentTrades,
    ToolBar,
    TradingChart,
} from '../../containers';
import { getUrlPart, setDocumentTitle } from '../../helpers';
import {
    RootState,
    selectCurrentMarket,
    selectUserInfo,
    selectUserLoggedIn,
    setCurrentMarket,
    setCurrentPrice,
    User,
} from '../../modules';
import { Market, marketsFetch, selectMarkets } from '../../modules/public/markets';
import { depthFetch } from '../../modules/public/orderBook';
import { rangerConnectFetch, RangerConnectFetch } from '../../modules/public/ranger';
import { RangerState } from '../../modules/public/ranger/reducer';
import { selectRanger } from '../../modules/public/ranger/selectors';
import { selectWallets, Wallet, walletsFetch } from '../../modules/user/wallets';

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
        { x: 16, y: 18, w: 8, h: 21, i: '1', minH: 21, maxH: 21, minW: 4 },
        { x: 0, y: 0, w: 16, h: 39, i: '2', minH: 12, minW: 5 },
        { x: 16, y: 0, w: 4, h: 28, i: '3', minH: 20, minW: 4 },
        { x: 16, y: 38, w: 8, h: 13, i: '4', minH: 12, minW: 5 },
        { x: 0, y: 40, w: 16, h: 23, i: '5', minH: 8, minW: 5 },
        { x: 26, y: 11, w: 4, h: 28, i: '6', minH: 8, minW: 4 },
    ],
    md: [
        { x: 14, y: 30, w: 10, h: 21, i: '1', minH: 21, maxH: 21, minW: 4 },
        { x: 0, y: 0, w: 18, h: 30, i: '2', minH: 12, minW: 5 },
        { x: 0, y: 30, w: 14, h: 13, i: '3', minH: 8, minW: 3 },
        { x: 14, y: 42, w: 10, h: 12, i: '4', minH: 8, minW: 4 },
        { x: 0, y: 42, w: 14, h: 20, i: '5', minH: 6, minW: 5 },
        { x: 18, y: 12, w: 6, h: 30, i: '6', minH: 8, minW: 2 },
    ],
    sm: [
        { x: 0, y: 12, w: 12, h: 22, i: '1', minH: 22, maxH: 22, minW: 5, draggable: false, resizable: false },
        { x: 0, y: 28, w: 12, h: 30, i: '2', minH: 30, minW: 5, draggable: false, resizable: false },
        { x: 0, y: 58, w: 12, h: 18, i: '3', minH: 12, minW: 3, draggable: false, resizable: false },
        { x: 0, y: 94, w: 12, h: 12, i: '4', minH: 12, minW: 7, draggable: false, resizable: false },
        { x: 0, y: 82, w: 12, h: 20, i: '5', minH: 12, minW: 7, draggable: false, resizable: false },
        { x: 30, y: 0, w: 12, h: 16, i: '6', minH: 10, minW: 6, draggable: false, resizable: false },
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
    setCurrentMarket: typeof setCurrentMarket;
}

interface StateProps {
    orderComponentResized: number;
    orderBookComponentResized: number;
}

type Props = DispatchProps & ReduxProps & RouteComponentProps;

class Trading extends React.Component<Props, StateProps> {
    public readonly state = {
        orderComponentResized: 5,
        orderBookComponentResized: 5,
    };

    private gridItems = [
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
            render: () => <OrderBook size={this.state.orderBookComponentResized} />,
        },
        {
            i: 4,
            render: () => <MarketDepthsComponent />,
        },
        {
            i: 5,
            render: () => <OpenOrdersComponent/>,
        },
        {
            i: 6,
            render: () => <RecentTrades/>,
        },
    ];

    public componentDidMount() {
        setDocumentTitle('Trading');
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
        if (!userLoggedIn && currentMarket) {
            this.props.history.replace(`/trading/${currentMarket.id}`);
        }
    }

    public componentWillUnmount() {
        this.props.setCurrentPrice('');
    }

    public componentWillReceiveProps(nextProps) {
        const { userLoggedIn, history, markets, currentMarket } = this.props;
        if (userLoggedIn !== nextProps.userLoggedIn) {
            this.props.rangerConnect({ withAuth: nextProps.userLoggedIn });
        }
        if (markets.length !== nextProps.markets.length) {
            this.setMarketFromUrlIfExists(nextProps.markets);
        }
        if (nextProps.currentMarket && currentMarket !== nextProps.currentMarket) {
            history.replace(`/trading/${nextProps.currentMarket.id}`);
            this.props.depthFetch(nextProps.currentMarket);
        }
    }

    public render() {
        const rowHeight = 14;
        const allGridItems = [...this.gridItems];

        return (
            <div className={'pg-trading-screen'}>
                <div className={'pg-trading-wrap'}>
                    <ToolBar/>
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

    private setMarketFromUrlIfExists = (markets: Market[]): void => {
        const urlMarket: string = getUrlPart(2, window.location.pathname);
        const market: Market | undefined = markets.find(item => item.id === urlMarket);
        // if part is existed market, set it as currentMarket, else select first one
        if (market) {
            this.props.setCurrentMarket(market);
        }
    };

    private handleResize = (layout, oldItem, newItem) => {
        switch (oldItem.i) {
            case '1':
                this.setState({
                    orderComponentResized: newItem.w,
                });
                break;
            case '3':
                this.setState({
                    orderBookComponentResized: newItem.w,
                });
                break;
            default:
                break;
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
    setCurrentMarket: payload => dispatch(setCurrentMarket(payload)),
});

// tslint:disable-next-line no-any
const TradingScreen = withRouter(connect(mapStateToProps, mapDispatchToProps)(Trading) as any);

export {
    TradingScreen,
};
