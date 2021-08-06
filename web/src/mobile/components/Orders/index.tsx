import * as React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { CloseIcon } from '../../../assets/images/CloseIcon';
import { Pagination, TabPanel } from '../../../components';
import { useMarketsFetch, useUserOrdersHistoryFetch } from "../../../hooks";
import {
    ordersCancelAllFetch,
    ordersHistoryCancelFetch,
    RootState,
    selectOrdersFirstElemIndex,
    selectOrdersHistory,
    selectOrdersLastElemIndex,
    selectOrdersNextPageExists,
    selectShouldFetchCancelAll,
    selectShouldFetchCancelSingle,
} from '../../../modules';
import { OrdersItem } from './OrdersItem';

const userOrdersHistoryTabs = ['open', 'all'];

interface IOrdersComponentProps {
    withDropdownSelect?: boolean
}

const OrdersComponent: React.FC<IOrdersComponentProps> = ({ withDropdownSelect }) => {
    const [currentTabIndex, setCurrentTabIndex] = React.useState(0);
    const [currentPageIndex, setPageIndex] = React.useState(0);
    const dispatch = useDispatch();
    const intl = useIntl();
    const orders = useSelector(selectOrdersHistory);
    const shouldFetchCancelAll = useSelector(selectShouldFetchCancelAll);
    const shouldFetchCancelSingle = useSelector(selectShouldFetchCancelSingle);
    const firstElemIndex = useSelector((state: RootState) => selectOrdersFirstElemIndex(state, 25));
    const lastElemIndex = useSelector((state: RootState) => selectOrdersLastElemIndex(state, 25));
    const ordersNextPageExists = useSelector(selectOrdersNextPageExists);
    const filteredOrders = currentTabIndex === 0 ? orders.filter(o => ['wait', 'trigger_wait'].includes(o.state)) : orders;
    useUserOrdersHistoryFetch(currentPageIndex, userOrdersHistoryTabs[currentTabIndex], 25);
    useMarketsFetch();

    const handleCancelAllOrders = () => {
        if (shouldFetchCancelAll) {
            dispatch(ordersCancelAllFetch());
        }
    };

    const handleCancelSingleOrder = (id: number) => () => {
        if (shouldFetchCancelAll && shouldFetchCancelSingle) {
            dispatch(ordersHistoryCancelFetch({
                id,
                type: userOrdersHistoryTabs[currentTabIndex],
                list: filteredOrders,
            }));
        }
    };

    const onClickPrevPage = () => {
        setPageIndex(currentPageIndex - 1);
    };

    const onClickNextPage = () => {
        setPageIndex(currentPageIndex + 1);
    };

    const renderOptionalHead = () => (
        <div className="pg-mobile-orders__optional-head" onClick={handleCancelAllOrders}>
            <span>{intl.formatMessage({id: 'page.mobile.orders.cancelAll'})}</span>
            <CloseIcon />
        </div>
    );

    const renderTab = (tabIndex: number) => (
        <div key={tabIndex} className="pg-mobile-orders__content">
            {filteredOrders.length ? (
                filteredOrders.map((order, index) => (
                    <OrdersItem
                        key={index}
                        order={order}
                        handleCancel={handleCancelSingleOrder}
                    />
                ))
            ) : (
                <span className="no-data">{intl.formatMessage({id: 'page.noDataToShow'})}</span>
            )}
            <Pagination
                firstElemIndex={firstElemIndex}
                lastElemIndex={lastElemIndex}
                page={currentPageIndex}
                nextPageExists={ordersNextPageExists}
                onClickPrevPage={onClickPrevPage}
                onClickNextPage={onClickNextPage}
            />
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
                optionalHead={filteredOrders.length ? renderOptionalHead() : null}
                isDropdown={withDropdownSelect}
            />
        </div>
    );
};

export const Orders = React.memo(OrdersComponent);
