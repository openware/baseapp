import * as React from 'react';
import { Button } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';

import { selectCurrentMarket } from '../../../modules';

const OrderButtonsComponent = (props) => {
    const intl = useIntl();
    const currentMarket = useSelector(selectCurrentMarket);

    return (
        <div className="cr-mobile-order-buttons">
            <Button onClick={(e) => props.redirectToCreateOrder(0)} size="lg" variant="success">
                {intl.formatMessage(
                    { id: 'page.mobile.orderButtons.buy' },
                    { base_unit: currentMarket ? currentMarket.base_unit : '' }
                )}
            </Button>
            <Button onClick={(e) => props.redirectToCreateOrder(1)} size="lg" variant="danger">
                {intl.formatMessage(
                    { id: 'page.mobile.orderButtons.sell' },
                    { base_unit: currentMarket ? currentMarket.base_unit : '' }
                )}
            </Button>
        </div>
    );
};

export const OrderButtons = React.memo(OrderButtonsComponent);
