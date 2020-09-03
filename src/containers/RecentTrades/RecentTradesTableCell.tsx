import * as React from 'react';
import { Decimal } from '../../components/Decimal';
import { setTradeColor } from '../../helpers';

const TradeTableCellComponent = props => {
    const { type, takerType, higlightedDate, amountFixed, amount, priceFixed, price, prevValue } = props as any;

    if (type === 'date') {
        return <span style={{ color: setTradeColor(takerType).color }}>{higlightedDate}</span>;
    }

    if (type === 'amount') {
        return <span style={{ color: setTradeColor(takerType).color }}><Decimal fixed={amountFixed}>{amount}</Decimal></span>;
    }

    if (type === 'price') {
        return <span style={{ color: setTradeColor(takerType).color }}><Decimal fixed={priceFixed} prevValue={prevValue}>{price}</Decimal></span>;
    }

    return <span />;
};

const TradeTableCell = React.memo(TradeTableCellComponent);

export {
    TradeTableCell,
};
