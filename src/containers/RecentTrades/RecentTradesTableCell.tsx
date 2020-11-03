import * as React from 'react';

import { Decimal } from '../../components/Decimal';
import { setTradeColor } from '../../helpers';

const TradeTableCellComponent = (props) => {
    const { type, takerType, higlightedDate, amountFixed, amount, priceFixed, price, prevValue } = props;

    switch (type) {
        case 'date':
            return <span style={{ color: setTradeColor(takerType).color }}>{higlightedDate}</span>;
        case 'amount':
            return (
                <span style={{ color: setTradeColor(takerType).color }}>
                    <Decimal fixed={amountFixed}>{amount}</Decimal>
                </span>
            );
        case 'price':
            return (
                <span style={{ color: setTradeColor(takerType).color }}>
                    <Decimal fixed={priceFixed} prevValue={prevValue}>
                        {price}
                    </Decimal>
                </span>
            );
        default:
            return <span />;
    }
};

const TradeTableCell = React.memo(TradeTableCellComponent);

export { TradeTableCell };
