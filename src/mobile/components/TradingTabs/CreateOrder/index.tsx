import * as React from 'react';
import { useSelector } from 'react-redux';

import { OpenOrders } from '../../';
import { OrderBook, OrderComponent } from '../../../../containers';
import { selectUserLoggedIn } from '../../../../modules';

const CreateOrderComponent = (props) => {
    const userLoggedIn = useSelector(selectUserLoggedIn);

    return (
        <div className="pg-mobile-create-order">
            <div className="pg-mobile-create-order__row-double">
                <OrderBook />
                <OrderComponent defaultTabIndex={props.currentOrderTypeIndex} />
            </div>
            {userLoggedIn ? <OpenOrders /> : null}
        </div>
    );
};

export const CreateOrder = React.memo(CreateOrderComponent);
