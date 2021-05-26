import classnames from 'classnames';
import React, { useCallback, useMemo, useState } from 'react';
import { Form, Spinner } from 'react-bootstrap';
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
    selectMarkets,
    selectOpenOrdersFetching,
    selectOpenOrdersList,
} from '../../modules';
import { OrderCommon } from '../../modules/types';
import { getTriggerSign } from './helpers';

export const OpenOrdersComponent: React.FC = (): React.ReactElement => {
    const [hideOtherPairs, setHideOtherPairs] = useState<boolean>(true);
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const currentMarket = useSelector(selectCurrentMarket);
    const list = useSelector(selectOpenOrdersList);
    const fetching = useSelector(selectOpenOrdersFetching);
    const markets = useSelector(selectMarkets);

    const translate = React.useCallback((id: string) => formatMessage({ id: id }), [formatMessage]);

    useOpenOrdersFetch(currentMarket, hideOtherPairs);

    const headersKeys = useMemo(() => [
        'Date',
        'Market',
        'Type',
        'Price',
        'Amount',
        'Total',
        'Trigger',
        'Filled',
        '',
    ], []);

    const renderHeaders = useMemo(() => [
        translate('page.body.trade.header.openOrders.content.date'),
        translate('page.body.trade.header.openOrders.content.market'),
        translate('page.body.trade.header.openOrders.content.type'),
        translate('page.body.trade.header.openOrders.content.price'),
        translate('page.body.trade.header.openOrders.content.amount'),
        translate('page.body.trade.header.openOrders.content.total'),
        translate('page.body.trade.header.openOrders.content.trigger'),
        translate('page.body.trade.header.openOrders.content.filled'),
        '',
    ], []);

    const renderData = useCallback(data => {
        if (!data.length) {
            return [[[''], [''], [''], translate('page.noDataToShow')]];
        }

        return data.map((item: OrderCommon) => {
            const { id, price, created_at, remaining_volume, origin_volume, side, ord_type, market, trigger_price } = item;
            const executedVolume = Number(origin_volume) - Number(remaining_volume);
            const filled = ((executedVolume / Number(origin_volume)) * 100).toFixed(2);
            const curMarket = markets.find(i => i.id === market);
            const priceFixed = curMarket?.price_precision || 0;
            const amountFixed = curMarket?.amount_precision || 0;

            return [
                localeDate(created_at, 'fullDate'),
                <span key={id}>{curMarket?.name.toUpperCase()}</span>,
                <span key={id}>{ord_type ? translate(`page.body.trade.header.openOrders.content.type.${ord_type}`) : '-'}</span>,
                <span style={{ color: setTradeColor(side).color }} key={id}>{Decimal.format(price, priceFixed, ',')}</span>,
                <span key={id}>{Decimal.format(+remaining_volume, amountFixed, ',')}</span>,
                <span key={id}>{Decimal.format(+remaining_volume, amountFixed, ',')} {curMarket?.quote_unit?.toUpperCase()}</span>,
                <span key={id}>
                    {trigger_price ? (
                        <React.Fragment>
                            <span>{translate('page.body.trade.header.openOrders.lastPrice')}</span>&nbsp;{getTriggerSign(ord_type, side)}&nbsp;
                            <span style={{ color: setTradeColor(side).color }}>{Decimal.format(trigger_price, priceFixed, ',')}</span>
                        </React.Fragment>
                    ) : '-'}
                </span>,
                <span style={{ color: setTradeColor(side).color }} key={id}>{filled}%</span>,
                side,
            ];
        });
    }, []);

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
            },
        ),
    [list, fetching]);

    const handleToggleCheckbox = React.useCallback(event => {
        event.preventDefault();
        setHideOtherPairs(!hideOtherPairs);
    }, [hideOtherPairs]);

    const renderContent = useMemo(() => {
        if (fetching) {
            return (
                <div className="open-order-loading">
                    <Spinner animation="border" variant="primary" />
                </div>
            );
        }

        return (
            <OpenOrders
                headersKeys={headersKeys}
                headers={renderHeaders}
                data={renderData(list)}
                onCancel={handleCancel}
            />
        );
    }, [fetching, list]);

    return (
        <div className={classNames}>
            <div className="cr-table-header__content">
                <div className="cr-title-component">
                    <span>{translate('page.body.trade.header.openOrders')}</span>
                    <Form className="cr-title-component__checkbox" onClick={handleToggleCheckbox}>
                        <Form.Check
                            type="checkbox"
                            custom
                            id="hideOtherPairs"
                            checked={hideOtherPairs}
                            readOnly={true}
                            label={translate('page.body.trade.header.openOrders.hideOtherPairs')}
                        />
                    </Form>
                    <span className="cr-table-header__cancel" onClick={handleCancelAll}>
                        <FormattedMessage id="page.body.openOrders.header.button.cancelAll" />
                        <CloseIcon className="cr-table-header__close" />
                    </span>
                </div>
            </div>
            {renderContent}
        </div>
    );
}
