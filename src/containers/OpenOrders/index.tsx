import classnames from 'classnames';
import * as React from 'react';
import { Spinner } from 'react-bootstrap';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { CloseIcon } from '../../assets/images/CloseIcon';
import { OpenOrders } from '../../components';
import { DEFAULT_MARKET } from '../../constants';
import { localeDate, preciseData, setTradeColor } from '../../helpers';
import { useOpenOrdersFetch } from '../../hooks';
import {
    Market,
    openOrdersCancelFetch,
    ordersCancelAllFetch,
    selectCurrentMarket,
    selectOpenOrdersFetching,
    selectOpenOrdersList,
} from '../../modules';
import { OrderCommon } from '../../modules/types';

export interface OpenOrdersProps {
    currentMarket: Market | undefined;
    list: OrderCommon[];
    fetching: boolean;
    cancelFetching: boolean;
    userLoggedIn: boolean;
}


export const OpenOrdersComponent = () => {
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();

    const list = useSelector(selectOpenOrdersList);
    const { id, base_unit, quote_unit, price_precision, amount_precision } = useSelector(selectCurrentMarket) || DEFAULT_MARKET;
    const fetching = useSelector(selectOpenOrdersFetching);

    const headersKeys = React.useMemo(() => [
        'Date',
        'Price',
        'Amount',
        'Total',
        'Filled',
        '',
    ], []);

    const handleCancel = React.useCallback((index: number) => {
        dispatch(openOrdersCancelFetch({ order: list[index], list }));
    }, [dispatch, list]);

    const renderData = React.useCallback(() => {
        if (list.length === 0) {
            return [[[''], [''], formatMessage({ id: 'page.noDataToShow' })]];
        }

        return list.map((item: OrderCommon) => {
            const { price, created_at, remaining_volume, origin_volume, side } = item;
            const executedVolume = Number(origin_volume) - Number(remaining_volume);
            const remainingAmount = Number(remaining_volume);
            const total = Number(origin_volume) * Number(price);
            const filled = ((executedVolume / Number(origin_volume)) * 100).toFixed(2);
            const priceFixed = price_precision || 0;
            const amountFixed = amount_precision || 0;

            return [
                localeDate(created_at, 'fullDate'),
                <span style={{ color: setTradeColor(side).color }} key={item.id}>{preciseData(price, priceFixed)}</span>,
                <span style={{ color: setTradeColor(side).color }} key={item.id}>{preciseData(remainingAmount, amountFixed)}</span>,
                <span style={{ color: setTradeColor(side).color }} key={item.id}>{preciseData(total, amountFixed)}</span>,
                <span style={{ color: setTradeColor(side).color }} key={item.id}>{filled}%</span>,
                side,
            ];
        });
    }, [amount_precision, formatMessage, list, price_precision]);

    const renderHeaders = React.useCallback(() => {
        const currentAskUnit = base_unit ? ` (${base_unit.toUpperCase()})` : '';
        const currentBidUnit = quote_unit ? ` (${quote_unit.toUpperCase()})` : '';

        return [
            formatMessage({ id: 'page.body.trade.header.openOrders.content.date' }),
            formatMessage({ id: 'page.body.trade.header.openOrders.content.price' }).concat(currentBidUnit),
            formatMessage({ id: 'page.body.trade.header.openOrders.content.amount' }).concat(currentAskUnit),
            formatMessage({ id: 'page.body.trade.header.openOrders.content.total' }).concat(currentBidUnit),
            formatMessage({ id: 'page.body.trade.header.openOrders.content.filled' }),
            '',
        ];
    }, [base_unit, quote_unit, formatMessage]);

    const handleCancelAll = React.useCallback(() => {
        id && dispatch(ordersCancelAllFetch({ market: id }));
    }, [id, dispatch]);

    const classNames = React.useMemo(() => classnames('pg-open-orders', {
        'pg-open-orders--empty': !list.length,
        'pg-open-orders--loading': fetching,
    }), [list.length, fetching]);

    useOpenOrdersFetch({ id } as Market);

    return (
        <div className={classNames}>
            <div className="cr-table-header__content">
                <div className="cr-title-component">
                    <FormattedMessage id="page.body.trade.header.openOrders" />
                    <span className="cr-table-header__cancel" onClick={handleCancelAll}>
                            <FormattedMessage id="page.body.openOrders.header.button.cancelAll" />
                            <CloseIcon className="cr-table-header__close" />
                        </span>
                </div>
            </div>
            {fetching ?
                <div className="open-order-loading"><Spinner animation="border" variant="primary" /></div>
                : <OpenOrders
                    headersKeys={headersKeys}
                    headers={renderHeaders()}
                    data={renderData()}
                    onCancel={handleCancel}
                />}
        </div>
    );
};
