import { History } from '@openware/components';
import * as moment from 'moment';
import * as React from 'react';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import {
    localeDate,
    preciseData,
    setDepositStatusColor,
    setTradesType,
    setWithdrawStatusColor,
    sliceString,
    uppercase,
} from '../../helpers';
import {
    Deposit,
    PrivateTrade,
    RootState,
    selectDeposits,
    selectMarkets,
    selectMarketsError,
    selectMarketsLoading,
    selectTrades,
    selectWallets,
    selectWithdraws,
    Wallet,
    walletsFetch,
    Withdraw,
} from '../../modules';
import { Market, marketsFetch } from '../../modules/markets';
import { Order } from '../../modules/orders';
import { CommonError } from '../../modules/types';

interface ReduxProps {
    deposits: Deposit[];
    marketsData: Market[];
    marketsLoading?: boolean;
    marketsError?: CommonError;
    trades: PrivateTrade[];
    wallets: Wallet[];
    withdraws: Withdraw[];
}

interface DispatchProps {
    markets: typeof marketsFetch;
    fetchWallets: typeof walletsFetch;
}

interface HistoryProps {
    type: string;
}

type Props = HistoryProps & ReduxProps & DispatchProps;

class HistoryComponent extends React.Component<Props> {
    public componentDidMount() {
        if (this.props.marketsData.length < 2) {
            this.props.markets();
        }
        this.props.fetchWallets();
    }

    public render() {
        const { type } = this.props;
        const headers = this.renderHeaders(type);
        return (
          <div className="pg-history-elem">
              <History
                headers={headers}
                data={this.retrieveData(type)}
              />
          </div>
        );
    }

    private renderHeaders = (type: string) => {
      switch (type) {
        case 'deposit':
          return ['txID', 'Date', 'Currency', 'Amount', 'Status'];
        case 'withdraw':
          return ['ID', 'Date', 'Currency', 'Address', 'Amount', 'Fee', 'Status'];
        case 'trade':
          return ['ID', 'Date', 'Side', 'Market', 'Price', 'Amount', 'Funds'];
        default:
          return ['txID', 'Date', 'Currency', 'Amount', 'Status', 'Balance'];
      }
    };

    private retrieveData = (type: string) => {
        const data = this.sortDataByDateTime(this.props[`${type}s`]);
        const renderRow = item => this.renderTableRow(type, item);

        if (type === 'deposit') {
            return (data.length > 0) ? data.map(renderRow) : [['There is no data to show...', '', '', '', '']];
        }
        return (data.length > 0) ? data.map(renderRow) : [['There is no data to show...', '', '', '', '', '', '']];
    }

    private sortDataByDateTime(data: Order[]) {
        const sortByDateTime = (a: Order, b: Order) => {
            return moment(localeDate(a.created_at), 'DD/MM HH:mm') > moment(localeDate(b.created_at), 'DD/MM HH:mm') ? -1 : 1;
        };

        return [...data].sort(sortByDateTime);
    }

    private renderTableRow = (type, item) => {
        switch (type) {
            case 'deposit': {
                const { txid, created_at, currency, amount, state } = item;
                const blockchainLink = this.getBlockchainLink(currency, txid);
                const wallet = this.props.wallets.find(obj => {
                    return obj.currency === currency;
                });
                return [
                    <a href={blockchainLink} target="_blank" rel="noopener noreferrer" key={txid}>{txid}</a>,
                    localeDate(created_at),
                    currency.toUpperCase(),
                    wallet && preciseData(amount, wallet.fixed),
                    <span style={{ color: setDepositStatusColor(state) }} key={txid}>{state}</span>,
                ];
            }
            case 'withdraw': {
                const { id, txid, created_at, currency, amount, state, fee, rid } = item;
                const blockchainLink = this.getBlockchainLink(currency, txid, rid);
                const wallet = this.props.wallets.find(obj => {
                    return obj.currency === currency;
                });
                return [
                    id,
                    localeDate(created_at),
                    uppercase(currency),
                    <a href={blockchainLink} target="_blank" rel="noopener noreferrer" key={txid || rid}>{txid || rid}</a>,
                    wallet && preciseData(amount, wallet.fixed),
                    fee,
                    <span style={{ color: setWithdrawStatusColor(state) }} key={txid || rid}>{state}</span>,
                ];
            }
            case 'trade': {
                const { marketsData } = this.props;
                const { id, created_at, side, market, price, funds, volume } = item;
                const marketToDisplay = marketsData.find(m => m.id === market);
                const marketName = marketToDisplay ? marketToDisplay.name : market;
                return [
                    id,
                    localeDate(created_at),
                    <span style={{ color: setTradesType(side).color }} key={id}>{setTradesType(side).text}</span>,
                    marketName,
                    marketToDisplay && preciseData(price, marketToDisplay.bid_precision),
                    marketToDisplay && preciseData(volume, marketToDisplay.ask_precision),
                    marketToDisplay && preciseData(funds, marketToDisplay.bid_precision),
                ];
            }
            default: {
                const { txid, created_at, currency, amount, state } = item;
                const blockchainLink = this.getBlockchainLink(currency, txid);
                return [
                    <a href={blockchainLink} target="_blank" rel="noopener noreferrer" key={txid}>{sliceString(txid, 7)}</a>,
                    localeDate(created_at),
                    uppercase(currency),
                    amount,
                    state,
                ];
            }
        }
    }

    private getBlockchainLink = (currency: string, txid: string, rid?: string) => {
        const currencyInfo = this.props.wallets.find(wallet => wallet.currency === currency);
        if (currencyInfo) {
            if (txid) {
              return currencyInfo.explorerTransaction.replace('#{txid}', txid);
            } else {
                if (rid) {
                   return currencyInfo.explorerAddress.replace('#{address}', rid);
                }
            }
        }
        return '';
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    deposits: selectDeposits(state),
    marketsData: selectMarkets(state),
    marketsError: selectMarketsError(state),
    marketsLoading: selectMarketsLoading(state),
    trades: selectTrades(state),
    wallets: selectWallets(state),
    withdraws: selectWithdraws(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        fetchWallets: () => dispatch(walletsFetch()),
        markets: () => dispatch(marketsFetch()),
    });

export const HistoryElement = connect(mapStateToProps, mapDispatchToProps)(HistoryComponent);
