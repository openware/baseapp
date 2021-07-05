import * as React from 'react';
import { Spinner } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { compose } from 'redux';
import { IntlProps } from '../../';
import { CloseIcon } from '../../assets/images/CloseIcon';
import { History, Pagination } from '../../components';
import { Decimal } from '../../components/Decimal';
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
    userOrdersHistoryFetch,
} from '../../modules';
import { OrderCommon } from '../../modules/types';
import { getTriggerSign } from '../OpenOrders/helpers';

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


type Props = OrdersProps & ReduxProps & DispatchProps & IntlProps;

class OrdersComponent extends React.PureComponent<Props, OrdersState>  {
    public componentDidMount() {
        const { type } = this.props;
        this.props.userOrdersHistoryFetch({ pageIndex: 0, type, limit: 25 });
    }

    public render() {
        const { type, list, fetching } = this.props;
        let updateList = list;

        if (type === 'open') {
            updateList = list.filter(o => o.state === 'wait' || o.state === 'trigger_wait');
        }

        const emptyMsg = this.props.intl.formatMessage({id: 'page.noDataToShow'});

        return (
            <div className={`pg-history-elem ${updateList.length ? '' : 'pg-history-elem-empty'}`}>
                {fetching && <div className="text-center"><Spinner animation="border" variant="primary" /></div>}
                {updateList.length ? this.renderContent(updateList) : null}
                {!updateList.length && !fetching ? <p className="pg-history-elem__empty">{emptyMsg}</p> : null}
            </div>
        );
    }

    public renderContent = list => {
        const { firstElemIndex, lastElemIndex, pageIndex, nextPageExists } = this.props;

        return (
            <React.Fragment>
                <History headers={this.renderHeaders()} data={this.retrieveData(list)}/>
                <Pagination
                    firstElemIndex={firstElemIndex}
                    lastElemIndex={lastElemIndex}
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
            this.props.intl.formatMessage({ id: 'page.body.openOrders.header.date' }),
            this.props.intl.formatMessage({ id: 'page.body.openOrders.header.market' }),
            this.props.intl.formatMessage({ id: 'page.body.openOrders.header.side' }),
            this.props.intl.formatMessage({ id: 'page.body.openOrders.header.orderType' }),
            this.props.intl.formatMessage({ id: 'page.body.openOrders.header.avgPrice' }),
            this.props.intl.formatMessage({ id: 'page.body.openOrders.header.price' }),
            this.props.intl.formatMessage({ id: 'page.body.openOrders.header.amount' }),
            this.props.intl.formatMessage({ id: 'page.body.openOrders.header.value' }),
            this.props.intl.formatMessage({ id: 'page.body.openOrders.header.trigger' }),
            this.props.intl.formatMessage({ id: 'page.body.openOrders.header.filled' }),
            this.props.intl.formatMessage({ id: 'page.body.openOrders.header.status' }),
            '',
        ];
    };

    private retrieveData = list => {
        return list.map(item => this.renderOrdersHistoryRow(item));
    };

    private renderOrdersHistoryRow = item => {
        const {
            id,
            market,
            ord_type,
            price,
            avg_price,
            trigger_price,
            remaining_volume,
            origin_volume,
            side,
            state,
            updated_at,
            created_at,
        } = item;
        const currentMarket = this.props.marketsData.find(m => m.id === market)
            || { name: '', price_precision: 0, amount_precision: 0 };

        const orderType = this.getType(ord_type);
        const orderSide = this.getSide(side);
        const marketName = currentMarket ? currentMarket.name : market;
        const date = updated_at || created_at;
        const status = this.setOrderStatus(state);
        const actualPrice = this.getPrice(ord_type, status, avg_price, trigger_price, price);
        const total = +actualPrice * +origin_volume;
        const executedVolume = Number(origin_volume) - Number(remaining_volume);
        const filled = ((executedVolume / Number(origin_volume)) * 100).toFixed(2);

        return [
            <span key={id} className="split-lines f-small"><span className="secondary">{localeDate(date, 'date')}</span>&nbsp;<span>{localeDate(date, 'time')}</span></span>,
            <span key={id} className="bold">{marketName}</span>,
            <span style={{ color: setTradeColor(side).color }} key={id}>{orderSide}</span>,
            <span key={id}>{orderType}</span>,
            avg_price ? <Decimal key={id} fixed={currentMarket.price_precision} thousSep=",">{avg_price}</Decimal> : '-',
            price ? <Decimal key={id} fixed={currentMarket.price_precision} thousSep=",">{price}</Decimal> : '-',
            <Decimal key={id} fixed={currentMarket.amount_precision} thousSep=",">{origin_volume}</Decimal>,
            <Decimal key={id} fixed={currentMarket.amount_precision} thousSep=",">{total}</Decimal>,
            <span key={id} className="split-lines f-small justify-content-end">
                {trigger_price ? (
                    <React.Fragment>
                        <span>{this.props.intl.formatMessage({ id: 'page.body.trade.header.openOrders.lastPrice' })}</span>&nbsp;{getTriggerSign(ord_type, side)}&nbsp;&nbsp;
                        <span style={{ color: setTradeColor(side).color }}>{Decimal.format(trigger_price, currentMarket.price_precision, ',')}</span>
                    </React.Fragment>
                ) : '-'}
            </span>,
            <span style={{ color: setTradeColor(side).color }} className="f-small" key={id}><Decimal fixed={2} thousSep=",">{+filled}</Decimal>%</span>,
            <span key={id} className="f-small">{status}</span>,
            (state === 'wait' || state === 'trigger_wait') && <CloseIcon key={id} onClick={this.handleCancel(id)} />,
        ];
    };

    private getSide = (side: string) => {
        if (!side) {
            return '';
        }

        return this.props.intl.formatMessage({ id: `page.body.openOrders.header.side.${side}` });
    };

    private getType = (orderType: string) => {
        if (!orderType) {
            return '';
        }

        return this.props.intl.formatMessage({ id: `page.body.trade.header.openOrders.content.type.${orderType}` });
    };

    private getPrice = (ord_type, status, avg_price, trigger_price, price) => {
        if (ord_type === 'market' || status === 'done') {
            return avg_price;
        } else if (status === 'trigger_wait') {
            return trigger_price;
        } else {
            return price;
        }
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
            case 'trigger_cancel':
            case 'execution_reject':
                return (
                    <span className="pg-history-elem-canceled">
                        <FormattedMessage id={`page.body.openOrders.content.status.${status}`} />
                    </span>
                );
            case 'wait':
            case 'trigger_wait':
                return (
                    <span className="pg-history-elem-opened">
                        <FormattedMessage id={`page.body.openOrders.content.status.${status}`} />
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
    nextPageExists: selectOrdersNextPageExists(state),
    cancelAllFetching: selectCancelAllFetching(state),
    cancelFetching: selectCancelFetching(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        ordersHistoryCancelFetch: payload => dispatch(ordersHistoryCancelFetch(payload)),
        userOrdersHistoryFetch: payload => dispatch(userOrdersHistoryFetch(payload)),
    });

export const OrdersElement = compose(
    injectIntl,
    connect(mapStateToProps, mapDispatchToProps),
)(OrdersComponent) as any; // tslint:disable-line
