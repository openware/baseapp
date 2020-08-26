import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { TabPanel } from '../../../components';
import { selectUserLoggedIn } from '../../../modules';
import { Orders } from '../index';
import { Charts } from './Charts';
import { CreateOrder } from './CreateOrder';

const TradingTabsComponent: React.FC = () => {
    const intl = useIntl();
    const userLoggedIn = useSelector(selectUserLoggedIn);
    const [currentTabIndex, setCurrentTabIndex] = React.useState(0);
    const [currentOrderType, setCurrentOrderType] = React.useState(0);

    const redirectToCreateOrder = (index: number) => {
        setCurrentTabIndex(0);
        setCurrentOrderType(index);
    };

    const renderTabs = () => [
        {
            content: currentTabIndex === 0 ? <CreateOrder currentOrderTypeIndex={currentOrderType} /> : null,
            label: intl.formatMessage({id: 'page.mobile.tradingTabs.label.createOrder'}),
        },
        {
            content: currentTabIndex === 1 ? <Charts redirectToCreateOrder={redirectToCreateOrder} /> : null,
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
