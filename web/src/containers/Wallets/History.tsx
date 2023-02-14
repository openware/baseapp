import * as React from 'react';
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { compose } from 'redux';
import { IntlProps } from '../../';
import { History, Pagination } from '../../components';
import { Decimal } from '../../components/Decimal';
import { localeDate } from '../../helpers';
import { LinkIcon } from '../../assets/images/LinkIcon';
import {
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
    selectWithdrawSuccess,
    Wallet,
    WalletHistoryList,
} from '../../modules';
import { FailIcon } from './FailIcon';
import { SucceedIcon } from './SucceedIcon';
import { PendingIcon } from './PendingIcon';

export interface HistoryProps {
    label: string;
    type: string;
    currency: string;
}

export interface ReduxProps {
    currencies: Currency[];
    list: WalletHistoryList;
    wallets: Wallet[];
    fetching: boolean;
    page: number;
    firstElemIndex: number;
    lastElemIndex: number;
    nextPageExists: boolean;
    withdrawSuccess?: boolean;
}

interface DispatchProps {
    fetchHistory: typeof fetchHistory;
    resetHistory: typeof resetHistory;
}

const rowsPerPage = 6;

export type Props = HistoryProps & ReduxProps & DispatchProps & IntlProps;

export class WalletTable extends React.Component<Props> {
    public componentDidMount() {
        const { currency, type } = this.props;

        this.props.fetchHistory({ page: 0, currency, type, limit: 6 });
    }

    public UNSAFE_componentWillReceiveProps(nextProps: Props) {
        const { currency, type } = this.props;

        if (nextProps.currency !== currency || nextProps.type !== type) {
            this.props.resetHistory();
            this.props.fetchHistory({ page: 0, currency: nextProps.currency, type, limit: rowsPerPage });
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
        this.props.intl.formatMessage({ id: `page.body.history.${label}.header.txid` }),
        this.props.intl.formatMessage({ id: `page.body.history.${label}.header.amount` }),
        this.props.intl.formatMessage({ id: `page.body.history.${label}.header.status` }),
    ];

    private onClickPrevPage = () => {
        const { page, type, currency } = this.props;
        this.props.fetchHistory({ page: Number(page) - 1, currency, type, limit: rowsPerPage });
    };

    private onClickNextPage = () => {
        const { page, type, currency } = this.props;
        this.props.fetchHistory({ page: Number(page) + 1, currency, type, limit: rowsPerPage });
    };

    private retrieveData = list => {
        const {
            currency,
            currencies,
            type,
            wallets,
        } = this.props;
        const { fixed } = wallets.find(w => w.currency === currency) || { fixed: 8 };

        if (!list.length) {
            return [[]];
        }

        return list.sort((a, b) => {
            return new Date(a) > new Date(b) ? -1 : 1;
        }).map(item => {
            const blockchainTxid = this.getBlockchainTxid(item);
            const blockchainLink = this.getBlockchainLink(currency, item.blockchain_key, blockchainTxid, item.rid);
            const amount = 'amount' in item ? Number(item.amount) : Number(item.price) * Number(item.volume);
            const confirmations = type === 'deposits' && item.confirmations;
            const itemCurrency = currencies && currencies.find(cur => cur.id === currency);
            const blockchainCurrency = itemCurrency?.networks?.find(blockchain_cur => blockchain_cur.blockchain_key === item.blockchain_key);
            const minConfirmations = blockchainCurrency?.min_confirmations;
            const state = 'state' in item ? this.formatTxState(item.state, confirmations, minConfirmations) : '';

            return [
                localeDate(item.created_at, 'shortDate'),
                <div className="pg-history-elem__hide" key={item.blockchain_txid || item.rid}>
                    <a href={blockchainLink} target="_blank" rel="noopener noreferrer">
                        {blockchainTxid || item.rid}
                    </a>
                    <LinkIcon className="pg-history-elem__link" />
                </div>,
                Decimal.format(amount, fixed, ','),
                state,
            ];
        });
    };

    private getBlockchainTxid = historyItem => {
        const { type } = this.props;
        return type === 'deposits' ? historyItem.txid : historyItem.blockchain_txid;
    };

    private getBlockchainLink = (currency: string, blockchainKey: string, txid: string, rid?: string) => {
        const { currencies } = this.props;
        const currencyInfo = currencies.find(c => c.id === currency);
        const blockchainCurrency = currencyInfo?.networks?.find(blockchain_cur => blockchain_cur.blockchain_key === blockchainKey);

        if (currencyInfo) {
            if (txid && blockchainCurrency?.explorer_transaction) {
                return blockchainCurrency.explorer_transaction.replace('#{txid}', txid);
            }
            if (rid && blockchainCurrency?.explorer_address) {
                return blockchainCurrency.explorer_address.replace('#{address}', rid);
            }
        }

        return '';
    };

    private formatTxState = (tx: string, confirmations?: number | string, minConfirmations?: number) => {
        const accepted = (
            <div className="accepted">
                <span className="label">{this.props.intl.formatMessage({ id: 'page.body.wallets.table.accepted' })}</span><SucceedIcon />
            </div>
        );

        const rejected = (
            <div className="rejected">
                <span className="label">{this.props.intl.formatMessage({ id: 'page.body.wallets.table.rejected' })}</span><FailIcon />
            </div>
        );

        const pending = (
            <div className="pending">
                <span className="label">{this.props.intl.formatMessage({ id: 'page.body.wallets.table.pending' })}</span><PendingIcon />
            </div>
        );

        const confirming = (
            <div className="pending">
                <span className="label">{this.props.intl.formatMessage({ id: 'page.body.wallets.table.confirming' })}</span><PendingIcon />
            </div>
        );

        const skipped = (
            <div className="rejected">
                <span className="label">{this.props.intl.formatMessage({ id: 'page.body.wallets.table.skipped' })}</span><FailIcon />
            </div>
        );

        const underReview = (
            <div className="pending">
                <span className="label">{this.props.intl.formatMessage({ id: 'page.body.wallets.table.under_review' })}</span><PendingIcon />
            </div>
        );

        const statusMapping = {
            succeed: accepted,
            failed: rejected,
            accepted: accepted,
            collected: accepted,
            canceled: rejected,
            rejected: rejected,
            processing: pending,
            fee_processing: pending,
            prepared: pending,
            confirming: confirming,
            submitted: (minConfirmations && confirmations && confirmations !== 'N/A') ? (
                `${confirmations}/${minConfirmations}`
            ) : (
                pending
            ),
            skipped: skipped,
            errored: <span className="rejected">{this.props.intl.formatMessage({ id: 'page.body.history.deposit.content.status.errored' })}</span>,
            under_review: underReview 
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
    withdrawSuccess: selectWithdrawSuccess(state),
});

export const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        fetchHistory: params => dispatch(fetchHistory(params)),
        resetHistory: () => dispatch(resetHistory()),
    });

export const WalletHistory = compose(
  connect(mapStateToProps, mapDispatchToProps),
  injectIntl,
)(WalletTable) as any;
