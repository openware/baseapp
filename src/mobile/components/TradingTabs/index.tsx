import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { TabPanel } from '../../../components';
import { TradingChart } from '../../../containers';
import { selectUserLoggedIn } from '../../../modules';
import { CreateOrder, Orders } from '../index';

const TradingTabsComponent = () => {
    const intl = useIntl();
    const userLoggedIn = useSelector(selectUserLoggedIn);
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
            disabled: !userLoggedIn,
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
