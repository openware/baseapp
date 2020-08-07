import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    marketsFetch,
    marketsTickersFetch,
    selectMarkets,
    selectMarketsLoading,
    selectMarketsTimestamp,
    selectUserLoggedIn,
} from '../../../modules';
import { rangerConnectFetch } from '../../../modules/public/ranger';
import { selectRanger } from '../../../modules/public/ranger/selectors';
import { CurrentMarketInfo, TradingTabs } from '../../components';

const TradingComponent = () => {
    const dispatch = useDispatch();
    const userLoggedIn = useSelector(selectUserLoggedIn);
    const { connected, withAuth } = useSelector(selectRanger);
    const markets = useSelector(selectMarkets);
    const marketsLoading = useSelector(selectMarketsLoading);
    const marketsTimestamp = useSelector(selectMarketsTimestamp);

    React.useEffect(() => {
        if (!connected) {
            dispatch(rangerConnectFetch({ withAuth: userLoggedIn }));
        }

        if (connected && !withAuth && userLoggedIn) {
            dispatch(rangerConnectFetch({ withAuth: userLoggedIn }));
        }
    }, [dispatch, connected, withAuth, userLoggedIn]);

    React.useEffect(() => {
        if (!markets.length && !marketsLoading && !marketsTimestamp) {
            dispatch(marketsFetch());
            dispatch(marketsTickersFetch());
        }
    }, [dispatch, markets, marketsLoading, marketsTimestamp]);

    return (
        <div className="pg-trading-screen-mobile">
            <CurrentMarketInfo />
            <TradingTabs />
        </div>
    );
};

export const TradingScreenMobile = React.memo(TradingComponent);
