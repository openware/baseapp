import * as React from 'react';
import {
    useMarketsFetch,
    useMarketsTickersFetch,
    useRangerConnectFetch,
} from '../../../hooks';
import { CurrentMarketInfo, TradingTabs } from '../../components';

const TradingComponent = () => {
    useMarketsFetch();
    useMarketsTickersFetch();
    useRangerConnectFetch();

    return (
        <div className="pg-trading-screen-mobile">
            <CurrentMarketInfo />
            <TradingTabs />
        </div>
    );
};

export const TradingScreenMobile = React.memo(TradingComponent);
