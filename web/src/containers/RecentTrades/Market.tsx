import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Table } from '../../components';
import { localeDate } from '../../helpers';
import {
    selectCurrentMarket,
    selectCurrentPrice,
    setCurrentPrice,
} from '../../modules';
import { recentTradesFetch } from '../../modules/public/recentTrades';
import { TradeTableCell } from './RecentTradesTableCell';

const handleHighlightValue = (prevValue: string, curValue: string) => {
    let highlighted = '';
    let val = curValue;
    let prev = prevValue;

    while (val !== prev && val.length > 0) {
        highlighted = val[val.length - 1] + highlighted;
        val = val.slice(0, -1);
        prev = prev.slice(0, -1);
    }

    return (
        <React.Fragment>
            <span className="cr-decimal__opacity">{val}</span>
            <span>{highlighted}</span>
        </React.Fragment>
    );
};

const RecentTradesMarket = ({ recentTrades }) => {
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();

    const currentMarket = useSelector(selectCurrentMarket);
    const currentPrice = useSelector(selectCurrentPrice);

    const headers = React.useMemo(() => {
        return [
            formatMessage({ id: 'page.body.trade.header.recentTrades.content.time' }),
            formatMessage({ id: 'page.body.trade.header.recentTrades.content.amount' }),
            formatMessage({ id: 'page.body.trade.header.recentTrades.content.price' }),
        ];
    }, []);

    const getTrades = React.useCallback(() => {
        const priceFixed = currentMarket ? currentMarket.price_precision : 0;
        const amountFixed = currentMarket ? currentMarket.amount_precision : 0;

        const renderRow = (item, i) => {
            const { created_at, taker_type, price, amount } = item;
            const higlightedDate = handleHighlightValue(String(localeDate(recentTrades[i - 1] ? recentTrades[i - 1].created_at : '', 'time')), String(localeDate(created_at, 'time')));

            return recentTrades ? [
                <TradeTableCell higlightedDate={higlightedDate} takerType={taker_type} type="date"/>,
                <TradeTableCell amount={amount} takerType={taker_type} amountFixed={amountFixed} type="amount"/>,
                <TradeTableCell
                    price={price}
                    priceFixed={priceFixed}
                    takerType={taker_type}
                    prevValue={recentTrades[i - 1] ? recentTrades[i - 1].price : 0}
                    amountFixed={amountFixed}
                    id={i}
                    type="price"
                />,
            ]: undefined;
        };

        return (recentTrades.length > 0)
            ? recentTrades.map(renderRow)
            : [[]];
    }, [currentMarket, recentTrades]);

    const handleOnSelect = React.useCallback((index: string) => {
        const priceToSet = recentTrades[Number(index)] ? Number(recentTrades[Number(index)].price) : 0;

        if (currentPrice !== priceToSet) {
            dispatch(setCurrentPrice(priceToSet));
        }
    }, [currentPrice, recentTrades]);

    React.useEffect(() => {
        if (currentMarket) {
            dispatch(recentTradesFetch(currentMarket));
        }
    }, [currentMarket]);

    const content = useMemo(() => {
        return (
            <Table
                data={getTrades()}
                header={headers}
                onSelect={handleOnSelect}
            />
        );
    }, [recentTrades, currentMarket])

    return (
        <div className="pg-recent-trades__markets">
            {content}
        </div>
    );
};

export {
    RecentTradesMarket,
    handleHighlightValue,
};
