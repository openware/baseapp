import React, { FC, ReactElement, useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { Spinner } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { LeftArrowIcon } from '../../../assets/images/slider';
import { Decimal, History, Pagination } from '../../../components';
import { DEFAULT_CCY_PRECISION, DEFAULT_FIAT_PRECISION, DEFAULT_TABLE_PAGE_LIMIT } from '../../../../src/constants';
import {
    selectP2PTradesHistoryData,
    selectP2PTradesHistoryLoading,
    p2pTradesHistoryFetch,
    selectP2PTradesHistoryCurrentPage,
    selectP2PTradesHistoryTotalNumber,
    selectP2PTradesHistoryFirstElemIndex,
    selectP2PTradesHistoryLastElemIndex,
    selectP2PTradesHistoryNextPageExists,
    RootState,
    P2POrder,
    selectCurrencies,
} from '../../../modules';
import {
    setTradesType,
    setStateType,
    localeDate,
} from '../../../helpers';
import { isUsernameEnabled } from 'src/api';

const TradesHistory: FC = (): ReactElement => {
    const { formatMessage } = useIntl();
    const history = useHistory();
    const dispatch = useDispatch();

    const list = useSelector(selectP2PTradesHistoryData);
    const fetching = useSelector(selectP2PTradesHistoryLoading);
    const page = useSelector(selectP2PTradesHistoryCurrentPage);
    const total = useSelector(selectP2PTradesHistoryTotalNumber);
    const firstElemIndex = useSelector((state: RootState) => selectP2PTradesHistoryFirstElemIndex(state, DEFAULT_TABLE_PAGE_LIMIT));
    const lastElemIndex = useSelector((state: RootState) => selectP2PTradesHistoryLastElemIndex(state, DEFAULT_TABLE_PAGE_LIMIT));
    const nextPageExists = useSelector((state: RootState) => selectP2PTradesHistoryNextPageExists(state, DEFAULT_TABLE_PAGE_LIMIT));
    const currencies = useSelector(selectCurrencies);

    const translate = useCallback((id: string) => formatMessage({ id }), []);

    const onClickPrevPage = useCallback(() => {
        dispatch(p2pTradesHistoryFetch({ page: Number(page) - 1, limit: DEFAULT_TABLE_PAGE_LIMIT }));
    }, [p2pTradesHistoryFetch, page, DEFAULT_TABLE_PAGE_LIMIT]);

    const onClickNextPage = useCallback(() => {
        dispatch(p2pTradesHistoryFetch({ page: Number(page) + 1, limit: DEFAULT_TABLE_PAGE_LIMIT }));
    }, [p2pTradesHistoryFetch, page, DEFAULT_TABLE_PAGE_LIMIT]);

    const renderHeaders = useMemo(() => {
        return [
            translate('page.body.p2p.order_history.date'),
            translate('page.body.p2p.order_history.side'),
            translate('page.body.p2p.order_history.price'),
            translate('page.body.p2p.order_history.quantity'),
            translate('page.body.p2p.order_history.counterparty'),
            translate('page.body.p2p.order_history.status'),
        ];
    }, []);

    const renderTableRow = useCallback((item: P2POrder) => {
        const { created_at, side, amount, state, user_uid } = item;
        const { price, quote, base, user, uid } = item.offer;
        const sideColored = setTradesType(side);
        const stateColored = setStateType(state);
        const pricePrecision = currencies.find(item => item.id === quote)?.precision;
        const amountPrecision = currencies.find(item => item.id === base)?.precision;

        return [
            localeDate(created_at, 'fullDate'),
            <span style={{ color: sideColored.color }}>{sideColored.text}</span>,
            `${Decimal.format(price, pricePrecision || DEFAULT_FIAT_PRECISION, ',')} ${base.toUpperCase()}/${quote.toUpperCase()}`,
            `${Decimal.format(amount, amountPrecision || DEFAULT_CCY_PRECISION, ',')} ${base.toUpperCase()}`,
            <span>{user?.user_nickname || uid}</span>,
            <span style={{ color: stateColored.color }}>{stateColored.text}</span>,
        ];
    }, [currencies]);

    const retrieveData = useMemo(() => {
        return list.map(item => renderTableRow(item));
    }, [list, renderTableRow]);

    const onRowClick = useCallback((index: string) => {
        const orderId = list[index]?.id;
        orderId && history.push(`/p2p/order/${orderId}`);
    }, [list]);

    const renderContent = useMemo(() => {
        return (
            <div className="pg-p2p-trades-history">
                <h1>{translate('page.body.p2p.order_history.title')}</h1>
                <span className="pg-p2p-trades-history-back" onClick={() => history.push('/p2p')}>
                    <div className="pg-p2p-trades-history-back-arrow">
                        <LeftArrowIcon className="pg-p2p-trades-history-back-arrow-image"/>
                    </div>
                    {translate('page.body.p2p.order_history.back')}
                </span>
                <div className="cr-p2p-history-table">
                    <History headers={renderHeaders} data={retrieveData} onSelect={onRowClick}/>
                    {list.length > 0 &&
                    <Pagination
                        firstElemIndex={firstElemIndex}
                        lastElemIndex={lastElemIndex}
                        total={total}
                        page={page}
                        nextPageExists={nextPageExists}
                        onClickPrevPage={onClickPrevPage}
                        onClickNextPage={onClickNextPage}
                    />}
                </div>
            </div>
        );
    }, [list, firstElemIndex, lastElemIndex, total, page, nextPageExists]);

    React.useEffect(() => {
        dispatch(p2pTradesHistoryFetch({ limit: DEFAULT_TABLE_PAGE_LIMIT, page }));
    }, [dispatch]);

    const loader = useMemo(() => {
        return fetching && <div className="text-center"><Spinner animation="border" variant="primary" /></div>;
    }, [fetching]);

    const content = useMemo(() => {
        return list.length ? renderContent : null;
    }, [list]);

    const noData = useMemo(() => {
        return !list.length && !fetching ? <p className="pg-history-elem__empty">{translate('page.noDataToShow')}</p> : null;
    }, [list, fetching]);

    return (
        <div>
            {loader}
            {content}
            {noData}
        </div>
    );
};

export const P2PTradesHistory = React.memo(TradesHistory);
