import classnames from 'classnames';
import React, { useCallback, useMemo } from 'react';
import { Spinner } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';

import { incrementalOrderBook } from '../../api';
import { Decimal } from '../../components/Decimal';
import { Markets } from '../../components/Markets';
import { useMarketsTickersFetch, useReduxState } from '../../hooks';
import { setCurrentPrice } from '../../modules';
import { Market, setCurrentMarket } from '../../modules/public/markets';
import { depthFetch } from '../../modules/public/orderBook';

export const MarketsComponent: React.FC = () => {
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const marketsData = useReduxState((x) => x.public.markets.list);
    const marketsLoading = useReduxState((x) => x.public.markets.loading);
    const marketTickers = useReduxState((x) => x.public.markets.tickers);
    const currentMarket = useReduxState((x) => x.public.markets.currentMarket);

    const headers = useMemo(
        () => [
            formatMessage({ id: 'page.body.trade.header.markets.content.pair' }),
            formatMessage({ id: 'page.body.trade.header.markets.content.price' }),
            formatMessage({ id: 'page.body.trade.header.markets.content.change' }),
        ],
        []
    );

    const mapMarkets = useCallback(() => {
        const defaultTicker = {
            last: 0,
            price_change_percent: '+0.00%',
        };

        return marketsData.map((market: Market) => [
            market.name,
            Decimal.format(Number((marketTickers[market.id] || defaultTicker).last), market.amount_precision),
            (marketTickers[market.id] || defaultTicker).price_change_percent,
        ]);
    }, [marketTickers, marketsData]);

    const handleOnSelect = useCallback(
        (index: string) => {
            const marketToSet = marketsData && marketsData.find((el) => el.name === index);
            dispatch(setCurrentPrice(0));

            if (marketToSet && (!currentMarket || currentMarket.id !== marketToSet.id)) {
                dispatch(setCurrentMarket(marketToSet));
                if (!incrementalOrderBook()) {
                    dispatch(depthFetch(marketToSet));
                }
            }
        },
        [currentMarket, marketsData]
    );

    const renderMarkets = useCallback(() => {
        const key = currentMarket && currentMarket.name;

        return (
            <Markets
                filters={false}
                data={mapMarkets()}
                rowKeyIndex={0}
                onSelect={handleOnSelect}
                selectedKey={key}
                headers={headers}
                title={formatMessage({ id: 'page.body.trade.header.markets' })}
                filterPlaceholder={formatMessage({ id: 'page.body.trade.header.markets.content.search' })}
            />
        );
    }, [currentMarket, handleOnSelect, headers, mapMarkets]);

    const className = useMemo(
        () =>
            classnames('pg-markets', {
                'pg-markets--loading': marketsLoading,
            }),
        [marketsLoading]
    );

    useMarketsTickersFetch();

    return (
        <div className={className}>
            {marketsLoading ? (
                <div>
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                renderMarkets()
            )}
        </div>
    );
};
