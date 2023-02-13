import * as React from 'react';
import { Spinner } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import {connect, MapDispatchToPropsFunction} from 'react-redux';
import { compose } from 'redux';
import { IntlProps } from '../../';
import { Decimal, History, Pagination } from '../../components';
import {
    localeDate,
    setDepositStatusColor,
    setTradesType,
    setTransferStatusColor,
    setWithdrawStatusColor,
    truncateMiddle,
} from '../../helpers';
import {
    Currency,
    fetchHistory,
    Market,
    RootState,
    selectCurrencies,
    selectCurrentPage,
    selectFirstElemIndex,
    selectHistory,
    selectHistoryLoading,
    selectLastElemIndex,
    selectMarkets,
    selectNextPageExists,
    selectWallets,
    Wallet,
    WalletHistoryList,
} from '../../modules';

interface HistoryProps {
    type: string;
}

interface ReduxProps {
    currencies: Currency[];
    marketsData: Market[];
    wallets: Wallet[];
    list: WalletHistoryList;
    fetching: boolean;
    page: number;
    firstElemIndex: number;
    lastElemIndex: number;
    nextPageExists: boolean;
}

interface DispatchProps {
    fetchHistory: typeof fetchHistory;
}

type Props = HistoryProps & ReduxProps & DispatchProps & IntlProps;

const defaultMarket = {
    market: '',
    price_precision: 0,
    amount_precision: 0,
    quote_unit: '',
    base_unit: ''
};

class HistoryComponent extends React.Component<Props> {
    public componentDidMount() {
        const { type } = this.props;

        const fetchParams = {
            page: 0,
            limit: 25,
            type,
            ...(type === 'quick_exchange' && { market_type: 'qe' }),
        };

        this.props.fetchHistory(fetchParams);
    }

    public render() {
        const { list, fetching } = this.props;

        return (
          <div className={`pg-history-elem ${list.length ? '' : 'pg-history-elem-empty'}`}>
              {fetching && <div className="text-center"><Spinner animation="border" variant="primary" /></div>}
              {list.length ? this.renderContent() : null}
              {!list.length && !fetching ? <p className="pg-history-elem__empty">{this.props.intl.formatMessage({id: 'page.noDataToShow'})}</p> : null}
          </div>
        );
    }

