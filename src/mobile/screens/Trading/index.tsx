import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    marketsFetch,
    marketsTickersFetch,
    selectMarkets,
    selectMarketsLoading,
    selectUserLoggedIn,
} from '../../../modules';
import { rangerConnectFetch } from '../../../modules/public/ranger';
import { selectRanger } from '../../../modules/public/ranger/selectors';
import { CurrentMarketInfo } from '../../components';

const TradingComponent = () => {
    const dispatch = useDispatch();
    const userLoggedIn = useSelector(selectUserLoggedIn);
    const { connected, withAuth } = useSelector(selectRanger);
    const markets = useSelector(selectMarkets);
    const marketsLoading = useSelector(selectMarketsLoading);

    React.useEffect(() => {
        if (!connected) {
            dispatch(rangerConnectFetch({ withAuth: userLoggedIn }));
        }

        if (connected && !withAuth && userLoggedIn) {
            dispatch(rangerConnectFetch({ withAuth: userLoggedIn }));
        }
    }, [dispatch, connected, withAuth, userLoggedIn]);

    React.useEffect(() => {
        if (!markets.length && !marketsLoading) {
            dispatch(marketsFetch());
            dispatch(marketsTickersFetch());
        }
    }, [dispatch, withAuth, markets, marketsLoading]);

    return (
        <div className="pg-trading-screen-mobile">
            <CurrentMarketInfo />
        </div>
    );
};

export const TradingScreenMobile = React.memo(TradingComponent);
