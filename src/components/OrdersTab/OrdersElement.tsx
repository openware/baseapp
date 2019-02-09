import { CloseButton, Decimal, History } from '@openware/components';
import * as React from 'react';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import {
    localeDate,
    setTradeColor,
} from '../../helpers';
import { RootState } from '../../modules';
import {
    Market,
    selectMarkets,
} from '../../modules/markets';
import {
    Order,
    orderCancelFetch,
    selectOpenOrders,
    selectOrders,
    selectOrdersError,
    selectOrdersLoading,
} from '../../modules/orders';
import { CommonError } from '../../modules/types';

interface OrdersProps {
    type: string;
}

interface ReduxProps {
    marketsData: Market[];
    allOrdersData: Order[];
    openOrdersData: Order[];
    openOrdersLoading?: boolean;
    openOrdersError?: CommonError;
}

interface DispatchProps {
    ordersCancelById: typeof orderCancelFetch;
}

interface OrdersState {
    orderType: boolean;
}


type Props = OrdersProps & ReduxProps & DispatchProps;

class OrdersComponent extends React.PureComponent<Props, OrdersState>  {
    public render() {
        const { allOrdersData, openOrdersData } = this.props;
        const data = allOrdersData && openOrdersData;
        const headers = this.renderHeaders();
        return (
          <div className={`pg-history-elem ${data.length ? '' : 'pg-history-elem-empty'}`}>
            {data.length ? <History headers={headers} data={this.retrieveData()}/> : <p className="pg-history-elem__empty">No data to show</p>}
          </div>
        );
    }

    private renderHeaders = () => ['Date', 'Order Type', 'Pair', 'Price', 'Amount', 'Executed', 'Remaining', 'Cost remaining', 'Status', ''];

    private retrieveData = () => {
        const { type, openOrdersData, allOrdersData } = this.props;
        switch (type) {
            case 'open': {
                return [...openOrdersData]
                .map(item => this.renderOpenOrdersRow(item));
            }
            case 'all': {
                return [...allOrdersData]
                .map(item => this.renderAllOrdersRow(item));
            }
            default: {
                return [];
            }
        }
    };

    private capitalize = (str: string) => String(str).charAt(0).toUpperCase() + String(str).slice(1);

    private renderOpenOrdersRow = item => {
        const {
            id,
            created_at,
            executed_volume,
            market, ord_type,
            price,
            remaining_volume,
            side,
            state,
            volume,
        } = item;

        const currentMarket = this.props.marketsData.find(m => m.id === market)
            || { name: '', bid_precision: 0, ask_precision: 0 };
        const orderType = `${this.capitalize(side)} / ${ord_type}`;
        const marketName = currentMarket ? currentMarket.name : market;
        const costRemaining = remaining_volume * price;

        const date = localeDate(created_at);
        const status = this.setOrderStatus(state);

        return [
            date,
            <span style={{ color: setTradeColor(side).color }} key={id}>{orderType}</span>,
            marketName,
            <Decimal key={id} fixed={currentMarket.bid_precision}>{price}</Decimal>,
            <Decimal key={id} fixed={currentMarket.ask_precision}>{volume}</Decimal>,
            <Decimal key={id} fixed={currentMarket.ask_precision}>{executed_volume}</Decimal>,
            <Decimal key={id} fixed={currentMarket.ask_precision}>{remaining_volume}</Decimal>,
            <Decimal key={id} fixed={currentMarket.ask_precision}>{costRemaining.toString()}</Decimal>,
            status,
            <CloseButton key={id} onClick={() => this.handleCancel(id)} />,//tslint:disable-line
        ];
    }
    private renderAllOrdersRow = item => {
        const {
            id,
            created_at,
            executed_volume,
            market, ord_type,
            price,
            remaining_volume,
            side,
            state,
            volume,
        } = item;

        const currentMarket = this.props.marketsData.find(m => m.id === market)
            || { name: '', bid_precision: 0, ask_precision: 0 };

        const orderType = `${this.capitalize(side)} / ${ord_type}`;
        const marketName = currentMarket ? currentMarket.name : market;
        const costRemaining = remaining_volume * price;

        const date = localeDate(created_at);
        const status = this.setOrderStatus(state);

        return [
            date,
            <span style={{ color: setTradeColor(side).color }} key={id}>{orderType}</span>,
            marketName,
            <Decimal key={id} fixed={currentMarket.bid_precision}>{price}</Decimal>,
            <Decimal key={id} fixed={currentMarket.ask_precision}>{volume}</Decimal>,
            <Decimal key={id} fixed={currentMarket.ask_precision}>{executed_volume}</Decimal>,
            <Decimal key={id} fixed={currentMarket.ask_precision}>{remaining_volume}</Decimal>,
            <Decimal key={id} fixed={currentMarket.ask_precision}>{costRemaining.toString()}</Decimal>,
            status,
            state == 'wait' && <CloseButton key={id} onClick={() => this.handleCancel(id)} />, //tslint:disable-line
        ];
    }

    private setOrderStatus = (status: string) => {
        switch (status){
            case 'done':
                return <span>Filled</span>;
            case 'cancel':
                return <span style={{color:'var(--color-red)'}}>Cancelled</span>;
            case 'wait':
                return <span style={{color:'var(--color-green)'}}>Open</span>;
            default:
                return status;
        }
    };

    private handleCancel = (id: number) => {
        const orderToDelete = this.props.openOrdersData.find(o => o.id === id)
            || { id: 0 };
        const orderToDeleteId = orderToDelete.id.toString();
        this.props.ordersCancelById({ id: orderToDeleteId });
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    marketsData: selectMarkets(state),
    allOrdersData: selectOrders(state),
    openOrdersData: selectOpenOrders(state),
    openOrdersLoading: selectOrdersLoading(state),
    openOrdersError: selectOrdersError(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        ordersCancelById: payload => dispatch(orderCancelFetch(payload)),
    });

export const OrdersElement = connect(mapStateToProps, mapDispatchToProps)(OrdersComponent);
