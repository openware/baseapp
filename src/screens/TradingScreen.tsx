import { Grid, TabPanel } from '@openware/components';
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
  selectUserInfo,
  selectUserLoggedIn,
  setCurrentPrice,
  User,
} from '../modules';
import { Market, marketsFetch, selectMarkets } from '../modules/markets';
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
        { x: 0, y: 0, w: 4, h: 24, i: '0', minH: 12, minW: 4 },
        { x: 4, y: 0, w: 4, h: 24, i: '1', minH: 18, minW: 4 },
        { x: 8, y: 0, w: 16, h: 39, i: '2', minH: 12, minW: 5 },
        { x: 0, y: 39, w: 4, h: 24, i: '3', minH: 10, minW: 3 },
        { x: 4, y: 39, w: 4, h: 24, i: '4', minH: 10, minW: 3 },
        { x: 0, y: 6, w: 8, h: 15, i: '5', minH: 10, minW: 5 },
        { x: 8, y: 72, w: 16, h: 24, i: '6', minH: 23, minW: 5 },
    ],
    md: [
        { x: 0, y: 0, w: 5, h: 12, i: '0', minH: 12, minW: 4 },
        { x: 0, y: 10, w: 5, h: 18, i: '1', minH: 18, minW: 4 },
        { x: 5, y: 0, w: 19, h: 30, i: '2', minH: 12, minW: 5 },
        { x: 0, y: 24, w: 5, h: 12, i: '3', minH: 10, minW: 3 },
        { x: 5, y: 12, w: 5, h: 12, i: '4', minH: 10, minW: 3 },
        { x: 0, y: 24, w: 10, h: 24, i: '5', minH: 10, minW: 5 },
        { x: 10, y: 0, w: 14, h: 36, i: '6', minH: 8, minW: 5 },
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
            y: 106,
            w: 12,
            h: 12,
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
    ],
};

const handleLayoutChange = () => {
    return;
};

interface ReduxProps {
    markets: Market[];
    wallets: Wallet [];
    user: User;
    rangerState: RangerState;
    userLoggedIn: boolean;
}

interface DispatchProps {
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
    ];

    public async componentDidMount() {
        const { wallets, markets, userLoggedIn, rangerState: { connected } } = this.props;

        if (markets.length < 1) {
            this.props.marketsFetch();
        }
        if (!wallets || wallets.length === 0) {
            this.props.accountWallets();
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
    }

    public translate = (e: string) => {
        return this.props.intl.formatMessage({id: e});
    };

    public renderTabs = () => {
        return [
            {
              content: <RecentTrades/>,
              label: this.translate('page.body.trade.header.recentTrades'),
            },
            {
                content: <OpenOrdersComponent/>,
                label: this.translate('page.body.trade.header.openOrders'),
            },
        ];
    };

    public renderTrades() {
      if (this.props.user.uid) {
        return (
          <div className="pg-trading-screen__tab-panel"><TabPanel  panels={this.renderTabs()} /></div>
        );
      } else {
        return (
          <React.Fragment>
            <div className="cr-table-header__content">
                <div className={'pg-market-depth__title'}>
                      {this.translate('page.body.trade.header.recentTrades')}
                </div>
              </div>
            <RecentTrades/>
          </React.Fragment>
        );
      }
    }
    public render() {
        const rowHeight = 12;
        const allGridItems = [...this.gridItems, {i: 6, render: () => this.renderTrades()}];

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
    markets: selectMarkets(state),
    wallets: selectWallets(state),
    user: selectUserInfo(state),
    rangerState: selectRanger(state),
    userLoggedIn: selectUserLoggedIn(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    marketsFetch: () => dispatch(marketsFetch()),
    accountWallets: () => dispatch(walletsFetch()),
    rangerConnect: (payload: RangerConnectFetch['payload']) => dispatch(rangerConnectFetch(payload)),
    setCurrentPrice: payload => dispatch(setCurrentPrice(payload)),
});

const TradingScreen = injectIntl(connect(mapStateToProps, mapDispatchToProps)(Trading));

export {
    TradingScreen,
};
