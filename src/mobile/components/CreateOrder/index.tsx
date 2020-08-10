import * as React from 'react';
import { OrderBook, OrderComponent } from '../../../containers';

const CreateOrderComponent = () => {
    return (
        <div className="pg-mobile-create-order">
            <OrderBook />
            <OrderComponent />
        </div>
    );
};

export const CreateOrder = React.memo(CreateOrderComponent);
