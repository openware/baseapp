import { Loader, OpenOrders } from '@openware/components';
import classnames from 'classnames';
import * as React from 'react';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { preciseData } from '../../helpers';
import { RootState } from '../../modules';
import {
    Market,
    marketsFetch,
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
    marketsError?: CommonError;
    marketsLoading?: boolean;
    openOrdersData: Order[];
    openOrdersLoading?: boolean;
    openOrdersError?: CommonError;
}

interface DispatchProps {
    getMarketsData: typeof marketsFetch;
    getOrdersData: typeof userOrdersAllFetch;
    ordersCancelAll: typeof ordersCancelAllFetch;
    ordersCancelById: typeof orderCancelFetch;
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
    }

    public componentDidMount() {
        this.props.getOrdersData();
        this.props.getMarketsData();
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
        const cancelAll = this.handleCancelAll;

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
        const defaultPrecision = 4;
        const renderRow = item => {
            const {
                executed_volume,
                market, ord_type,
                price,
                remaining_volume,
                side,
                state,
                volume,
            } = item;

            const currentMarket = this.props.marketsData.find(m => m.id === market);

            const type = `${this.capitalize(side)} / ${ord_type}`;
            const marketName = currentMarket ? currentMarket.name : market;
            const costRemaining = remaining_volume * price;

            const pricePrecised = preciseData(price, currentMarket ? currentMarket.bid_precision : defaultPrecision);
            const executedVolumePrecised = preciseData(executed_volume, currentMarket ? currentMarket.ask_precision : defaultPrecision);
            const remainingVolumePrecised = preciseData(remaining_volume, currentMarket ? currentMarket.ask_precision : defaultPrecision);
            const volumePrecised = preciseData(volume, currentMarket ? currentMarket.ask_precision : defaultPrecision);
            const costRemainingPrecised = preciseData(costRemaining, currentMarket ? currentMarket.ask_precision : defaultPrecision);

            return [
                type,
                marketName,
                pricePrecised,
                volumePrecised,
                executedVolumePrecised,
                remainingVolumePrecised,
                costRemainingPrecised,
                state,
                '',
            ];
        };
        return (data.length > 0)
            ? this.sortDataByDateTime(data).map(renderRow)
            : [['There is no data to show...', '', '', '', '', '', '', '', '']];
    };

    private toggleByOrderType = () => {
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
        const orderToDelete = this.props.openOrdersData[index];
        const orderToDeleteId = orderToDelete.id.toString();
        this.props.ordersCancelById({ id: orderToDeleteId });
    };

    private handleCancelAll = () => {
        this.props.ordersCancelAll();
    }
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    marketsData: selectMarkets(state),
    marketsError: selectMarketsError(state),
    marketsLoading: selectMarketsLoading(state),
    openOrdersData: selectOrders(state),
    openOrdersLoading: selectOrdersLoading(state),
    openOrdersError: selectOrdersError(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        getMarketsData: () => dispatch(marketsFetch()),
        getOrdersData: () => dispatch(userOrdersAllFetch()),
        ordersCancelById: payload => dispatch(orderCancelFetch(payload)),
        ordersCancelAll: () => dispatch(ordersCancelAllFetch()),
    });

export const OpenOrdersTabComponent =
    connect(mapStateToProps, mapDispatchToProps)(OpenOrdersTabContainer);
