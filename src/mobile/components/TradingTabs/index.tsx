import * as React from 'react';
import { useIntl } from 'react-intl';
import { TabPanel } from '../../../components';
import { TradingChart } from '../../../containers';
import { CreateOrder, Orders } from '../index';

const TradingTabsComponent = () => {
    const intl = useIntl();
    const [currentTabIndex, setCurrentTabIndex] = React.useState(0);

    const renderTabs = () => [
        {
            content: currentTabIndex === 0 ? <CreateOrder /> : null,
            label: intl.formatMessage({id: 'page.mobile.tradingTabs.label.createOrder'}),
        },
        {
            content: currentTabIndex === 1 ? <TradingChart /> : null,
            label: intl.formatMessage({id: 'page.mobile.tradingTabs.label.charts'}),
        },
        {
            content: currentTabIndex === 2 ? <Orders /> : null,
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
