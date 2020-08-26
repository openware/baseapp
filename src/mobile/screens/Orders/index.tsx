import * as React from 'react';
import { useRangerConnectFetch } from '../../../hooks';
import { Orders } from '../../components';

const OrdersMobileScreenComponent: React.FC = () => {
    useRangerConnectFetch();

    return (
        <div className="pg-mobile-orders-screen">
            <Orders />
        </div>
    );
};

export const OrdersMobileScreen = React.memo(OrdersMobileScreenComponent);
