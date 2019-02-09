import {
    TabPanel,
} from '@openware/components';
import * as React from 'react';
import {
    connect,
    MapDispatchToPropsFunction,
} from 'react-redux';
import {
    marketsFetch,
    Order,
    ordersCancelAllFetch,
    RootState,
    selectOrders,
    userOrdersAllFetch,
} from '../../modules';
import { OrdersElement } from './OrdersElement';

interface ReduxProps {
    ordersData: Order[];
}

interface DispatchProps {
    marketsFetch: typeof marketsFetch;
    getAllOrdersData: typeof userOrdersAllFetch;
    ordersCancelAll: typeof ordersCancelAllFetch;
}

type Props = ReduxProps & DispatchProps;

class Orders extends React.PureComponent<Props> {
    public componentDidMount() {
        const { getAllOrdersData, marketsFetch} = this.props;//tslint:disable-line
        marketsFetch();
        getAllOrdersData();
    }

    public render() {
          const cancelAll = this.props.ordersData.length ? <React.Fragment><span onClick={this.handleCancelAll}>Cancel all<span className="pg-history-tab__close"/></span></React.Fragment> : null;

          return (
              <div className="pg-history-tab pg-container">
                  <div className="pg-history-tab__tabs-content">
                      <TabPanel
                          panels={this.renderTabs()}
                          onTabChange={this.handleMakeRequest}
                          optionalHead={cancelAll}
                      />
                  </div>
              </div>
          );
      }

    private handleMakeRequest = (index: number) => {
        this.renderTabs();
    };

    private renderTabs = () => {
        return [
            {
                content: <OrdersElement type="all" />,
                label: 'All',
            },
            {
                content: <OrdersElement type="open"/>,
                label: 'Open',
            },
        ];
    };

    private handleCancelAll = () => {
        this.props.ordersCancelAll();
    }
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    ordersData: selectOrders(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        marketsFetch: () => dispatch(marketsFetch()),
        getAllOrdersData: () => dispatch(userOrdersAllFetch()),
        ordersCancelAll: () => dispatch(ordersCancelAllFetch()),
    });

const OrdersTab = connect(mapStateToProps, mapDispatchToProps)(Orders);

export {
    OrdersTab,
};

