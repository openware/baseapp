import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { Table} from '../../../components';
import { FailIcon } from '../../../containers/Wallets/FailIcon';
import { SucceedIcon } from '../../../containers/Wallets/SucceedIcon';
import { localeDate } from '../../../helpers';
import { useCurrenciesFetch, useHistoryFetch, useWalletsFetch } from '../../../hooks';
import { selectCurrencies } from '../../../modules/public/currencies';
import { selectHistory } from '../../../modules/user/history';
import { selectWallets } from '../../../modules/user/wallets';
import { RowItem } from './Rowitem';

const HistoryTable = (props: any) => {
    const list = useSelector(selectHistory);
    const wallets = useSelector(selectWallets);
    const currencies = useSelector(selectCurrencies);
    const intl = useIntl();

    useWalletsFetch();
    useCurrenciesFetch();
    useHistoryFetch({ type: props.type, currency: props.currency });

    const formatTxState = (tx: string, confirmations?: number, minConfirmations?: number) => {
        const statusMapping = {
            succeed: 'Completed',
            failed: <FailIcon />,
            accepted: 'Accepted',
            collected: 'Collected',
            canceled: <FailIcon />,
            rejected: <FailIcon />,
            processing: intl.formatMessage({ id: 'page.body.wallets.table.pending' }),
            prepared: intl.formatMessage({ id: 'page.body.wallets.table.pending' }),
            submitted: (confirmations !== undefined && minConfirmations !== undefined) ? (
                `${confirmations}/${minConfirmations}`
            ) : (
                intl.formatMessage({ id: 'page.body.wallets.table.pending' })
            ),
            skipped: <SucceedIcon />,
        };

        return statusMapping[tx];
    };
    const retrieveData = () => {
        const {
            currency,
            type,
        } = props;
        const { fixed } = wallets.find(w => w.currency === currency) || { fixed: 8 };
        if (list.length === 0) {
            return [[intl.formatMessage({ id: 'page.noDataToShow' }), '', '']];
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
        </div>
    );
};

export {
    HistoryTable,
};