    public renderContent = () => {
        const { type, firstElemIndex, lastElemIndex, page, nextPageExists } = this.props;

        return (
            <React.Fragment>
                <History headers={this.renderHeaders(type)} data={this.retrieveData()}/>
                <Pagination
                    firstElemIndex={firstElemIndex}
                    lastElemIndex={lastElemIndex}
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
                    this.props.intl.formatMessage({id: 'page.body.history.deposit.header.blockchain'}),
                    this.props.intl.formatMessage({id: 'page.body.history.deposit.header.date'}),
                    this.props.intl.formatMessage({id: 'page.body.history.deposit.header.currency'}),
                    this.props.intl.formatMessage({id: 'page.body.history.deposit.header.amount'}),
                    this.props.intl.formatMessage({id: 'page.body.history.deposit.header.status'}),
                ];
            case 'withdraws':
                return [
                    this.props.intl.formatMessage({id: 'page.body.history.withdraw.header.address'}),
                    this.props.intl.formatMessage({id: 'page.body.history.withdraw.header.blockchain'}),
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
                    this.props.intl.formatMessage({id: 'page.body.history.trade.header.total'}),
                ];
            case 'transfers':
                return [
                    this.props.intl.formatMessage({id: 'page.body.history.transfer.header.date'}),
                    this.props.intl.formatMessage({id: 'page.body.history.transfer.header.amount'}),
                    this.props.intl.formatMessage({id: 'page.body.history.transfer.header.currency'}),
                    this.props.intl.formatMessage({id: 'page.body.history.transfer.header.direction'}),
                    this.props.intl.formatMessage({id: 'page.body.history.transfer.header.toAccount'}),
                    this.props.intl.formatMessage({id: 'page.body.history.transfer.header.status'}),
                ];
            case 'quick_exchange':
                return [
                    this.props.intl.formatMessage({id: 'page.body.history.quick.header.date'}),
                    this.props.intl.formatMessage({id: 'page.body.history.quick.header.amountGive'}),
                    this.props.intl.formatMessage({id: 'page.body.history.quick.header.currencyGive'}),
                    this.props.intl.formatMessage({id: 'page.body.history.quick.header.amountReceive'}),
                    this.props.intl.formatMessage({id: 'page.body.history.quick.header.currencyReceive'}),
                    this.props.intl.formatMessage({id: 'page.body.history.quick.header.status'}),
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
        const {
            currencies,
            intl,
            marketsData,
            wallets,
        } = this.props;
        switch (type) {
            case 'deposits': {
                const { amount, confirmations, created_at, currency, txid, blockchain_key, protocol } = item;
                const blockchainLink = this.getBlockchainLink(currency, blockchain_key, txid);
                const wallet = wallets.find(obj => obj.currency === currency);
                const itemCurrency = currencies && currencies.find(cur => cur.id === currency);
                const blockchainCurrency = itemCurrency?.networks?.find(blockchain_cur => blockchain_cur.blockchain_key === item.blockchain_key);
                const minConfirmations = blockchainCurrency?.min_confirmations;
                const state = (item.state === 'submitted' && confirmations !== undefined && minConfirmations !== undefined) ? (
                    `${confirmations}/${minConfirmations}`
                ) : (
                    intl.formatMessage({id: `page.body.history.deposit.content.status.${item.state}`})
                );

                return [
                    <div className="pg-history-elem__hide" key={txid}>
                        <a href={blockchainLink} target="_blank" rel="noopener noreferrer">
                            {truncateMiddle(txid, 30)}
                        </a>
                    </div>,
                    protocol?.toUpperCase(),
                    localeDate(created_at, 'fullDate'),
                    currency?.toUpperCase(),
                    wallet && Decimal.format(amount, wallet.fixed, ','),
                    <span style={{ color: setDepositStatusColor(item.state) }} key={txid}>{state}</span>,
                ];
            }
            case 'withdraws': {
                const { txid, created_at, currency, amount, fee, rid, protocol } = item;
                const state = intl.formatMessage({ id: `page.body.history.withdraw.content.status.${item.state}` });
                const blockchainLink = this.getBlockchainLink(currency, txid, rid);
                const wallet = wallets.find(obj => obj.currency === currency);

                return [
                    <div className="pg-history-elem__hide" key={txid || rid}>
                        <a href={blockchainLink} target="_blank" rel="noopener noreferrer">
                            {truncateMiddle(txid || rid, 30)}
                        </a>
                    </div>,
                    protocol?.toUpperCase(),
                    localeDate(created_at, 'fullDate'),
                    currency && currency.toUpperCase(),
                    wallet && Decimal.format(amount, wallet.fixed, ','),
                    wallet && Decimal.format(fee, wallet.fixed, ','),
                    <span style={{ color: setWithdrawStatusColor(item.state) }} key={txid || rid}>{state}</span>,
                ];
            }
            case 'trades': {
                const { id, created_at, side, market, price, amount, total } = item;
                const marketToDisplay = marketsData.find(m => m.id === market) ||
                    { name: '', price_precision: 0, amount_precision: 0 };
                const marketName = marketToDisplay ? marketToDisplay.name : market;
                const sideText = setTradesType(side).text.toLowerCase() ? intl.formatMessage({id: `page.body.history.trade.content.side.${setTradesType(side).text.toLowerCase()}`}) : '';

                return [
                    localeDate(created_at, 'fullDate'),
                    <span style={{ color: setTradesType(side).color }} key={id}>{sideText}</span>,
                    marketName,
                    <Decimal key={id} fixed={marketToDisplay.price_precision} thousSep=",">{price}</Decimal>,
                    <Decimal key={id} fixed={marketToDisplay.amount_precision} thousSep=",">{amount}</Decimal>,
                    <Decimal key={id} fixed={marketToDisplay.amount_precision} thousSep=",">{total}</Decimal>,
                ];
            }
            case 'transfers': {
                const { id, created_at, currency, amount, direction, receiver_username, receiver_uid } = item;
                const status = intl.formatMessage({ id: `page.body.history.transfer.content.status.${item.status}` });
                const wallet = wallets.find(obj => obj.currency === currency);

                const toAccount = receiver_username?.toUpperCase() || receiver_uid?.toUpperCase();

                return [
                    localeDate(created_at, 'fullDate'),
                    wallet && Decimal.format(amount, wallet.fixed, ','),
                    currency && currency.toUpperCase(),
                    direction && direction.replace(/^./, direction[0].toUpperCase()),
                    toAccount,
                    <span style={{ color: setTransferStatusColor(item.status) }} key={id}>{status}</span>,
                ];
            }
            case 'quick_exchange': {
                const { id, created_at, price, side, origin_volume, state, market } = item;
                const marketToDisplay = marketsData.find(m => m.id === market) || defaultMarket;

                let data;

                if (side === 'buy') {
                    data = {
                        amountGive: price * origin_volume,
                        amountReceive: origin_volume,
                        givePrecision: marketToDisplay.price_precision,
                        receivePrecision: marketToDisplay.amount_precision,
                        currencyGive: marketToDisplay.quote_unit.toUpperCase(),
                        currencyReceive: marketToDisplay.base_unit.toUpperCase(),
                    }
                } else {
                    data = {
                        amountGive: origin_volume,
                        amountReceive: price * origin_volume,
                        givePrecision: marketToDisplay.amount_precision,
                        receivePrecision: marketToDisplay.price_precision,
                        currencyGive: marketToDisplay.base_unit.toUpperCase(),
                        currencyReceive: marketToDisplay.quote_unit.toUpperCase(),
                    }
                }

                return [
                    localeDate(created_at, 'fullDate'),
                    <Decimal key={id} fixed={data.givePrecision} thousSep=",">{data.amountGive}</Decimal>,
                    data.currencyGive,
                    <Decimal key={id} fixed={data.receivePrecision} thousSep=",">{data.amountReceive}</Decimal>,
                    data.currencyReceive,
                    <span style={{ color: setTransferStatusColor(state) }} key={id}>{state}</span>,
                ];
            }
            default: {
                return [];
            }
        }
    };

    private getBlockchainLink = (currency: string, txid: string, blockchainKey: string, rid?: string) => {
        const { wallets } = this.props;
        const currencyInfo = wallets?.find(wallet => wallet.currency === currency);
        const blockchainCurrency = currencyInfo?.networks?.find(blockchain_cur => blockchain_cur.blockchain_key === blockchainKey);

        if (currencyInfo) {
            if (txid && blockchainCurrency?.explorerTransaction) {
                return blockchainCurrency.explorerTransaction.replace('#{txid}', txid);
            }
            if (rid && blockchainCurrency?.explorerAddress) {
                return blockchainCurrency.explorerAddress.replace('#{address}', rid);
            }
        }

        return '';
    };
}


const mapStateToProps = (state: RootState): ReduxProps => ({
    currencies: selectCurrencies(state),
    marketsData: selectMarkets(state),
    wallets: selectWallets(state),
    list: selectHistory(state),
    fetching: selectHistoryLoading(state),
    page: selectCurrentPage(state),
    firstElemIndex: selectFirstElemIndex(state, 25),
    lastElemIndex: selectLastElemIndex(state, 25),
    nextPageExists: selectNextPageExists(state, 25),
});


export const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        fetchHistory: params => dispatch(fetchHistory(params)),
    });

export const HistoryElement = compose(
    injectIntl,
    connect(mapStateToProps, mapDispatchToProps),
)(HistoryComponent) as any; // tslint:disable-line
