import * as React from 'react';
import { Spinner } from 'react-bootstrap';
<<<<<<< HEAD
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
=======
import {
    injectIntl,
} from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { compose } from 'redux';
import { IntlProps } from '../../';
>>>>>>> d459de118e31c1f432a0f6ded57fadf6dce991ce
import { Decimal, Table } from '../../components';
import { DEFAULT_MARKET } from '../../constants';
import { localeDate, setTradesType } from '../../helpers';
import {
    fetchHistory,
    selectCurrentMarket,
    selectCurrentPrice,
    selectHistory,
    selectHistoryLoading,
    setCurrentPrice,
} from '../../modules';
import { handleHighlightValue } from './Market';

const timeFrom = String(Math.floor((Date.now() - 1000 * 60 * 60 * 24) / 1000));

export const RecentTradesYours = () => {
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();

    const list = useSelector(selectHistory);
    const fetching = useSelector(selectHistoryLoading);
    const currentMarket = useSelector(selectCurrentMarket) || DEFAULT_MARKET;
    const currentPrice = useSelector(selectCurrentPrice);

    const headers = React.useMemo(() => ([
        formatMessage({ id: 'page.body.trade.header.recentTrades.content.time' }),
        formatMessage({ id: 'page.body.trade.header.recentTrades.content.amount' }),
        formatMessage({ id: 'page.body.trade.header.recentTrades.content.price' }),
    ]), [formatMessage]);

    const renderRow = (item, i) => {
        const { id, created_at, price, amount, side } = item;
        const priceFixed = currentMarket ? currentMarket.price_precision : 0;
        const amountFixed = currentMarket ? currentMarket.amount_precision : 0;
        const orderSide = side === 'sell' ?  'sell' : 'buy';
        const higlightedDate = handleHighlightValue(String(localeDate([...list][i - 1] ? [...list][i - 1].created_at : '', 'time')), String(localeDate(created_at, 'time')));

        return [
            <span style={{ color: setTradesType(orderSide).color }} key={id}>{higlightedDate}</span>,
            <span style={{ color: setTradesType(orderSide).color }} key={id}><Decimal key={id} fixed={amountFixed}>{amount}</Decimal></span>,
            <span style={{ color: setTradesType(orderSide).color }} key={id}><Decimal key={id} fixed={priceFixed} prevValue={[...list][i - 1] ? [...list][i - 1].price : 0}>{price}</Decimal></span>,
        ];
    };

    const retrieveData = () => {
        return list.length > 0
            ? list.map(renderRow)
            : [[]];
    };

    const renderContent = () => {
        return (
            <Table
                header={headers}
                data={retrieveData()}
                onSelect={handleOnSelect}
            />
        );
    };

    const handleOnSelect = (index: string) => {
        const priceToSet = list[Number(index)] ? Number(list[Number(index)].price) : 0;

        if (currentPrice !== priceToSet) {
            dispatch(setCurrentPrice(priceToSet));
        }
    };

    React.useEffect(() => {
        dispatch(fetchHistory({
            type: 'trades',
            page: 0,
            time_from: timeFrom,
            market: currentMarket.id,
        }));
    }, [dispatch, currentMarket.id]);

    return (
        <div>
            {fetching ? <div className="cr-tab-content-loading"><Spinner animation="border" variant="primary" /></div> : renderContent()}
        </div>
    );
};
