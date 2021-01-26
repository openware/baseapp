import * as React from 'react';
import { Decimal } from '../../components/Decimal';

const OrderBookTableRowComponent = props => {
    const { type, fixed, prevValue, price, total } = props;

    if (type === 'price') {
        return <span><Decimal fixed={fixed} prevValue={prevValue}>{price}</Decimal></span>;
    }

    return <Decimal fixed={fixed}>{total}</Decimal>;
};

export const OrderBookTableRow = React.memo(OrderBookTableRowComponent);
