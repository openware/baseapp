import * as React from 'react';
import { Orders } from '../../components';

const OrdersMobileScreenComponent: React.FC = () => (
    <div className="pg-mobile-orders-screen">
        <Orders />
    </div>
);

export const OrdersMobileScreen = React.memo(OrdersMobileScreenComponent);
