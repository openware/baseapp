import { CloseButton, Decimal, History, Pagination } from '@openware/components';
import * as React from 'react';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { localeDate, setTradeColor } from '../../helpers';
import {
    Market,
    ordersHistoryCancelFetch,
    RootState,
    selectCancelAllFetching,
    selectCancelFetching,
    selectCurrentPageIndex,
    selectMarkets,
    selectOrdersFirstElemIndex,
    selectOrdersHistory,
    selectOrdersHistoryLoading,
    selectOrdersLastElemIndex,
    selectOrdersNextPageExists,
    selectTotalOrdersHistory,
    userOrdersHistoryFetch,
} from '../../modules';
import { OrderCommon } from '../../modules/types';

interface OrdersProps {
    type: string;
}

interface ReduxProps {
    marketsData: Market[];
    pageIndex: number;
    firstElemIndex: number;
    list: OrderCommon[];
    fetching: boolean;
    lastElemIndex: number;
    nextPageExists: boolean;
    total: number;
    cancelAllFetching: boolean;
    cancelFetching: boolean;
}

interface DispatchProps {
    ordersHistoryCancelFetch: typeof ordersHistoryCancelFetch;
    userOrdersHistoryFetch: typeof userOrdersHistoryFetch;
}

interface OrdersState {
    orderType: boolean;
}


type Props = OrdersProps & ReduxProps & DispatchProps & InjectedIntlProps;

class OrdersComponent extends React.PureComponent<Props, OrdersState>  {
    public componentDidMount() {
        const { type } = this.props;
        this.props.userOrdersHistoryFetch({ pageIndex: 0, type, limit: 25 });
    }

    public render() {
        const { list, fetching } = this.props;
        const emptyMsg = this.props.intl.formatMessage({id: 'page.noDataToShow'});
        return (
            <div className={`pg-history-elem ${list.length ? '' : 'pg-history-elem-empty'}`}>
                {list.length ? this.renderContent() : null}
                {!list.length && !fetching ? <p className="pg-history-elem__empty">{emptyMsg}</p> : null}
            </div>
        );
    }

    public renderContent = () => {
        const { firstElemIndex, lastElemIndex, total, pageIndex, nextPageExists } = this.props;
        return (
            <React.Fragment>
                <History headers={this.renderHeaders()} data={this.retrieveData()}/>
                <Pagination
                    firstElemIndex={firstElemIndex}
                    lastElemIndex={lastElemIndex}
                    total={total}
                    page={pageIndex}
                    nextPageExists={nextPageExists}
                    onClickPrevPage={this.onClickPrevPage}
                    onClickNextPage={this.onClickNextPage}
                />
            </React.Fragment>
        );
    };

    private onClickPrevPage = () => {
        const { pageIndex, type } = this.props;
        this.props.userOrdersHistoryFetch({ pageIndex: Number(pageIndex) - 1, type, limit: 25 });
    };

    private onClickNextPage = () => {
        const { pageIndex, type } = this.props;
        this.props.userOrdersHistoryFetch({ pageIndex: Number(pageIndex) + 1, type, limit: 25 });
    };

    private renderHeaders = () => {
        return [
            this.props.intl.formatMessage({ id: 'page.body.history.deposit.header.date' }),
            this.props.intl.formatMessage({ id: 'page.body.openOrders.header.orderType' }),
            this.props.intl.formatMessage({ id: 'page.body.openOrders.header.pair' }),
            this.props.intl.formatMessage({ id: 'page.body.openOrders.header.price' }),
            this.props.intl.formatMessage({ id: 'page.body.openOrders.header.amount' }),
            this.props.intl.formatMessage({ id: 'page.body.openOrders.header.executed' }),
            this.props.intl.formatMessage({ id: 'page.body.openOrders.header.remaining' }),
            this.props.intl.formatMessage({ id: 'page.body.openOrders.header.costRemaining' }),
            this.props.intl.formatMessage({ id: 'page.body.openOrders.header.status' }),
            '',
        ];
    };

    private retrieveData = () => {
        return [...this.props.list]
            .map(item => this.renderOrdersHistoryRow(item));
    };

    private renderOrdersHistoryRow = item => {
        const {
            id,
            executed_volume,
            market,
            ord_type,
            price,
            avg_price,
            remaining_volume,
            origin_volume,
            side,
            state,
            updated_at,
        } = item;

        const currentMarket = this.props.marketsData.find(m => m.id === market)
            || { name: '', bid_precision: 0, ask_precision: 0 };

        const orderType = this.getType(side, ord_type);
        const marketName = currentMarket ? currentMarket.name : market;
        const costRemaining = remaining_volume * price; // price or avg_price ???
        const date = localeDate(updated_at);
        const status = this.setOrderStatus(state);
        const actualPrice = ord_type === 'market' || status === 'done' ? avg_price : price;

        return [
            date,
            <span style={{ color: setTradeColor(side).color }} key={id}>{orderType}</span>,
            marketName,
            <Decimal key={id} fixed={currentMarket.bid_precision}>{actualPrice}</Decimal>,
            <Decimal key={id} fixed={currentMarket.ask_precision}>{origin_volume}</Decimal>,
            <Decimal key={id} fixed={currentMarket.ask_precision}>{executed_volume}</Decimal>,
            <Decimal key={id} fixed={currentMarket.ask_precision}>{remaining_volume}</Decimal>,
            <Decimal key={id} fixed={currentMarket.ask_precision}>{costRemaining.toString()}</Decimal>,
            status,
            state === 'wait' && <CloseButton key={id} onClick={this.handleCancel(id)} />,
        ];
    };

    private getType = (side: string, orderType: string) => {
        if (!side || !orderType) {
            return '';
        }
        return this.props.intl.formatMessage({ id: `page.body.openOrders.header.orderType.${side}.${orderType}` });
    };

    private setOrderStatus = (status: string) => {
        switch (status) {
            case 'done':
                return (
                    <span className="pg-history-elem-executed">
                        <FormattedMessage id={`page.body.openOrders.content.status.done`} />
                    </span>
                );
            case 'cancel':
                return (
                    <span className="pg-history-elem-canceled">
                        <FormattedMessage id={`page.body.openOrders.content.status.cancel`} />
                    </span>
                );
            case 'wait':
                return (
                    <span className="pg-history-elem-opened">
                        <FormattedMessage id={`page.body.openOrders.content.status.wait`} />
                    </span>
                );
            default:
                return status;
        }
    };

    private handleCancel = (id: number) => () => {
        const { cancelAllFetching, cancelFetching, type, list } = this.props;
        if (cancelAllFetching || cancelFetching) {
            return;
        }
        this.props.ordersHistoryCancelFetch({ id, type, list });
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    marketsData: selectMarkets(state),
    pageIndex: selectCurrentPageIndex(state),
    firstElemIndex: selectOrdersFirstElemIndex(state, 25),
    list: selectOrdersHistory(state),
    fetching: selectOrdersHistoryLoading(state),
    lastElemIndex: selectOrdersLastElemIndex(state, 25),
    nextPageExists: selectOrdersNextPageExists(state, 25),
    total: selectTotalOrdersHistory(state),
    cancelAllFetching: selectCancelAllFetching(state),
    cancelFetching: selectCancelFetching(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        ordersHistoryCancelFetch: payload => dispatch(ordersHistoryCancelFetch(payload)),
        userOrdersHistoryFetch: payload => dispatch(userOrdersHistoryFetch(payload)),
    });

export const OrdersElement = injectIntl(connect(mapStateToProps, mapDispatchToProps)(OrdersComponent));
