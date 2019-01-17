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
    orderCancel: typeof orderCancelFetch;
}

interface OpenOrdersState {
    marketsLength: number;
}

type Props = ReduxProps & DispatchProps;

// tslint:disable
class OpenOrdersTabContainer extends React.PureComponent<Props, OpenOrdersState> {
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
                <OpenOrders
                    headers={this.renderHeaders()}
                    data={this.renderData(this.props.openOrdersData)}
                    onCancel={this.handleCancel}
                />
            </div>
        );
    };

    private renderHeaders = () => {
      return ['Order Type', 'Pair', 'Price', 'Amount', 'Executed', 'Remaining', 'Cost remaining', 'Status', ''];
    }

    private renderData = (data: Order[]) => {
        const renderRow = item => {
          const { price, volume, side, ord_type, market, remaining_volume, state } = item;
          const type = side === 'buy' ? `Buy / ${ord_type}` : `Sell / ${ord_type}`;
          const currentMarket = this.props.marketsData.find(marketElem => marketElem.id === market) || market;

          return [type, currentMarket.name, price, volume, volume, remaining_volume, remaining_volume, state, ''];
        };
        return (data.length > 0)
            ? this.sortDataByDateTime(data).map(renderRow)
            : [['There is no data to show...', '', '', '', '', '', '', '', '']];
    };

    private sortDataByDateTime(data: Order[]) {
        const sortByDateTime = (a: Order, b: Order) => a.created_at < b.created_at ? 1 : -1;
        const dataToSort = [...data];

        dataToSort.sort(sortByDateTime);
        return dataToSort;
    }

    private handleCancel = (index: number) => {
        const { openOrdersData } = this.props;
        const orderToDelete = this.sortDataByDateTime(openOrdersData)[index];
        this.props.orderCancel({ id: orderToDelete.id.toString() });
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
    });

export const OpenOrdersTabComponent =
    connect(mapStateToProps, mapDispatchToProps)(OpenOrdersTabContainer);
