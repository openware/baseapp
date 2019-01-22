import { Loader, OpenOrders } from '@openware/components';
import classnames from 'classnames';
import * as moment from 'moment';
import * as React from 'react';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { localeDate } from '../../helpers';
import { RootState } from '../../modules';
import { Market, selectCurrentMarket } from '../../modules/markets';
import {
    Order,
    orderCancelFetch,
    selectOpenOrders,
    selectOrdersLoading,
    userOrdersFetch,
 } from '../../modules/orders';

interface ReduxProps {
    currentMarket: Market;
    openOrdersData: Order[];
    openOrdersLoading?: boolean;
}

interface DispatchProps {
    orderHistory: typeof userOrdersFetch;
    orderCancel: typeof orderCancelFetch;
}

type Props = ReduxProps & DispatchProps;

class OpenOrdersContainer extends React.Component<Props> {
    public componentDidMount() {
        if (this.props.currentMarket.id){
          this.props.orderHistory([this.props.currentMarket]);
        }
    }

    public componentWillReceiveProps(next: Props) {
        if (this.props.currentMarket !== next.currentMarket) {
            this.props.orderHistory([next.currentMarket]);
        }
    }

    public render() {
        const { openOrdersData, openOrdersLoading } = this.props;
        const classNames = classnames('pg-open-orders', {
            'pg-open-orders--empty': !openOrdersData.length,
            'pg-open-orders--loading': openOrdersLoading,
        });
        return (
            <div className={classNames}>
                {openOrdersLoading ? <Loader /> : this.openOrders()}
            </div>
        );
    }

    private openOrders = () => (
        <OpenOrders
            headers={['Date', 'Action', 'State', 'Price', 'Amount', '']}
            data={this.renderData(this.props.openOrdersData)}
            onCancel={this.handleCancel}
        />
    );

    private static getDate = (time: string) => {
        return localeDate(time);
    };

    private renderState({ remaining_volume = '0', volume = '0' }) {
        const isVolumeEqual = Number(remaining_volume) === Number(volume);

        if (isVolumeEqual) {
            return 'wait';
        }
        return 'partially filled';
    }

    private renderData = (data: Order[]) => {
        const renderRow = item => {
          const { price, created_at, remaining_volume, origin_volume, kind, volume, side } = item;
          const resultSide = kind ? kind : side === 'sell' ? 'ask' : 'bid';
          const remaining = remaining_volume || origin_volume;
          const resultState = this.renderState({ remaining_volume, volume});

          return [OpenOrdersContainer.getDate(created_at), resultSide, resultState, price, remaining, ''];
        };

        return (data.length > 0)
            ? this.sortDataByDateTime(data).map(renderRow)
            : [['There is no data to show...']];
    };

    private sortDataByDateTime(data: Order[]) {
        const sortByDateTime = (a: Order, b: Order) =>
            moment(a.created_at) < moment(b.created_at) ? 1 : -1;
        const dataToSort = [...data];

        dataToSort.sort(sortByDateTime);
        return dataToSort;
    }

    private handleCancel = (index: number) => {
        const { openOrdersData } = this.props;
        const orderToDelete = this.sortDataByDateTime(openOrdersData)[index];
        this.props.orderCancel({ id: orderToDelete.id });
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    currentMarket: selectCurrentMarket(state),
    openOrdersData: selectOpenOrders(state),
    openOrdersLoading: selectOrdersLoading(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        orderHistory: payload => dispatch(userOrdersFetch(payload)),
        orderCancel: payload => dispatch(orderCancelFetch(payload)),
    });

export const OpenOrdersComponent =
    connect(mapStateToProps, mapDispatchToProps)(OpenOrdersContainer);
