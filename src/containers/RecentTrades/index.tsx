import React, { useEffect, useMemo, useState } from 'react';
import {
    Tab,
    Tabs,
    TradeHistoryWidget,
    VColumnProps,
} from '@openware/react-components';
import moment from 'moment';
import { useIntl } from 'react-intl';

import { Decimal } from '../../components';
import {
    fetchHistory,
    PublicTrade,
    selectCurrentMarket,
    selectHistory,
    selectUserLoggedIn,
    WalletHistoryList,
} from '../../modules';
import { recentTradesFetch, selectRecentTradesOfCurrentMarket } from '../../modules/public/recentTrades';
import { useReduxSelector } from 'src/hooks';
import { useDispatch } from 'react-redux';

import './index.scss';

export const highlightValue = (prevValue: string, curValue: string) => {
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
            <span className="highlight__opacity">{val}</span>
            <span>{highlighted}</span>
        </React.Fragment>
    );
};

export const RecentTrades: React.FC = () => {
    const dispatch = useDispatch();
    const { formatMessage } = useIntl();

    const [ trades, setTrades ] = useState<PublicTrade[] | WalletHistoryList>([]);
    const [ activeTabIndex, setActiveTabIndex ] = useState<number>(0);

    const currentMarket = useReduxSelector(selectCurrentMarket);
    const recentTrades = useReduxSelector(selectRecentTradesOfCurrentMarket);
    const userLoggedIn = useReduxSelector(selectUserLoggedIn);
    const userRecentTrades = useReduxSelector(selectHistory);

    useEffect(() => {
        if (recentTrades?.length && (!userLoggedIn || activeTabIndex === 0)) {
            setTrades(recentTrades);
        }
    }, [userLoggedIn, recentTrades, activeTabIndex]);

    useEffect(() => {
        if (userLoggedIn && userRecentTrades?.length && activeTabIndex === 1) {
            setTrades(userRecentTrades);
        }
    }, [userLoggedIn, userRecentTrades, activeTabIndex]);

    useEffect(() => {
        if (currentMarket?.id) {
            if (userLoggedIn) {
                dispatch(fetchHistory({
                    type: 'trades',
                    page: 0,
                    time_from: String(Math.floor((Date.now() - 1000 * 60 * 60 * 24) / 1000)),
                    market: currentMarket.id,
                }));
            } else {
                dispatch(recentTradesFetch(currentMarket));
            }
        }
    }, [currentMarket?.id, userLoggedIn]);

    const header = useMemo(() => {
        return userLoggedIn ? (
            <div className="widget-frame__tabs">
                <div className="widget-frame__tabs-text">
                    {formatMessage({ id: 'page.body.trade.header.recentTrades' })}
                </div>
                <Tabs onTabChange={setActiveTabIndex}>
                    <Tab panel={null}>
                        <p>{formatMessage({ id: 'page.body.trade.header.market' })}</p>
                    </Tab>
                    <Tab panel={null}>
                        <p>{formatMessage({ id: 'page.body.trade.header.yours' })}</p>
                    </Tab>
                </Tabs>
            </div>
        ) : (
            formatMessage({ id: 'page.body.trade.header.recentTrades' })
        );
    }, [userLoggedIn]);

    const columns: VColumnProps<PublicTrade>[] = useMemo(() => {
        return currentMarket?.id ? [
            {
                header: formatMessage({ id: 'page.body.trade.header.recentTrades.content.time' }),
                align: 'left',
                accessor: (x, i) => (
                    <span className={`vcell--${x.taker_type}`}>
                        {highlightValue(
                            trades[i - 1] ? moment(trades[i - 1].created_at).format('HH:mm:ss') : '',
                            moment(x.created_at).format('HH:mm:ss')
                        )}
                    </span>
                ),
            },
            {
                header: formatMessage({ id: 'page.body.trade.header.recentTrades.content.amount' }),
                align: 'right',
                accessor: (x) => {
                    return (
                        <span className={`vcell--${x.taker_type}`}>
                            <Decimal fixed={currentMarket.amount_precision}>{x.amount}</Decimal>
                        </span>
                    );
                },
            },
            {
                header: formatMessage({ id: 'page.body.trade.header.recentTrades.content.price' }),
                align: 'right',
                accessor: (x, i) => (
                    <span className={`vcell--${x.taker_type}`}>
                        <Decimal
                            fixed={currentMarket.price_precision}
                            prevValue={trades[i - 1] ? trades[i - 1].price : 0}
                        >
                            {x.price}
                        </Decimal>
                    </span>
                ),
            },
        ] : [];
    }, [currentMarket, trades]);

    return currentMarket?.id ? (
        <TradeHistoryWidget
            className="trade-history-widget"
            columns={columns}
            header={header}
            data={trades}
        />
    ) : null;
};
