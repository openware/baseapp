import classnames from 'classnames';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { TabPanel } from '../../components';
import { resetHistory, selectUserLoggedIn } from '../../modules';
import { selectRecentTrades } from '../../modules/public/recentTrades';
import { RecentTradesMarket } from './Market';
import { RecentTradesYours } from './Yours';

interface State {
    tab: string;
    index: number;
}


export const RecentTrades = () => {
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();

    const [tab, setTab] = React.useState<State['tab']>('market');
    const [index, setIndex] = React.useState<State['index']>(0);
    const userLoggedIn = useSelector(selectUserLoggedIn);
    const recentTrades = useSelector(selectRecentTrades);

    const className = React.useMemo(() => classnames({
        'cr-table__noData': !recentTrades.length,
    }), [recentTrades.length]);

    const cn = React.useMemo(() => {
        return classnames('pg-recent-trades', {
            'pg-recent-trades-unlogged' : !userLoggedIn,
        });
    }, [userLoggedIn]);

    const handleMakeRequest = React.useCallback((i: number) => {
        const tabMapping = ['market', 'yours'];
        if (tab === tabMapping[i]) {
            return;
        }

        setTab(tabMapping[i]);
        setIndex(i);
        dispatch(resetHistory());
    }, [dispatch, tab]);

    const renderContent = React.useCallback(() => {
        const optionalHead = formatMessage({ id: 'page.body.trade.header.recentTrades' });
        const tabs = [
            {
                content: tab === 'market' && index === 0 ? <RecentTradesMarket /> : null,
                label: formatMessage({ id: 'page.body.trade.header.market' }),
            },
            {
                content: tab === 'yours' ? <RecentTradesYours /> : null,
                label: formatMessage({ id: 'page.body.trade.header.yours' }),
            },
        ];

        return userLoggedIn ?
            (
                <TabPanel
                    panels={tabs}
                    onTabChange={handleMakeRequest}
                    optionalHead={optionalHead}
                    currentTabIndex={index}
                />
            ) :
            (
                <div>
                    <div className="cr-table-header__content">
                        <div className="cr-title-component">{optionalHead}</div>
                    </div>
                    <RecentTradesMarket />
                </div>
            );

    }, [handleMakeRequest, index, tab, userLoggedIn, formatMessage]);

    React.useEffect(() => {
        return () => {
            dispatch(resetHistory());
        };
    }, [dispatch]);

    return (
        <div className={className}>
            <div className={cn}>
                {renderContent()}
            </div>
        </div>
    );
};
