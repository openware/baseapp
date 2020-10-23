import React, { useCallback, useEffect, useMemo } from 'react';
import { Spinner } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { Decimal, Table } from '../../components';
import { DEFAULT_MARKET } from '../../constants';
import { localeDate, setTradesType } from '../../helpers';
import { useReduxState } from '../../hooks';
import {
    fetchHistory,
    setCurrentPrice,
} from '../../modules';
import { handleHighlightValue } from './Market';

const timeFrom = String(Math.floor((Date.now() - 1000 * 60 * 60 * 24) / 1000));

export const RecentTradesYours: React.FC = () => {
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();

    const list = useReduxState((x) => x.user.history.list);
    const fetching = useReduxState((x) => x.user.history.fetching);
    const currentMarket = useReduxState((x) => x.public.markets.currentMarket) || DEFAULT_MARKET;
    const currentPrice = useReduxState((x) => x.user.orders.currentPrice);

    const headers = useMemo(
        () => [
            formatMessage({ id: 'page.body.trade.header.recentTrades.content.time' }),
            formatMessage({ id: 'page.body.trade.header.recentTrades.content.amount' }),
            formatMessage({ id: 'page.body.trade.header.recentTrades.content.price' }),
        ],
        [formatMessage]
    );

    const renderRow = useCallback((item, i) => {
        const { id, created_at, price, amount, side } = item;
        const priceFixed = currentMarket ? currentMarket.price_precision : 0;
        const amountFixed = currentMarket ? currentMarket.amount_precision : 0;
        const orderSide = side === 'sell' ? 'sell' : 'buy';
        const higlightedDate = handleHighlightValue(
            String(localeDate([...list][i - 1] ? [...list][i - 1].created_at : '', 'time')),
            String(localeDate(created_at, 'time'))
        );

        return [
            <span style={{ color: setTradesType(orderSide).color }} key={id}>
                {higlightedDate}
            </span>,
            <span style={{ color: setTradesType(orderSide).color }} key={id}>
                <Decimal key={id} fixed={amountFixed}>
                    {amount}
                </Decimal>
            </span>,
            <span style={{ color: setTradesType(orderSide).color }} key={id}>
                <Decimal key={id} fixed={priceFixed} prevValue={[...list][i - 1] ? [...list][i - 1].price : 0}>
                    {price}
                </Decimal>
            </span>,
        ];
    }, []);

    const handleOnSelect = useCallback((index: string) => {
        const priceToSet = list[Number(index)] ? Number(list[Number(index)].price) : 0;

        if (currentPrice !== priceToSet) {
            dispatch(setCurrentPrice(priceToSet));
        }
    }, []);

    useEffect(() => {
        dispatch(
            fetchHistory({
                type: 'trades',
                page: 0,
                time_from: timeFrom,
                market: currentMarket.id,
            })
        );
    }, [currentMarket.id]);

    return (
        <div>
            {fetching ? (
                <div className="cr-tab-content-loading">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <Table header={headers} data={list.length > 0 ? list.map(renderRow) : [[]]} onSelect={handleOnSelect} />
            )}
        </div>
    );
};
