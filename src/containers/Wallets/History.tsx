import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useLocalization, useReduxSelector } from 'src/hooks';

import { History, Pagination } from '../../components';
import { Decimal } from '../../components/Decimal';
import { localeDate } from '../../helpers';
import {
    fetchHistory,
    resetHistory,
    selectCurrencies,
    selectCurrentPage,
    selectFirstElemIndex,
    selectHistory,
    selectLastElemIndex,
    selectNextPageExists,
    selectWallets,
} from '../../modules';
import { FailIcon } from './FailIcon';
import { SucceedIcon } from './SucceedIcon';

interface Props {
    label: string;
    type: 'deposits' | 'withdraws';
    currency: string;
}

const PAGE_LIMIT = 6;

export const WalletHistory: React.FC<Props> = ({ label, type, currency }) => {
    const getText = useLocalization();
    const dispatch = useDispatch();

    const currencies = useReduxSelector(selectCurrencies);
    const list = useReduxSelector(selectHistory);
    const wallets = useReduxSelector(selectWallets);
    const page = useReduxSelector(selectCurrentPage);
    const firstElemIndex = useReduxSelector((x) => selectFirstElemIndex(x, PAGE_LIMIT));
    const lastElemIndex = useReduxSelector((x) => selectLastElemIndex(x, PAGE_LIMIT));
    const nextPageExists = useReduxSelector(selectNextPageExists);

    const headers = useMemo(() => {
        return [
            getText(`page.body.history.${label}.header.date`),
            getText(`page.body.history.${label}.header.status`),
            getText(`page.body.history.${label}.header.amount`),
        ];
    }, [label]);

    const formatTxState = useCallback((tx: string, confirmations?: number, minConfirmations?: number) => {
        const statusMapping = {
            succeed: <SucceedIcon />,
            failed: <FailIcon />,
            accepted: <SucceedIcon />,
            collected: <SucceedIcon />,
            canceled: <FailIcon />,
            rejected: <FailIcon />,
            processing: getText('page.body.wallets.table.pending'),
            prepared: getText('page.body.wallets.table.pending'),
            submitted:
                confirmations !== undefined && minConfirmations !== undefined
                    ? `${confirmations}/${minConfirmations}`
                    : getText('page.body.wallets.table.pending'),
            skipped: <SucceedIcon />,
        };

        return statusMapping[tx];
    }, []);

    const retrieveData = useMemo(() => {
        const { fixed } = wallets.find((w) => w.currency === currency) || { fixed: 8 };
        if (list.length === 0) {
            return [[]];
        }

        return list
            .sort((a, b) => {
                return localeDate(a.created_at, 'fullDate') > localeDate(b.created_at, 'fullDate') ? -1 : 1;
            })
            .map((item: any, index) => {
                const amount = 'amount' in item ? Number(item.amount) : Number(item.price) * Number(item.volume);
                const confirmations = type === 'deposits' ? item.confirmations : undefined;
                const itemCurrency = currencies && currencies.find((cur) => cur.id === currency);
                const minConfirmations = itemCurrency && itemCurrency.min_confirmations;
                const state = 'state' in item ? formatTxState(item.state, confirmations, minConfirmations) : '';

                return [
                    localeDate(item.created_at, 'fullDate'),
                    state,
                    <Decimal key={index} fixed={fixed} thousSep=",">
                        {amount}
                    </Decimal>,
                ];
            });
    }, [currency, currencies, type, wallets, formatTxState]);

    const handlePrevPage = useCallback(() => {
        dispatch(fetchHistory({ page: Number(page) - 1, currency, type, limit: PAGE_LIMIT }));
    }, [page, type, currency]);

    const handleNextPage = useCallback(() => {
        dispatch(fetchHistory({ page: Number(page) + 1, currency, type, limit: PAGE_LIMIT }));
    }, [page, type, currency]);

    useEffect(() => {
        dispatch(fetchHistory({ page: 0, currency, type, limit: PAGE_LIMIT }));
        return () => {
            dispatch(resetHistory());
        };
    }, [currency, type]);

    return list.length ? (
        <div className="pg-history-elem__wallet">
            <div className="pg-history-elem__label">{getText(`page.body.history.${label}`)}</div>
            <History headers={headers} data={retrieveData} />
            <Pagination
                firstElemIndex={firstElemIndex}
                lastElemIndex={lastElemIndex}
                page={page}
                nextPageExists={nextPageExists}
                onClickPrevPage={handlePrevPage}
                onClickNextPage={handleNextPage}
            />
        </div>
    ) : null;
};
