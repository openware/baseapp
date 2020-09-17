import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { Pagination, Table } from '../../../components';
import { DEFAULT_CCY_PRECISION } from '../../../constants';
import { localeDate } from '../../../helpers';
import { useCurrenciesFetch, useHistoryFetch, useWalletsFetch } from '../../../hooks';
import { RootState, selectCurrentPage, selectLastElemIndex, selectNextPageExists } from '../../../modules';
import { selectCurrencies } from '../../../modules/public/currencies';
import { selectFirstElemIndex, selectHistory } from '../../../modules/user/history';
import { selectWallets } from '../../../modules/user/wallets';
import { RowItem } from './Rowitem';

const DEFAULT_LIMIT = 6;

const HistoryTable = (props: any) => {
    const [currentPage, setCurrentPage] = React.useState(0);
    const intl = useIntl();
    const page = useSelector(selectCurrentPage);
    const list = useSelector(selectHistory);
    const wallets = useSelector(selectWallets);
    const currencies = useSelector(selectCurrencies);
    const firstElemIndex = useSelector((state: RootState) => selectFirstElemIndex(state, DEFAULT_LIMIT));
    const lastElemIndex = useSelector((state: RootState) => selectLastElemIndex(state, DEFAULT_LIMIT));
    const nextPageExists = useSelector((state: RootState) => selectNextPageExists(state, DEFAULT_LIMIT));

    useWalletsFetch();
    useCurrenciesFetch();
    useHistoryFetch({ type: props.type, currency: props.currency, limit: DEFAULT_LIMIT, page: currentPage });

    const onClickPrevPage = () => {
        setCurrentPage(Number(page) - 1);
    };
    const onClickNextPage = () => {
        setCurrentPage(Number(page) + 1);
    };
    const formatTxState = (tx: string, confirmations?: number, minConfirmations?: number) => {
        const statusMapping = {
            succeed: <span className="cr-mobile-history-table--success">{intl.formatMessage({ id: 'page.body.history.withdraw.content.status.succeed' })}</span>,
            failed:  <span className="cr-mobile-history-table--failed">{intl.formatMessage({ id: 'page.body.history.withdraw.content.status.failed' })}</span>,
            accepted: <span className="cr-mobile-history-table--success">{intl.formatMessage({ id: 'page.body.history.deposit.content.status.accepted' })}</span>,
            collected: <span className="cr-mobile-history-table--success">{intl.formatMessage({ id: 'page.body.history.deposit.content.status.collected' })}</span>,
            canceled: <span className="cr-mobile-history-table--failed">{intl.formatMessage({ id: 'page.body.history.deposit.content.status.canceled' })}</span>,
            rejected: <span className="cr-mobile-history-table--failed">{intl.formatMessage({ id: 'page.body.history.deposit.content.status.rejected' })}</span>,
            processing: <span className="cr-mobile-history-table--pending">{intl.formatMessage({ id: 'page.body.wallets.table.pending' })}</span>,
            prepared: <span className="cr-mobile-history-table--pending">{intl.formatMessage({ id: 'page.body.wallets.table.pending' })}</span>,
            submitted: <span className="cr-mobile-history-table--pending">{(confirmations !== undefined && minConfirmations !== undefined) ? (
                `${confirmations}/${minConfirmations}`
            ) : (
                intl.formatMessage({ id: 'page.body.wallets.table.pending' })
                )}</span>,
            skipped: <span className="cr-mobile-history-table--success">{intl.formatMessage({ id: 'page.body.history.deposit.content.status.skipped' })}</span>,
        };

        return statusMapping[tx];
    };
    const retrieveData = () => {
        const {
            currency,
            type,
        } = props;
        const { fixed } = wallets.find(w => w.currency === currency) || { fixed: DEFAULT_CCY_PRECISION };
        if (list.length === 0) {
            return [[]];
        }

        return list.sort((a, b) => {
            return localeDate(a.created_at, 'fullDate') > localeDate(b.created_at, 'fullDate') ? -1 : 1;
        }).map((item: any, index) => {
            const amount = 'amount' in item ? Number(item.amount) : Number(item.price) * Number(item.volume);
            const confirmations = type === 'deposits' && item.confirmations;
            const itemCurrency = currencies && currencies.find(cur => cur.id === currency);
            const minConfirmations = itemCurrency && itemCurrency.min_confirmations;
            const state = 'state' in item ? formatTxState(item.state, confirmations, minConfirmations) : '';

            return [
                <RowItem
                    amount={amount}
                    fixed={fixed}
                    currency={currency}
                    createdAt={item.created_at}
                />,
                state,
            ];
        });
    };
    const mapRows = row => {
        return <div className="cr-mobile-history-table__row">{row}</div>;
    };

    const tableData = retrieveData().map(row => row.map(mapRows));

    return (
        <div className="cr-mobile-history-table">
            <Table data={tableData}/>
            <Pagination
                firstElemIndex={firstElemIndex}
                lastElemIndex={lastElemIndex}
                page={page}
                nextPageExists={nextPageExists}
                onClickPrevPage={onClickPrevPage}
                onClickNextPage={onClickNextPage}
            />
        </div>
    );
};

export {
    HistoryTable,
};
