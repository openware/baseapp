import * as React from 'react';

const OrdersItemComponent = props => {
    return (
        <div key={props.key} className="pg-mobile-orders-item">
            Item {props.order.id}
        </div>
    );
};

export const OrdersItem = React.memo(OrdersItemComponent);
