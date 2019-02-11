import * as React from 'react';
import { OrdersTab } from '../containers/OrdersTab';
import { Titled } from '../decorators';

@Titled('Orders')
class OrdersTabScreen extends React.Component {
    public render() {
        return (
            <OrdersTab/>
        );
    }
}

export {
    OrdersTabScreen,
};
