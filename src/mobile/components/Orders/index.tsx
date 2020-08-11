import * as React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { CloseIcon } from '../../../assets/images/CloseIcon';
import { TabPanel } from '../../../components';
import { useUserOrdersHistoryFetch } from '../../../hooks';
import {
    ordersCancelAllFetch,
    selectOrdersHistory,
    selectShouldFetchCancelAll,
} from '../../../modules';
import { OrdersItem } from './OrdersItem';

const userOrdersHistoryTabs = ['open', 'all'];

const OrdersComponent = () => {
    const [currentTabIndex, setCurrentTabIndex] = React.useState(0);
    const dispatch = useDispatch();
    const intl = useIntl();
    const orders = useSelector(selectOrdersHistory);
    const shouldFetchCancelAll = useSelector(selectShouldFetchCancelAll);
    useUserOrdersHistoryFetch(0, userOrdersHistoryTabs[currentTabIndex], 25);

    const handleCancelAllOrders = () => {
        if (shouldFetchCancelAll) {
            dispatch(ordersCancelAllFetch());
        }
    };

    const renderOptionalHead = () => (
        <div className="pg-mobile-orders__optional-head" onClick={handleCancelAllOrders}>
            <span>{intl.formatMessage({id: 'page.mobile.orders.cancelAll'})}</span>
            <CloseIcon />
        </div>
    );

    const renderTab = (tabIndex: number) => (
        <div key={tabIndex} className="pg-mobile-orders__content">
            {orders.length ? (
                orders.map((order, index) => <OrdersItem order={order} key={index} />)
            ) : (
                <span className="no-data">{intl.formatMessage({id: 'page.noDataToShow'})}</span>
            )}
        </div>
    );

    const renderTabs = () => [
        {
            content: currentTabIndex === 0 ? renderTab(currentTabIndex) : null,
            label: intl.formatMessage({id: 'page.mobile.orders.tabs.open'}),
        },
        {
            content: currentTabIndex === 1 ? renderTab(currentTabIndex) : null,
            label: intl.formatMessage({id: 'page.mobile.orders.tabs.all'}),
        },
    ];

    return (
        <div className="pg-mobile-orders">
            <TabPanel
                panels={renderTabs()}
                currentTabIndex={currentTabIndex}
                onCurrentTabChange={setCurrentTabIndex}
                optionalHead={orders.length ? renderOptionalHead() : null}
            />
        </div>
    );
};

export const Orders = React.memo(OrdersComponent);
