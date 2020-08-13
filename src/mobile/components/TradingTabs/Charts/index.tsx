import * as React from 'react';
import { useIntl } from 'react-intl';
import { TabPanel } from '../../../../components';
import {
    OrderBook,
    RecentTrades,
    TradingChart,
} from '../../../../containers';
import { OrderButtons } from '../../index';

const ChartsComponent = props => {
    const intl = useIntl();
    const [currentTabIndex, setCurrentTabIndex] = React.useState(0);

    const renderTabs = () => [
        {
            content: currentTabIndex === 0 ? <OrderBook breakpoint={1} /> : null,
            label: intl.formatMessage({id: 'page.mobile.charts.label.orderBook'}),
        },
        {
            content: currentTabIndex === 1 ? <RecentTrades /> : null,
            label: intl.formatMessage({id: 'page.mobile.charts.label.trades'}),
        },
    ];

    return (
        <div className="pg-mobile-charts">
            <TradingChart />
            <TabPanel
                panels={renderTabs()}
                currentTabIndex={currentTabIndex}
                onCurrentTabChange={setCurrentTabIndex}
            />
            <OrderButtons redirectToCreateOrder={props.redirectToCreateOrder} />
        </div>
    );
};

export const Charts = React.memo(ChartsComponent);
