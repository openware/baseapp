import { Decimal, History, Pagination } from '@openware/components';
import * as React from 'react';
import {
    InjectedIntlProps,
    injectIntl,
} from 'react-intl';
import {connect, MapDispatchToPropsFunction} from 'react-redux';
import {
    localeDate,
    preciseData,
    setDepositStatusColor,
    setTradesType,
    setWithdrawStatusColor,
    uppercase,
} from '../../helpers';
import {
    fetchHistory,
    Market,
    RootState,
    selectCurrentPage,
    selectFirstElemIndex,
    selectFullHistory,
    selectHistory,
    selectHistoryLoading,
    selectLastElemIndex,
    selectMarkets,
    selectNextPageExists,
    selectPageCount,
    selectWallets,
    Wallet,
    WalletHistoryList,
} from '../../modules';

interface HistoryProps {
    type: string;
}

interface ReduxProps {
    marketsData: Market[];
    wallets: Wallet[];
    list: WalletHistoryList;
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
}

type Props = HistoryProps & ReduxProps & DispatchProps & InjectedIntlProps;

class HistoryComponent extends React.Component<Props> {
    public componentDidMount() {
        const { type } = this.props;
        this.props.fetchHistory({ page: 0, type, limit: 25 });
    }

    public render() {
        const { list, fetching } = this.props;
        return (
          <div className={`pg-history-elem ${list.length ? '' : 'pg-history-elem-empty'}`}>
              {list.length ? this.renderContent() : null}
              {!list.length && !fetching ? <p className="pg-history-elem__empty">{this.props.intl.formatMessage({id: 'page.noDataToShow'})}</p> : null}
          </div>
        );
    }

    public renderContent = () => {
        const { type, firstElemIndex, lastElemIndex, fullHistory, page, nextPageExists } = this.props;
        return (
            <React.Fragment>
                <History headers={this.renderHeaders(type)} data={this.retrieveData()}/>
                <Pagination
                    firstElemIndex={firstElemIndex}
                    lastElemIndex={lastElemIndex}
                    total={fullHistory}
                    page={page}
                    nextPageExists={nextPageExists}
                    onClickPrevPage={this.onClickPrevPage}
                    onClickNextPage={this.onClickNextPage}
                />
            </React.Fragment>
        );
    };

    private onClickPrevPage = () => {
        const { page, type } = this.props;
        this.props.fetchHistory({ page: Number(page) - 1, type, limit: 25 });
    };

    private onClickNextPage = () => {
        const { page, type } = this.props;
        this.props.fetchHistory({ page: Number(page) + 1, type, limit: 25 });
    };

    private renderHeaders = (type: string) => {
        switch (type) {
          case 'deposits':
              return [
                  this.props.intl.formatMessage({id: 'page.body.history.deposit.header.txid'}),
                  this.props.intl.formatMessage({id: 'page.body.history.deposit.header.date'}),
                  this.props.intl.formatMessage({id: 'page.body.history.deposit.header.currency'}),
                  this.props.intl.formatMessage({id: 'page.body.history.deposit.header.amount'}),
                  this.props.intl.formatMessage({id: 'page.body.history.deposit.header.status'}),
              ];
          case 'withdraws':
              return [
                  this.props.intl.formatMessage({id: 'page.body.history.withdraw.header.address'}),
                  this.props.intl.formatMessage({id: 'page.body.history.withdraw.header.date'}),
                  this.props.intl.formatMessage({id: 'page.body.history.withdraw.header.currency'}),
                  this.props.intl.formatMessage({id: 'page.body.history.withdraw.header.amount'}),
                  this.props.intl.formatMessage({id: 'page.body.history.withdraw.header.fee'}),
                  this.props.intl.formatMessage({id: 'page.body.history.withdraw.header.status'}),
              ];
          case 'trades':
              return [
                  this.props.intl.formatMessage({id: 'page.body.history.trade.header.date'}),
                  this.props.intl.formatMessage({id: 'page.body.history.trade.header.side'}),
                  this.props.intl.formatMessage({id: 'page.body.history.trade.header.market'}),
                  this.props.intl.formatMessage({id: 'page.body.history.trade.header.price'}),
                  this.props.intl.formatMessage({id: 'page.body.history.trade.header.amount'}),
                  this.props.intl.formatMessage({id: 'page.body.history.trade.header.funds'}),
              ];
          default:
              return [];
        }
    };


