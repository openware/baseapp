import { History } from '@openware/components';
import * as moment from 'moment';
import * as React from 'react';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { localeDate } from '../../helpers';
import {
    CurrencyHistory,
    fetchCurrencyHistory,
    resetCurrencyHistory,
    RootState,
    selectCurrencyHistory,
    selectCurrencyHistoryLoading,
    selectCurrentPage,
    selectFirstElemIndex,
    selectFullHistory,
    selectLastElemIndex,
    selectNextPageExists,
    selectPageCount,
} from '../../modules';
import { FailIcon } from './FailIcon';
import { NextPageIcon } from './NextPageIcon';
import { PreviousIcon } from './PreviousIcon';
import { SucceedIcon } from './SucceedIcon';


export interface HistoryProps {
    label: string;
    type: string;
    currency: string;
}

export interface ReduxProps {
    list: CurrencyHistory[];
    fetching: boolean;
    fullHistory: number;
    page: number;
    pageCount: number;
    firstElemIndex: number;
    lastElemIndex: number;
    nextPageExists: boolean;
}

interface DispatchProps {
    fetchCurrencyHistory: typeof fetchCurrencyHistory;
    resetCurrencyHistory: typeof resetCurrencyHistory;
}

export type Props = HistoryProps & ReduxProps & DispatchProps;

export class WalletTable extends React.Component<Props> {
    public componentDidMount() {
        const { type, currency } = this.props;
        this.props.fetchCurrencyHistory({ page: 0, currency, type, fullHistory: 0 });
    }

    public componentWillReceiveProps(nextProps) {
        const { type, currency } = this.props;
        if (nextProps.currency !== currency || nextProps.type !== type) {
            this.props.resetCurrencyHistory();
            this.props.fetchCurrencyHistory({ page: 0, currency: nextProps.currency, type, fullHistory: 0 });
        }
    }

    public componentWillUnmount() {
        this.props.resetCurrencyHistory();
    }

    public render() {
        const { label, list, fullHistory, firstElemIndex, lastElemIndex } = this.props;

        if (!list.length) {
            return null;
        }
        return (
            <div className="pg-history-elem">
                <div className="pg-history-elem__label">{label}</div>
                <History headers={['Date', 'Status', 'Amount']} data={this.retrieveData(list)}/>
                <div className="pg-history-elem__pagination">
                    <p>{firstElemIndex} - {lastElemIndex} of {fullHistory}</p>
                    <span className="pg-history__pagination-prev" onClick={this.onClickPrevPage}>
                        <PreviousIcon/>
                    </span>
                    <span className="pg-history__pagination-next" onClick={this.onClickNextPage}>
                        <NextPageIcon/>
                    </span>
                </div>
            </div>
        );
    }

    private onClickPrevPage = () => {
        const { page, type, currency, fullHistory } = this.props;
        if (page === 0) {
            return;
        }
        this.props.fetchCurrencyHistory({ page: page - 1, currency, type, fullHistory });
    };

    private onClickNextPage = () => {
        const { nextPageExists, page, type, currency, fullHistory } = this.props;
        if (!nextPageExists) {
            return;
        }
        this.props.fetchCurrencyHistory({ page: page + 1, currency, type, fullHistory });
    };

    private retrieveData = (list: CurrencyHistory[]) => {
        if (list.length === 0) {
            return [['There is no data to show...', '', '']];
        }
        return [...list]
            .sort((a: CurrencyHistory, b: CurrencyHistory) => {
                return moment(localeDate(a.created_at), 'DD/MM HH:mm') > moment(localeDate(b.created_at), 'DD/MM HH:mm') ? -1 : 1;
            })
            .map(item => {
                return [
                    moment(item.created_at).format('DD MMM YYYY'),
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
            processing: 'Pending',
            prepared: 'Pending',
            submitted: 'Pending',
        };
        return statusMapping[tx];
    };
}


export const mapStateToProps = (state: RootState): ReduxProps => ({
    list: selectCurrencyHistory(state),
    fetching: selectCurrencyHistoryLoading(state),
    fullHistory: selectFullHistory(state),
    page: selectCurrentPage(state),
    pageCount: selectPageCount(state),
    firstElemIndex: selectFirstElemIndex(state),
    lastElemIndex: selectLastElemIndex(state),
    nextPageExists: selectNextPageExists(state),
});

export const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        fetchCurrencyHistory: params => dispatch(fetchCurrencyHistory(params)),
        resetCurrencyHistory: () => dispatch(resetCurrencyHistory()),
    });

export const WalletHistory = connect(mapStateToProps, mapDispatchToProps)(WalletTable);
