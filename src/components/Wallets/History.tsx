import { History, Pagination } from '@openware/components';
import * as moment from 'moment';
import * as React from 'react';
import {
    InjectedIntlProps,
    injectIntl,
    intlShape,
} from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { localeDate } from '../../helpers';
import {
    fetchHistory,
    List,
    resetHistory,
    RootState,
    selectCurrentPage,
    selectFirstElemIndex,
    selectFullHistory,
    selectHistory,
    selectHistoryLoading,
    selectLastElemIndex,
    selectNextPageExists,
    selectPageCount,
} from '../../modules';
import { FailIcon } from './FailIcon';
import { SucceedIcon } from './SucceedIcon';

export interface HistoryProps {
    label: string;
    type: string;
    currency: string;
}

export interface ReduxProps {
    list: List;
    fetching: boolean;
    fullHistory: number;
    page: number;
    pageCount: number;
    firstElemIndex: number;
    lastElemIndex: number;
    nextPageExists: boolean;
}

interface DispatchProps {
    fetchHistory: typeof fetchHistory;
    resetHistory: typeof resetHistory;
}

export type Props = HistoryProps & ReduxProps & DispatchProps & InjectedIntlProps;

export class WalletTable extends React.Component<Props> {
    //tslint:disable-next-line:no-any
    public static propTypes: React.ValidationMap<any> = {
        intl: intlShape.isRequired,
    };

    public componentDidMount() {
        const { type, currency } = this.props;
        this.props.fetchHistory({ page: 0, currency, type, limit: 6 });
    }

    public componentWillReceiveProps(nextProps) {
        const { type, currency } = this.props;
        if (nextProps.currency !== currency || nextProps.type !== type) {
            this.props.resetHistory();
            this.props.fetchHistory({ page: 0, currency: nextProps.currency, type, limit: 6 });
        }
    }

    public componentWillUnmount() {
        this.props.resetHistory();
    }
    // tslint:disable
    public render() {
        const { label, list, fullHistory, firstElemIndex, lastElemIndex, page, nextPageExists } = this.props;

        if (!list.length) {
            return null;
        }
        return (
            <div className="pg-history-elem__wallet">
                <div className="pg-history-elem__label">
                    {this.props.intl.formatMessage({ id: `page.body.history.${label}` })}
                </div>
                <History headers={this.getHeaders(label)} data={this.retrieveData(list)}/>
                <Pagination
                    firstElemIndex={firstElemIndex}
                    lastElemIndex={lastElemIndex}
                    total={fullHistory}
                    page={page}
                    nextPageExists={nextPageExists}
                    onClickPrevPage={this.onClickPrevPage}
                    onClickNextPage={this.onClickNextPage}
                />
            </div>
        );
    }

    private getHeaders = (label: string) => [
        this.props.intl.formatMessage({ id: `page.body.history.${label}.header.date`}),
        this.props.intl.formatMessage({ id: `page.body.history.${label}.header.status`}),
        this.props.intl.formatMessage({ id: `page.body.history.${label}.header.amount`}),
    ];

    private onClickPrevPage = () => {
        const { page, type, currency } = this.props;
        this.props.fetchHistory({ page: page - 1, currency, type, limit: 6 });
    };

    private onClickNextPage = () => {
        const { page, type, currency } = this.props;
        this.props.fetchHistory({ page: page + 1, currency, type, limit: 6 });
    };

    private retrieveData = list => {
        if (list.length === 0) {
            return [[this.props.intl.formatMessage({ id: 'page.noDataToShow'}), '', '']];
        }
        return [...list]
            .sort((a, b) => {
                return moment(localeDate(a.created_at), 'DD/MM HH:mm') > moment(localeDate(b.created_at), 'DD/MM HH:mm') ? -1 : 1;
            })
            .map(item => {
                return [
                    moment(item.created_at).format('DD-MM YYYY'),
                    this.formatTxState(item.state),
                    item.amount,
                ];
            });
    };

    private formatTxState = (tx: string) => {
        const statusMapping = {
            succeed: <SucceedIcon/>,
            failed: <FailIcon/>,
            accepted: <SucceedIcon/>,
            collected: <SucceedIcon/>,
            canceled: <FailIcon/>,
            rejected: <FailIcon/>,
            processing: this.props.intl.formatMessage({ id: 'page.body.wallets.table.pending'}),
            prepared: this.props.intl.formatMessage({ id: 'page.body.wallets.table.pending'}),
            submitted: this.props.intl.formatMessage({ id: 'page.body.wallets.table.pending'}),
        };
        return statusMapping[tx];
    };
}


export const mapStateToProps = (state: RootState): ReduxProps => ({
    list: selectHistory(state),
    fetching: selectHistoryLoading(state),
    fullHistory: selectFullHistory(state),
    page: selectCurrentPage(state),
    pageCount: selectPageCount(state, 6),
    firstElemIndex: selectFirstElemIndex(state, 6),
    lastElemIndex: selectLastElemIndex(state, 6),
    nextPageExists: selectNextPageExists(state, 6),
});

export const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        fetchHistory: params => dispatch(fetchHistory(params)),
        resetHistory: () => dispatch(resetHistory()),
    });

export const WalletHistory = injectIntl(connect(mapStateToProps, mapDispatchToProps)(WalletTable));
