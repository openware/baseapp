import * as React from 'react';
import { useIntl } from 'react-intl';
import { TabPanel } from '../../../components';
import { TradingChart } from '../../../containers';

const TradingTabsComponent = () => {
    const intl = useIntl();
    const [currentTabIndex, setCurrentTabIndex] = React.useState(1);

    const renderTabs = () => [
        {
            content: currentTabIndex === 0 ? 'First content' : null,
            label: intl.formatMessage({id: 'page.mobile.tradingTabs.label.createOrder'}),
        },
        {
            content: currentTabIndex === 1 ? <TradingChart /> : null,
            label: intl.formatMessage({id: 'page.mobile.tradingTabs.label.charts'}),
        },
        {
            content: currentTabIndex === 2 ? 'Third content' : null,
            label: intl.formatMessage({id: 'page.mobile.tradingTabs.label.orders'}),
        },
    ];

    return (
        <div className="pg-mobile-trading-tabs">
            <TabPanel
                panels={renderTabs()}
                currentTabIndex={currentTabIndex}
                onCurrentTabChange={setCurrentTabIndex}
            />
        </div>
    );
};

export const TradingTabs = React.memo(TradingTabsComponent);
