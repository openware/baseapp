import React, { useEffect, useMemo } from 'react';
import { TradeHistoryWidget, VColumnProps } from '@openware/react-components';
import moment from 'moment';
import { useIntl } from 'react-intl';

import { Decimal } from '../../components';
import { PublicTrade, selectCurrentMarket } from '../../modules';
import { recentTradesFetch, selectRecentTradesOfCurrentMarket } from '../../modules/public/recentTrades';
import { useReduxSelector } from 'src/hooks';
import { useDispatch } from 'react-redux';

import './index.scss';

export const RecentTrades: React.FC = () => {
    const dispatch = useDispatch();
    const { formatMessage } = useIntl();
    const currentMarket = useReduxSelector(selectCurrentMarket);
    const recentTrades = useReduxSelector(selectRecentTradesOfCurrentMarket);

    useEffect(() => {
        if (currentMarket) {
            dispatch(recentTradesFetch(currentMarket));
        }
    }, [currentMarket]);

    const columns: VColumnProps<PublicTrade>[] = useMemo(() => {
        return currentMarket
            ? [
                  {
                      header: formatMessage({ id: 'page.body.trade.header.recentTrades.content.time' }),
                      align: 'left',
                      accessor: (x) => {
                          return moment(x.created_at).format('HH:mm');
                      },
                  },
                  {
                      header: formatMessage({ id: 'page.body.trade.header.recentTrades.content.amount' }),
                      align: 'right',
                      accessor: (x) => {
                          return <Decimal fixed={currentMarket.amount_precision}>{x.amount}</Decimal>;
                      },
                  },
                  {
                      header: formatMessage({ id: 'page.body.trade.header.recentTrades.content.price' }),
                      align: 'right',
                      accessor: (x) => {
                          return <Decimal fixed={currentMarket.price_precision}>{x.price}</Decimal>;
                      },
                  },
              ]
            : [];
    }, [currentMarket]);

    return currentMarket ? (
        <TradeHistoryWidget
            className="trade-history-widget"
            columns={columns}
            header={formatMessage({ id: 'page.body.trade.header.recentTrades' })}
            data={recentTrades}
        />
    ) : null;
};
