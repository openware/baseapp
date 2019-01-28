import { Loader, OpenOrders } from '@openware/components';
import classnames from 'classnames';
import * as React from 'react';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { preciseData } from '../../helpers';
import { RootState } from '../../modules';
import {
    Market,
    marketsFetch,
    selectHashMarkets,
    selectMarkets,
    selectMarketsError,
    selectMarketsLoading,
} from '../../modules/markets';
import {
    Order,
    orderCancelFetch,
    ordersCancelAllFetch,
    selectOrders,
    selectOrdersError,
    selectOrdersLoading,
    userOrdersAllFetch,
} from '../../modules/orders';
import { CommonError } from '../../modules/types';

interface ReduxProps {
    marketsData: Market[];
    marketsLoading?: boolean;
    marketsError?: CommonError;
    openOrdersData: Order[];
    openOrdersLoading?: boolean;
    openOrdersError?: CommonError;
    marketsIndex: {[pair: string]: Market};
    markets: Market[];
}

interface DispatchProps {
    markets: typeof marketsFetch;
    orderHistory: typeof userOrdersAllFetch;
    orderCancelAll: typeof ordersCancelAllFetch;
    orderCancel: typeof orderCancelFetch;
    fetchMarkets: typeof marketsFetch;
}

interface OpenOrdersState {
    orderType: boolean;
}

type Props = ReduxProps & DispatchProps;

class OpenOrdersTabContainer extends React.PureComponent<Props, OpenOrdersState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            orderType: false,
        };
        this.toggleByOrderType = this.toggleByOrderType.bind(this);
    }

    public componentDidMount() {
        this.props.markets();
        this.props.orderHistory();

        if (this.props.markets.length === 0) {
            this.props.fetchMarkets();
        }
    }

    public render() {
        const {
            marketsLoading,
            openOrdersData,
            openOrdersLoading,
        } = this.props;
        const classNames = classnames('pg-container pg-open-orders-tab', {
            'pg-open-orders-tab--empty': !openOrdersData.length,
            'pg-open-orders-tab--loading': openOrdersLoading,
        });

        return (
            <div className={classNames}>
                {(openOrdersLoading || marketsLoading) ? <Loader /> : this.openOrders()}
            </div>
        );
    }

    private openOrders = () => {
        const { marketsError, openOrdersData, openOrdersError } = this.props;
        const error = openOrdersError || marketsError;
        const cancelAll = this.handleCancelAll.bind(this);

        return (
            <div>
                {error && <p className="pg-open-orders-tab__error">{error.message}</p>}
                <div className="pg-open-orders-tab__cancel-all" ><span onClick={cancelAll}>Cancel all<span className="pg-open-orders-tab__close"/></span></div>
                <OpenOrders
                    function={this.toggleByOrderType}
                    headers={this.renderHeaders()}
                    data={this.renderData(openOrdersData)}
                    onCancel={this.handleCancel}
                />
                <div className="pg-open-orders-tab__footer" />
            </div>
        );
    };

    private renderHeaders = () => ['Order Type', 'Pair', 'Price', 'Amount', 'Executed', 'Remaining', 'Cost remaining', 'Status', ''];
    private capitalize = (str: string) => String(str).charAt(0).toUpperCase() + String(str).slice(1);

    private renderData = (data: Order[]) => {
        const renderRow = item => {
            const { price, volume, side, ord_type, executed_volume, remaining_volume, state } = item;
            const marketId = item.market;
            const type = `${this.capitalize(side)} / ${ord_type}`;
            const market = this.props.marketsIndex[marketId];
            const costRemaining = remaining_volume * price;
            let marketName = marketId;
            let priceP = '';
            let volumeP = '';

            if (market) {
                marketName = `${market.ask_unit.toUpperCase()}/${market.bid_unit.toUpperCase()}`;
                priceP = preciseData(price, market.bid_precision);
                volumeP = preciseData(volume, market.ask_precision);
            } else {
                // tslint:disable-next-line no-console
                console.log(`Market ${marketId} not found`);
            }

            return [type, marketName, priceP, volumeP, executed_volume, remaining_volume, costRemaining, state, ''];
        };
        return (data.length > 0)
            ? this.sortDataByDateTime(data).map(renderRow)
            : [['There is no data to show...', '', '', '', '', '', '', '', '']];
    };

    private toggleByOrderType() {
        const currentOrderType = this.state.orderType;
        this.setState({
            orderType: !currentOrderType,
        });
        this.openOrders();
    }

    private sortDataByDateTime(data: Order[]) {
        const sortByDateTime = (a: Order, b: Order) => a.created_at < b.created_at ? 1 : -1;
        const sortByOrderType = (a: Order, b: Order) => (this.state.orderType) ? ((a.side < b.side) ? 1 : -1) : (a.side > b.side ? 1 : -1);
        const dataToSort = [...data];

        dataToSort.sort(sortByDateTime);
        dataToSort.sort(sortByOrderType);
        return dataToSort;
    }

    private handleCancel = (index: number) => {
        const { openOrdersData } = this.props;
        const orderToDelete = this.sortDataByDateTime(openOrdersData)[index];
        this.props.orderCancel({ id: orderToDelete.id.toString() });
    };

    private handleCancelAll() {
        this.props.orderCancelAll();
    }
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    marketsData: selectMarkets(state),
    marketsError: selectMarketsError(state),
    marketsLoading: selectMarketsLoading(state),
    openOrdersData: selectOrders(state),
    openOrdersLoading: selectOrdersLoading(state),
    openOrdersError: selectOrdersError(state),
    marketsIndex: selectHashMarkets(state),
    markets: selectMarkets(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        markets: () => dispatch(marketsFetch()),
        orderHistory: () => dispatch(userOrdersAllFetch()),
        orderCancel: payload => dispatch(orderCancelFetch(payload)),
        orderCancelAll: () => dispatch(ordersCancelAllFetch()),
        fetchMarkets: () => dispatch(marketsFetch()),
    });

export const OpenOrdersTabComponent =
    connect(mapStateToProps, mapDispatchToProps)(OpenOrdersTabContainer);
