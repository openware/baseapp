import * as React from 'react';
import {
    useDepthFetch,
    useMarketsFetch,
    useMarketsTickersFetch,
    useRangerConnectFetch,
} from '../../../hooks';
import { CurrentMarketInfo, TradingTabs } from '../../components';

const TradingComponent: React.FC = () => {
    useMarketsFetch();
    useMarketsTickersFetch();
    useRangerConnectFetch();
    useDepthFetch();

    return (
        <div className="pg-trading-screen-mobile">
            <CurrentMarketInfo />
            <TradingTabs />
        </div>
    );
};

export const TradingScreenMobile = React.memo(TradingComponent);
