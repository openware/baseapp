import { Loader, OpenOrders } from '@openware/components';
import classnames from 'classnames';
import * as React from 'react';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
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
    userOrdersFetch,
} from '../../modules/orders';
import { CommonError } from '../../modules/types';

interface ReduxProps {
    openOrdersData: Order[];
    openOrdersLoading?: boolean;
    marketsData: Market[];
    marketsLoading?: boolean;
    marketsError?: CommonError;
    openOrdersError?: CommonError;
}

interface DispatchProps {
    markets: typeof marketsFetch;
    orderHistory: typeof userOrdersFetch;
    orderCancelAll: typeof ordersCancelAllFetch;
    orderCancel: typeof orderCancelFetch;
}

interface OpenOrdersState {
    orderType: boolean;
}

type Props = ReduxProps & DispatchProps;

// tslint:disable
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
    }

    public componentWillReceiveProps(next: Props) {
        if (this.props.marketsData !== next.marketsData) {
            this.props.orderHistory(this.props.marketsData);
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
        const { marketsError, openOrdersError } = this.props;
        const error = openOrdersError || marketsError;
        return (
            <div>
                {error && <p className="pg-open-orders-tab__error">{error.message}</p>}
                <div className="pg-open-orders-tab__cancel-all" ><span onClick={this.handleCancelAll.bind(this)}>Cancel all<span className="pg-open-orders-tab__close"/></span></div>
                <OpenOrders
                    function={this.toggleByOrderType}
                    headers={this.renderHeaders()}
                    data={this.renderData(this.props.openOrdersData)}
                    onCancel={this.handleCancel}
                />
                <div className="pg-open-orders-tab__footer" />
            </div>
        );
    };

    private renderHeaders = () => {
      return ['Order Type', 'Pair', 'Price', 'Amount', 'Executed', 'Remaining', 'Cost remaining', 'Status', ''];
    }

    private renderData = (data: Order[]) => {
        const renderRow = item => {
          const { price, volume, side, ord_type, market, executed_volume, remaining_volume, state } = item;
          const type = side === 'buy' ? `Buy / ${ord_type}` : `Sell / ${ord_type}`;
          const currentMarket = this.props.marketsData.find(marketElem => marketElem.id === market) || market;
          const costRemaining = remaining_volume * price;

          return [type, currentMarket.name, price, volume, executed_volume, remaining_volume, costRemaining, state, ''];
        };
        return (data.length > 0)
            ? this.sortDataByDateTime(data).map(renderRow)
            : [['There is no data to show...', '', '', '', '', '', '', '', '']];
    };

    private toggleByOrderType() {
        const currentOrderType = this.state.orderType;
        this.setState({
            orderType: !currentOrderType
        });
        this.openOrders();
    }

    private sortDataByDateTime(data: Order[]) {
        const sortByDateTime = (a: Order, b: Order) => a.created_at < b.created_at ? 1 : -1;
        const sortByOrderType = (a: Order, b: Order) => (this.state.orderType) ? ((a.side < b.side) ? 1 : -1) : (a.side > b.side ? 1 : -1);
        (this.state.orderType) ? 
            (document.getElementsByClassName('cr-table__head-row')[0].children[0].className = "cr-open-orders__order--active") : 
            ((document.getElementsByClassName('cr-open-orders__order--active')[0]) ?
                (document.getElementsByClassName('cr-open-orders__order--active')[0].classList.remove("cr-open-orders__order--active")) :
                null
        );
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
    };
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
        markets: () => dispatch(marketsFetch()),
        orderHistory: payload => dispatch(userOrdersFetch(payload)),
        orderCancel: payload => dispatch(orderCancelFetch(payload)),
        orderCancelAll: () => dispatch(ordersCancelAllFetch()),
    });

export const OpenOrdersTabComponent =
    connect(mapStateToProps, mapDispatchToProps)(OpenOrdersTabContainer);
