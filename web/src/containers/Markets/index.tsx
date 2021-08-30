import classnames from 'classnames';
import * as React from 'react';
import { Spinner } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { DEFAULT_PERCENTAGE_PRECISION } from 'src/constants';
import { incrementalOrderBook } from '../../api';
import { Decimal } from '../../components/Decimal';
import { Markets } from '../../components/Markets';
import { useMarketsTickersFetch } from '../../hooks';
import { setCurrentPrice, selectUserInfo } from '../../modules';
import {
    Market,
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
    const userData = useSelector(selectUserInfo);

    const headers = React.useMemo(() => ([
        formatMessage({ id: 'page.body.trade.header.markets.content.pair' }),
        formatMessage({ id: 'page.body.trade.header.markets.content.price' }),
        formatMessage({ id: 'page.body.trade.header.markets.content.change' }),
    ]), [formatMessage]);

    const formatPercentageValue = React.useCallback((value: string) => (
        <React.Fragment>
            {value?.charAt(0)}
            {Decimal.format(value?.slice(1, -1), DEFAULT_PERCENTAGE_PRECISION, ',')}
            %
        </React.Fragment>
    ), []);

    const mapMarkets = React.useMemo(() => {
        const defaultTicker = {
            last: 0,
            price_change_percent: '+0.00%',
        };

        return marketsData.map((market: Market) => {
            if (market.state && market.state === 'hidden' && userData.role !== 'admin' && userData.role !== 'superadmin') {
                return [null, null, null, null];
            }

            return ([
                market.name,
                Decimal.format(Number((marketTickers[market.id] || defaultTicker).last), market.price_precision, ','),
                formatPercentageValue((marketTickers[market.id] || defaultTicker).price_change_percent),
            ]);
        });
    }, [marketTickers, marketsData]);

    const handleOnSelect = React.useCallback((index: string) => {
        const marketToSet = marketsData && marketsData.find(el => el.name === index);
        dispatch(setCurrentPrice(0));

        if (marketToSet && (!currentMarket || currentMarket.id !== marketToSet.id)) {
            dispatch(setCurrentMarket(marketToSet));
            if (!incrementalOrderBook()) {
                dispatch(depthFetch(marketToSet));
            }
        }
    }, [currentMarket, dispatch, marketsData]);

    const renderMarkets = React.useCallback(() => {
        const key = currentMarket && currentMarket.name;
        const marketData = mapMarkets.filter(item => item[0] !== null);

        return (
            <div>
                <div className="cr-table-header__content">
                    <div className="cr-title-component">{formatMessage({id: 'page.body.trade.header.markets'})}</div>
                </div>
                <Markets
                    filters={false}
                    data={marketData}
                    rowKeyIndex={0}
                    onSelect={handleOnSelect}
                    selectedKey={key}
                    headers={headers}
                    filterPlaceholder={formatMessage({ id: 'page.body.trade.header.markets.content.search'})}
                />
            </div>
        );
    }, [currentMarket, formatMessage, handleOnSelect, headers, mapMarkets]);

    const className = React.useMemo(() => classnames('pg-markets', {
        'pg-markets--loading': marketsLoading,
    }), [marketsLoading]);

    useMarketsTickersFetch();

    return (
        <div className={className}>
            {marketsLoading ? <div><Spinner animation="border" variant="primary" /></div> : renderMarkets()}
        </div>
    );
};