    private retrieveData = () => {
        const { type, list } = this.props;
        return [...list]
            .map(item => this.renderTableRow(type, item));
    };

    private renderTableRow = (type, item) => {
        const { marketsData, wallets } = this.props;
        switch (type) {
            case 'deposits': {
                const { txid, created_at, currency, amount } = item;
                const state = this.props.intl.formatMessage({id: `page.body.history.deposit.content.status.${item.state.toLowerCase()}`});
                const blockchainLink = this.getBlockchainLink(currency, txid);
                const wallet = wallets.find(obj => obj.currency === currency);
                return [
                    <a href={blockchainLink} target="_blank" rel="noopener noreferrer" key={txid}>{txid}</a>,
                    localeDate(created_at),
                    currency.toUpperCase(),
                    wallet && preciseData(amount, wallet.fixed),
                    <span style={{ color: setDepositStatusColor(item.state) }} key={txid}>{state}</span>,
                ];
            }
            case 'withdraws': {
                const { txid, created_at, currency, amount, fee, rid } = item;
                const state = this.props.intl.formatMessage({id: `page.body.history.withdraw.content.status.${item.state.toLowerCase()}`});
                const blockchainLink = this.getBlockchainLink(currency, txid, rid);
                const wallet = wallets.find(obj => obj.currency === currency);
                return [
                    <a href={blockchainLink} target="_blank" rel="noopener noreferrer" key={txid || rid}>{txid || rid}</a>,
                    localeDate(created_at),
                    uppercase(currency),
                    wallet && preciseData(amount, wallet.fixed),
                    fee,
                    <span style={{ color: setWithdrawStatusColor(item.state) }} key={txid || rid}>{state}</span>,
                ];
            }
            case 'trades': {
                const { id, created_at, side, market, price, funds, volume } = item;
                const marketToDisplay = marketsData.find(m => m.id === market) ||
                    { name: '', bid_precision: 0, ask_precision: 0 };
                const marketName = marketToDisplay ? marketToDisplay.name : market;
                const sideText = setTradesType(side).text.toLowerCase() ? this.props.intl.formatMessage({id: `page.body.history.trade.content.side.${setTradesType(side).text.toLowerCase()}`}) : '';
                return [
                    localeDate(created_at),
                    <span style={{ color: setTradesType(side).color }} key={id}>{sideText}</span>,
                    marketName,
                    <Decimal key={id} fixed={marketToDisplay.bid_precision}>{price}</Decimal>,
                    <Decimal key={id} fixed={marketToDisplay.ask_precision}>{volume}</Decimal>,
                    <Decimal key={id} fixed={marketToDisplay.bid_precision}>{funds}</Decimal>,
                ];
            }
            default: {
                return [];
            }
        }
    };

    private getBlockchainLink = (currency: string, txid: string, rid?: string) => {
        const currencyInfo = this.props.wallets.find(wallet => wallet.currency === currency);
        if (currencyInfo) {
            if (txid) {
                return currencyInfo.explorerTransaction.replace('#{txid}', txid);
            }
            if (rid) {
                return currencyInfo.explorerAddress.replace('#{address}', rid);
            }
        }
        return '';
    };
}


const mapStateToProps = (state: RootState): ReduxProps => ({
    marketsData: selectMarkets(state),
    wallets: selectWallets(state),
    list: selectHistory(state),
    fetching: selectHistoryLoading(state),
    fullHistory: selectFullHistory(state),
    page: selectCurrentPage(state),
    pageCount: selectPageCount(state, 25),
    firstElemIndex: selectFirstElemIndex(state, 25),
    lastElemIndex: selectLastElemIndex(state, 25),
    nextPageExists: selectNextPageExists(state, 25),
});


export const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        fetchHistory: params => dispatch(fetchHistory(params)),
    });

const HistoryElement = injectIntl(connect(mapStateToProps, mapDispatchToProps)(HistoryComponent));

export {
    HistoryElement,
};
