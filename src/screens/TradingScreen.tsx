import { Grid } from '@openware/components';
import * as React from 'react';
import {connect, MapDispatchToPropsFunction, MapStateToProps} from 'react-redux';
import {
    Asks,
    Bids,
    HistoryComponent,
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
  User,
} from '../modules';
import { Market, selectCurrentMarket } from '../modules/markets';
import { depthFetch } from '../modules/orderBook';
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
        { x: 15, y: 12, w: 9, h: 12, i: '5', minH: 10, minW: 4 },
        { x: 15, y: 25, w: 9, h: 12, i: '6', minH: 10, minW: 5 },
        { x: 0, y: 6, w: 8, h: 15, i: '7', minH: 10, minW: 5 },
        { x: 8, y: 72, w: 7, h: 24, i: '8', minH: 23, minW: 5 },
    ],
    md: [
        { x: 0, y: 0, w: 5, h: 12, i: '0', minH: 12, minW: 4 },
        { x: 0, y: 10, w: 5, h: 18, i: '1', minH: 18, minW: 4 },
        { x: 5, y: 0, w: 19, h: 30, i: '2', minH: 12, minW: 5 },
        { x: 0, y: 24, w: 5, h: 12, i: '3', minH: 10, minW: 3 },
        { x: 5, y: 12, w: 5, h: 12, i: '4', minH: 10, minW: 3 },
        { x: 10, y: 12, w: 8, h: 12, i: '5', minH: 10, minW: 4 },
        { x: 18, y: 12, w: 6, h: 12, i: '6', minH: 10, minW: 5 },
        { x: 0, y: 24, w: 10, h: 24, i: '7', minH: 10, minW: 5 },
        { x: 0, y: 72, w: 6, h: 8, i: '8', minH: 8, minW: 5 },
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
            y: 84,
            w: 12,
            h: 12,
            i: '5',
            minH: 12,
            minW: 5,
            draggable: false,
            resizable: false,
        },
        {
            x: 0,
            y: 96,
            w: 12,
            h: 12,
            i: '6',
            minH: 12,
            minW: 5,
            draggable: false,
            resizable: false,
        },
        {
            x: 0,
            y: 106,
            w: 12,
            h: 12,
            i: '7',
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
            i: '8',
            minH: 12,
            minW: 7,
            draggable: false,
            resizable: false,
        },
    ],
};

const gridItems = [
    {
        i: 0,
        render: () => <MarketsComponent />,
    },
    {
        i: 1,
        render: () => <OrderComponent />,
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
        render: () => <HistoryComponent />,
    },
    {
        i: 6,
        render: () => <OpenOrdersComponent />,
    },
    {
        i: 7,
        render: () => <MarketDepthsComponent />,
    },
    {
        i: 8,
        render: () => <RecentTrades/>,
    },
];

const handleLayoutChange = () => {
    return;
};
// tslint:disable
interface ReduxProps {
    currentMarket: Market,
    wallets: Wallet [];
    user: User;
}

interface DispatchProps {
    accountWallets: typeof walletsFetch;
    depthFetch: typeof depthFetch;
}

type Props = DispatchProps & ReduxProps;

class Trading extends React.Component<Props> {
    public async componentDidMount() {
        const { wallets } = this.props;

        if (!wallets || wallets.length === 0) {
            this.props.accountWallets();
        }
        if (this.props.currentMarket) {
            this.props.depthFetch(this.props.currentMarket);
        }
    }

    public render() {
        const rowHeight = 12;

        return (
            <div className={'pg-trading-screen'}>
                <div className={'pg-trading-wrap'}>
                    <Grid
                        breakpoints={breakpoints}
                        className="layout"
                        children={gridItems}
                        cols={cols}
                        draggableHandle=".cr-table-header__content"
                        layouts={layouts}
                        rowHeight={rowHeight}
                        onLayoutChange={handleLayoutChange}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    wallets: selectWallets(state),
    user: selectUserInfo(state),
    currentMarket: selectCurrentMarket(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    accountWallets: () => dispatch(walletsFetch()),
    depthFetch: (market) => dispatch(depthFetch(market)),
});

const TradingScreen = connect(mapStateToProps, mapDispatchToProps)(Trading);

export {
    TradingScreen,
};
