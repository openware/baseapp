import classnames from 'classnames';
import * as React from 'react';
import { Spinner } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { incrementalOrderBook } from '../../api';
import { Decimal } from '../../components/Decimal';
import { Markets } from '../../components/Markets';
import { setCurrentPrice } from '../../modules';
import {
    Market,
    marketsTickersFetch,
    selectCurrentMarket,
    selectMarkets,
    selectMarketsLoading,
    selectMarketTickers,
    setCurrentMarket,
} from '../../modules/public/markets';
import { depthFetch } from '../../modules/public/orderBook';


export const MarketsComponent = () => {
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const marketsData = useSelector(selectMarkets);
    const marketsLoading = useSelector(selectMarketsLoading);
    const marketTickers = useSelector(selectMarketTickers);
    const currentMarket = useSelector(selectCurrentMarket);

    const headers = React.useMemo(() => ([
        formatMessage({ id: 'page.body.trade.header.markets.content.pair' }),
        formatMessage({ id: 'page.body.trade.header.markets.content.price' }),
        formatMessage({ id: 'page.body.trade.header.markets.content.change' }),
    ]), [formatMessage]);


    const markets = () => {
        const key = currentMarket && currentMarket.name;

        return (
            <Markets
                filters={false}
                data={mapMarkets()}
                rowKeyIndex={0}
                onSelect={handleOnSelect}
                selectedKey={key}
                headers={headers}
                title={formatMessage({id: 'page.body.trade.header.markets'})}
                filterPlaceholder={formatMessage({ id: 'page.body.trade.header.markets.content.search'})}
            />
        );
    };

    const mapMarkets = () => {
        const defaultTicker = {
            last: 0,
            price_change_percent: '+0.00%',
        };

        return marketsData.map((market: Market) =>
            ([
                market.name,
                Decimal.format(Number((marketTickers[market.id] || defaultTicker).last), market.amount_precision),
                (marketTickers[market.id] || defaultTicker).price_change_percent,
            ]),
        );
    };

    const handleOnSelect = (index: string) => {
        const marketToSet = marketsData.find(el => el.name === index);
        dispatch(setCurrentPrice(0));

        if (marketToSet && (!currentMarket || currentMarket.id !== marketToSet.id)) {
            dispatch(setCurrentMarket(marketToSet));
            if (!incrementalOrderBook()) {
                dispatch(depthFetch(marketToSet));
            }
        }
    };

    const className = classnames('pg-markets', {
        'pg-markets--loading': marketsLoading,
    });


    React.useEffect(() => {
        if (marketsData.length === 0) {
            dispatch(marketsTickersFetch());
        }
    }, [marketsData.length, dispatch]);

    return (
        <div className={className}>
            {marketsLoading ? <div><Spinner animation="border" variant="primary" /></div> : markets()}
        </div>
    );
};
