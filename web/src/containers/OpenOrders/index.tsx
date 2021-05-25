import classnames from 'classnames';
import * as React from 'react';
import { useCallback, useMemo } from 'react';
import { Spinner } from 'react-bootstrap';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useOpenOrdersFetch } from 'src/hooks';
import { CloseIcon } from '../../assets/images/CloseIcon';
import { Decimal, OpenOrders } from '../../components';
import { localeDate, setTradeColor } from '../../helpers';
import {
    openOrdersCancelFetch,
    ordersCancelAllFetch,
    selectCurrentMarket,
    selectOpenOrdersFetching,
    selectOpenOrdersList,
} from '../../modules';
import { OrderCommon } from '../../modules/types';

export const OpenOrdersComponent: React.FC = (): React.ReactElement => {
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const currentMarket = useSelector(selectCurrentMarket);
    const list = useSelector(selectOpenOrdersList);
    const fetching = useSelector(selectOpenOrdersFetching);
    const translate = React.useCallback((id: string) => formatMessage({ id: id }), [formatMessage]);

    useOpenOrdersFetch(currentMarket);

    const headersKeys = [
        'Date',
        'Price',
        'Amount',
        'Total',
        'Filled',
        '',
    ];

    const renderHeaders = useMemo(() => {
        const currentAskUnit = currentMarket ? ` (${currentMarket.base_unit.toUpperCase()})` : '';
        const currentBidUnit = currentMarket ? ` (${currentMarket.quote_unit.toUpperCase()})` : '';

        return [
            translate('page.body.trade.header.openOrders.content.date'),
            translate('page.body.trade.header.openOrders.content.price').concat(currentBidUnit),
            translate('page.body.trade.header.openOrders.content.amount').concat(currentAskUnit),
            translate('page.body.trade.header.openOrders.content.total').concat(currentBidUnit),
            translate('page.body.trade.header.openOrders.content.filled'),
            '',
        ];
    }, [currentMarket]);

    const renderData = useMemo(() => {
        if (list.length === 0) {
            return [[[''], [''], translate('page.noDataToShow')]];
        }

        return list.map((item: OrderCommon) => {
            const { id, price, created_at, remaining_volume, origin_volume, side } = item;

            const executedVolume = Number(origin_volume) - Number(remaining_volume);
            const remainingAmount = Number(remaining_volume);
            const filled = ((executedVolume / Number(origin_volume)) * 100).toFixed(2);
            const priceFixed = currentMarket ? currentMarket.price_precision : 0;
            const amountFixed = currentMarket ? currentMarket.amount_precision : 0;

            return [
                localeDate(created_at, 'fullDate'),
                <span style={{ color: setTradeColor(side).color }} key={id}>{Decimal.format(price, priceFixed, ',')}</span>,
                <span style={{ color: setTradeColor(side).color }} key={id}>{Decimal.format(remainingAmount, amountFixed, ',')}</span>,
                <span style={{ color: setTradeColor(side).color }} key={id}>{Decimal.format(+remaining_volume, amountFixed, ',')}</span>,
                <span style={{ color: setTradeColor(side).color }} key={id}>{filled}%</span>,
                side,
            ];
        });
    }, [list, currentMarket]);

    const handleCancel = useCallback((index: number) => {
        const orderToDelete = list[index];
        dispatch(openOrdersCancelFetch({ order: orderToDelete, list }));
    }, [list]);

    const handleCancelAll = useCallback(() => {
        currentMarket && dispatch(ordersCancelAllFetch({ market: currentMarket.id }));
    }, [currentMarket]);

    const classNames = useMemo(() => 
        classnames('pg-open-orders', {
            'pg-open-orders--empty': !list.length,
            'pg-open-orders--loading': fetching,
        }),
    [list, fetching]);

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
            {fetching && <div className="open-order-loading"><Spinner animation="border" variant="primary" /></div>}
            {!fetching && (
                <OpenOrders
                    headersKeys={headersKeys}
                    headers={renderHeaders}
                    data={renderData}
                    onCancel={handleCancel}
                />
            )}
        </div>
    );
}
