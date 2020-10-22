import * as React from 'react';
import {
    injectIntl,
} from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { IntlProps } from '../../';
import { History, Pagination, WalletItemProps } from '../../components';
import { Decimal } from '../../components/Decimal';
import { localeDate } from '../../helpers';
import {
    currenciesFetch,
    Currency,
    fetchHistory,
    resetHistory,
    RootState,
    selectCurrencies,
    selectCurrentPage,
    selectFirstElemIndex,
    selectHistory,
    selectHistoryLoading,
    selectLastElemIndex,
    selectNextPageExists,
    selectWallets,
    WalletHistoryList,
} from '../../modules';
import { FailIcon } from './FailIcon';
import { SucceedIcon } from './SucceedIcon';

export interface HistoryProps {
    label: string;
    type: string;
    currency: string;
}

export interface ReduxProps {
    currencies: Currency[];
    list: WalletHistoryList;
    wallets: WalletItemProps[];
    fetching: boolean;
    page: number;
    firstElemIndex: number;
    lastElemIndex: number;
    nextPageExists: boolean;
}

interface DispatchProps {
    fetchCurrencies: typeof currenciesFetch;
    fetchHistory: typeof fetchHistory;
    resetHistory: typeof resetHistory;
}

export type Props = HistoryProps & ReduxProps & DispatchProps & IntlProps;

export class WalletTable extends React.Component<Props> {
    public componentDidMount() {
        const {
            currencies,
            currency,
            type,
        } = this.props;
        this.props.fetchHistory({ page: 0, currency, type, limit: 6 });

        if (!currencies.length) {
            this.props.fetchCurrencies();
        }
    }

    public componentWillReceiveProps(nextProps) {
        const {
            currencies,
            currency,
            type,
        } = this.props;
        if (nextProps.currency !== currency || nextProps.type !== type) {
            this.props.resetHistory();
            this.props.fetchHistory({ page: 0, currency: nextProps.currency, type, limit: 6 });
        }

        if (!currencies.length && nextProps.currencies.length) {
            this.props.fetchCurrencies();
        }
    }

    public componentWillUnmount() {
        this.props.resetHistory();
    }

    public render() {
        const { label, list, firstElemIndex, lastElemIndex, page, nextPageExists } = this.props;

        if (!list.length) {
            return null;
        }

        return (
            <div className="pg-history-elem__wallet">
                <div className="pg-history-elem__label">
                    {this.props.intl.formatMessage({ id: `page.body.history.${label}` })}
                </div>
                <History headers={this.getHeaders(label)} data={this.retrieveData(list)} />
                <Pagination
                    firstElemIndex={firstElemIndex}
                    lastElemIndex={lastElemIndex}
                    page={page}
                    nextPageExists={nextPageExists}
                    onClickPrevPage={this.onClickPrevPage}
                    onClickNextPage={this.onClickNextPage}
                />
            </div>
        );
    }

    private getHeaders = (label: string) => [
        this.props.intl.formatMessage({ id: `page.body.history.${label}.header.date` }),
        this.props.intl.formatMessage({ id: `page.body.history.${label}.header.status` }),
        this.props.intl.formatMessage({ id: `page.body.history.${label}.header.amount` }),
    ];

    private onClickPrevPage = () => {
        const { page, type, currency } = this.props;
        this.props.fetchHistory({ page: Number(page) - 1, currency, type, limit: 6 });
    };

    private onClickNextPage = () => {
        const { page, type, currency } = this.props;
        this.props.fetchHistory({ page: Number(page) + 1, currency, type, limit: 6 });
    };

    private retrieveData = list => {
        const {
            currency,
            currencies,
            intl,
            type,
            wallets,
        } = this.props;
        const { fixed } = wallets.find(w => w.currency === currency) || { fixed: 8 };
        if (list.length === 0) {
            return [[intl.formatMessage({ id: 'page.noDataToShow' }), '', '']];
        }

        return list.sort((a, b) => {
            return localeDate(a.created_at, 'fullDate') > localeDate(b.created_at, 'fullDate') ? -1 : 1;
        }).map((item, index) => {
            const amount = 'amount' in item ? Number(item.amount) : Number(item.price) * Number(item.volume);
            const confirmations = type === 'deposits' && item.confirmations;
            const itemCurrency = currencies && currencies.find(cur => cur.id === currency);
            const minConfirmations = itemCurrency && itemCurrency.min_confirmations;
            const state = 'state' in item ? this.formatTxState(item.state, confirmations, minConfirmations) : '';

            return [
                localeDate(item.created_at, 'fullDate'),
                state,
                <Decimal key={index} fixed={fixed} thousSep=",">{amount}</Decimal>,
            ];
        });
    };

    private formatTxState = (tx: string, confirmations?: number, minConfirmations?: number) => {
        const statusMapping = {
            succeed: <SucceedIcon />,
            failed: <FailIcon />,
            accepted: <SucceedIcon />,
            collected: <SucceedIcon />,
            canceled: <FailIcon />,
            rejected: <FailIcon />,
            processing: this.props.intl.formatMessage({ id: 'page.body.wallets.table.pending' }),
            prepared: this.props.intl.formatMessage({ id: 'page.body.wallets.table.pending' }),
            submitted: (confirmations !== undefined && minConfirmations !== undefined) ? (
                `${confirmations}/${minConfirmations}`
            ) : (
                this.props.intl.formatMessage({ id: 'page.body.wallets.table.pending' })
            ),
            skipped: <SucceedIcon />,
        };

        return statusMapping[tx];
    };
}


export const mapStateToProps = (state: RootState): ReduxProps => ({
    currencies: selectCurrencies(state),
    list: selectHistory(state),
    wallets: selectWallets(state),
    fetching: selectHistoryLoading(state),
    page: selectCurrentPage(state),
    firstElemIndex: selectFirstElemIndex(state, 6),
    lastElemIndex: selectLastElemIndex(state, 6),
    nextPageExists: selectNextPageExists(state, 6),
});

export const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        fetchCurrencies: () => dispatch(currenciesFetch()),
        fetchHistory: params => dispatch(fetchHistory(params)),
        resetHistory: () => dispatch(resetHistory()),
    });

export const WalletHistory = injectIntl(connect(mapStateToProps, mapDispatchToProps)(WalletTable)) as any;
