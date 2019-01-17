import {
    Button,
    FilterInput,
    InputBlock,
    Modal,
    SummaryField,
    WalletItemProps,
    WalletTradeItem,
} from '@openware/components';
import * as React from 'react';
import {connect, MapDispatchToProps} from 'react-redux';
import {handleFilter} from '../../helpers';
import {
    marketsFetch,
    marketsTickersFetch,
    RootState,
    selectMarketTickers,
    selectWallets,
    selectWalletsError,
    selectWalletsLoading,
    walletsFetch,
} from '../../modules';
import { Market, selectMarkets } from '../../modules/markets';
import {
    MarketFees,
    orderExecuteFetch,
    selectFees,
    selectOrderExecuteError,
 } from '../../modules/orders';
import { CommonError, RangerEvent } from '../../modules/types';

import close = require('./close.svg');

interface ReduxProps {
    fees: MarketFees[];
    wallets: WalletItemProps[];
    executeError?: CommonError;
    marketsData: Market[];
    marketTickers: {
        [key: string]: RangerEvent,
    };
    walletsLoading?: boolean;
    walletsError?: CommonError;
}

interface DispatchProps {
    fetchWallets: typeof walletsFetch;
    markets: typeof marketsFetch;
    orderExecute: typeof orderExecuteFetch;
    tickers: typeof marketsTickersFetch;
}

interface ExchangeProps {
    type: 'sell' | 'buy';
}

type Props = ReduxProps & DispatchProps & ExchangeProps;

interface ExchangeState {
    amountFrom: number;
    amountTo: number;
    currentTickerValue: number;
    filteredWallets: WalletItemProps[] | null;
    loading: boolean;
    selectedWalletFrom: WalletItemProps | null;
    selectedWalletTo: WalletItemProps | null;
    showFrom: boolean;
    showSubmit: boolean;
    showTo: boolean;
    walletsFrom: WalletItemProps[];
    walletsTo: WalletItemProps[];
}

const defaultWallet = {
    currency: '',
    balance: 0,
};

class ExchangeComponent extends React.Component<Props, ExchangeState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            amountFrom: 0,
            amountTo: 0,
            currentTickerValue: 0,
            filteredWallets: null,
            loading: true,
            selectedWalletFrom: null,
            selectedWalletTo: null,
            showFrom: false,
            showSubmit: false,
            showTo: false,
            walletsFrom: [],
            walletsTo: [],
        };
    }

    public componentDidMount() {
        const { fees } = this.props;
        this.props.fetchWallets();
        this.props.markets();
        this.getTradingFees(fees);
    }

    public componentWillReceiveProps(props: Props) {
        const {selectedWalletFrom, selectedWalletTo} = this.state;

        if (selectedWalletTo && selectedWalletFrom) {
            this.setState({loading: false});
            this.getWalletsFromList(props);
            this.getWalletsToList(props, selectedWalletFrom);
            return;
        }

        if (props.marketsData.length > 0 && props.wallets.length > 0 && !selectedWalletFrom) {
            this.getWalletsFromList(props);
        }

        if (props.marketTickers && Object.keys(props.marketTickers).length && selectedWalletFrom && !selectedWalletTo) {
            this.getWalletsToList(props, selectedWalletFrom);
        }
    }

    public render() {
        const {loading} = this.state;
        return (
            <div className="cr-wallet-trades">
                {loading ? (<div className="cr-wallet-trades__loading">Loading</div>) : this.renderMainContent()}
            </div>
        );
    }

    private renderMainContent() {
        const {
            amountFrom,
            amountTo,
            currentTickerValue,
            showFrom,
            showSubmit,
            showTo,
            selectedWalletFrom,
            selectedWalletTo,
        } = this.state;

        const {type} = this.props;
        const fromCurrency = this.formatCurrency(selectedWalletFrom);
        const toCurrency = this.formatCurrency(selectedWalletTo);
        const toBalance = this.formatBalance(selectedWalletTo);
        const fromBalance = this.formatBalance(selectedWalletFrom);

        const rateMessage = (selectedWalletFrom && selectedWalletTo) ?
            `1 ${fromCurrency} = ${currentTickerValue} ${toCurrency}` :
            'Loading...';
        const feeMessage = (selectedWalletFrom && selectedWalletTo) ? this.getFeeMessage() : 'Loading...';
        const remainingMessage = (selectedWalletFrom && selectedWalletTo) ?
            `
                ${toBalance} ${toCurrency}
                 and ${fromBalance} ${fromCurrency}
            ` :
            'Loading...';
        const showModalSelectFrom = e => this.showModal(e, 'showFrom');
        const showModalSelectTo = e => this.showModal(e, 'showTo');
        const submitRequestFunc = e => this.showModal(e, 'showSubmit');
        const emptyFunc = () => {
            return;
        };

        return (
            <div className="cr-wallet-trades__container">
                <div className="cr-wallet-trades__item">
                    <div className="cr-wallet-trades__item-exchange">
                        <div className="cr-wallet-trades__item-input">
                            <InputBlock
                                handleChangeValue={this.handleChangeAmount}
                                value={amountFrom}
                                type="number"
                                message={type === 'buy' ? 'Buy' : 'Sell'}
                                placeholder="0"
                            />
                        </div>
                        <div className="cr-wallet-trades__item-trade" onClick={showModalSelectFrom}>
                            <WalletTradeItem
                                currency={selectedWalletFrom ? selectedWalletFrom.currency : 'Loading'}
                                balance={selectedWalletFrom ? selectedWalletFrom.balance : 0}
                            />
                        </div>
                        <Modal
                            show={showFrom}
                            header={this.renderHeaderModal('from')}
                            content={this.renderBodyModal('from')}
                            footer={this.renderFooterModal('from')}
                        />
                    </div>
                    <div className="cr-wallet-trades__item-exchange">
                        <div className="cr-wallet-trades__item-input">
                            <InputBlock
                                handleChangeValue={emptyFunc}
                                value={amountTo}
                                type="number"
                                message={type === 'buy' ? 'Spend' : 'Get'}
                                placeholder=""
                            />
                        </div>
                        <div className="cr-wallet-trades__item-trade" onClick={showModalSelectTo}>
                            <WalletTradeItem
                                currency={selectedWalletTo ? selectedWalletTo.currency : 'Loading'}
                                balance={selectedWalletTo ? selectedWalletTo.balance : 0}
                            />
                        </div>
                        <Modal
                            show={showTo}
                            header={this.renderHeaderModal('to')}
                            content={this.renderBodyModal('to')}
                            footer={this.renderFooterModal('to')}
                        />
                    </div>
                </div>
                <div className="cr-wallet-trades__summary">
                    <div className="cr-wallet-trades__summary-block">
                        <SummaryField
                            className="cr-wallet-trades__summary-block-field"
                            message="Rate"
                            content={rateMessage}
                            borderItem="empty-circle"
                        />
                        <SummaryField
                            className="cr-wallet-trades__summary-block-field"
                            message="Fee"
                            content={feeMessage}
                            borderItem="empty-circle"
                        />
                    </div>
                    <div className="cr-wallet-trades__divider-2"/>
                    <div className="cr-wallet-trades__summary-block">
                        <SummaryField
                            className="cr-wallet-trades__summary-block-field"
                            message="Remaining Balance"
                            content={remainingMessage}
                            borderItem="empty-circle"
                        />
                    </div>
                    <div className="cr-wallet-trades__button">
                        <Button
                            className="pg-wallet-trades-button"
                            label="CONFIRM"
                            onClick={submitRequestFunc}
                        />
                        <Modal
                            show={showSubmit}
                            header={this.renderHeaderModalSubmit()}
                            content={this.renderBodyModalSubmit()}
                            footer={this.renderFooterModalSubmit()}
                        />
                    </div>
                </div>
            </div>
        );
    }

    // tslint:disable
    private getWalletsFromList({ wallets, marketsData, marketTickers }) {
        const walletsList = marketsData.map(elem => {
            const walletNameFrom = elem.name.split('/')[0].toLowerCase();
            const wallet = wallets.find(walletItem => walletItem.currency === walletNameFrom);
            return wallet ? wallet : null;
        });

        const walletsItems: WalletItemProps[] = [];
        for (const wallet of walletsList) {
            const item = walletsItems.length && walletsItems.find(w => w.currency === wallet.currency);
            if (!item) {
                walletsItems.push(wallet);
            }
        }

        this.setState({
            selectedWalletFrom: walletsItems[0] as WalletItemProps,
            walletsFrom: walletsItems as WalletItemProps[],
        }, () => {
            if (!marketTickers || Object.keys(marketTickers).length === 0) {
                this.props.tickers();
            }
        });
    }

    private getWalletsToList({ wallets, marketsData, marketTickers }, selectedWalletFrom: WalletItemProps | null) {
        if (selectedWalletFrom) {
            const filteredMarkets = marketsData.filter(market => {
                const [walletNameFrom = ''] = market.name.split('/');
                return walletNameFrom.toLowerCase() === selectedWalletFrom!.currency;
            });
            const walletsItems = wallets.filter(wallet => {
                // tslint:disable-next-line
                return !!(filteredMarkets.findIndex(k => k.name.split('/')[1].toLowerCase() === wallet.currency) + 1);
            });

            this.setState({
                selectedWalletTo: walletsItems[0] as WalletItemProps,
                walletsTo: walletsItems as WalletItemProps[],
            });

            if (walletsItems.length) {
                const currentMarket = `${selectedWalletFrom!.currency}${walletsItems[0].currency}`.toLowerCase();
                this.setState({
                    currentTickerValue: marketTickers[currentMarket].last,
                    amountTo: 0,
                });
            }
        }
    }

    private renderWalletsModalFrom = (props: WalletItemProps, i: number) => (
        <div
            key={i}
            className="cr-wallet-modal-item"
            onClick={this.selectWalletFrom.bind(this, i)}
        >
            <WalletTradeItem currency={props.currency} balance={props.balance}/>
        </div>
    );

    private renderWalletsModalTo = (props: WalletItemProps, i: number) => (
        <div
            key={i}
            className="cr-wallet-modal-item"
            onClick={this.selectWalletTo.bind(this, i)}
        >
            <WalletTradeItem currency={props.currency} balance={props.balance}/>
        </div>
    );

    private renderHeaderModal = (value: string) => {
        const message = value === 'from' ? 'Choose currency to buy' : 'Choose currency to spend';
        return (
            <div className="pg-header-modal">
                <div className="pg-header-modal__title">{message}</div>
                <div className="pg-header-modal__close"><img onClick={this.hideModal} src={close}/></div>
            </div>
        );
    };

    private renderBodyModal = (value: string) => {
        const {
            filteredWallets,
            walletsFrom,
            walletsTo,
        } = this.state;

        const wallets = value === 'from' ? walletsFrom : walletsTo;

        if (filteredWallets && filteredWallets.length === 0) {
            return (
                <div className="pg-exchange-modal">
                    <span className="alert">No wallets were found</span>
                </div>
            );
        }

        if (value === 'from') {
            return (
                <div className="pg-exchange-modal">
                    {filteredWallets ? filteredWallets.map(this.renderWalletsModalFrom) : wallets.map(this.renderWalletsModalFrom)}
                </div>
            );
        }

        return (
            <div className="pg-exchange-modal">
                {filteredWallets ? filteredWallets.map(this.renderWalletsModalTo) : wallets.map(this.renderWalletsModalTo)}
            </div>
        );
    };

    private renderFooterModal = (value: string) => {
        const {walletsFrom, walletsTo} = this.state;
        const data = value === 'from' ? walletsFrom : walletsTo;
        return (
            <div className="pg-footer-modal">
                <FilterInput
                    filter={handleFilter}
                    onFilter={this.searchCallback}
                    data={data}
                />
            </div>
        );
    };

    private renderHeaderModalSubmit = () => {
        return (
            <div className="pg-exchange-modal-submit-header">
                Confirm?
            </div>
        );
    };

    private renderBodyModalSubmit = () => {
        return (
            <div className="pg-exchange-modal-submit-body">
                Do you confirm this transaction?
            </div>
        );
    };

    private renderFooterModalSubmit = () => {
        return (
            <div className="pg-exchange-modal-submit-footer">
                <Button
                    className="pg-exchange-modal-submit-footer__button-inverse"
                    label="CANCEL"
                    onClick={this.hideModal}
                />
                <Button
                    className="pg-exchange-modal-submit-footer__button"
                    label="CONFIRM"
                    onClick={this.confirmRequest}
                />
            </div>
        );
    };

    private confirmRequest = () => {
        const {
            amountFrom,
            selectedWalletFrom,
            selectedWalletTo,
        } = this.state;
        const {type} = this.props;
        const currentMarket = (selectedWalletTo && selectedWalletFrom) ?
            `${selectedWalletFrom.currency}${selectedWalletTo.currency}`.toLowerCase() :
            null;
        const orderType = 'Market';
        if (currentMarket) {
            const resultData = {
                market: currentMarket,
                side: type,
                volume: amountFrom.toString(),
                ord_type: (orderType as string).toLowerCase(),
            };
            const order = resultData;
            this.props.orderExecute(order);
        }
        this.hideModal();
    };

    private getFeeMessage = () => {
        const {selectedWalletTo} = this.state;
        const { fees, type } = this.props;
        const orderFees = this.getTradingFees(fees);
        const toCurrency = this.formatCurrency(selectedWalletTo);
        if (fees && selectedWalletTo) {
            return type === 'buy'
                ? `${orderFees.ask.value} ${toCurrency}`
                : `${orderFees.bid.value} ${toCurrency}`;
        }
        return 'Loading';
    };

    private getTradingFees = (fees: MarketFees[]) => {
        const {selectedWalletTo, selectedWalletFrom} = this.state;
        const emptyFees = {
            ask: {
                value: 0,
            },
            bid: {
                value: 0,
            },
        };
        const currentMarket = (selectedWalletTo && selectedWalletFrom) ?
            `${selectedWalletFrom.currency}${selectedWalletTo.currency}`.toLowerCase()
            : null;
        if (currentMarket) {
            const foundFee = fees.find((fee: MarketFees) => !!fee[currentMarket]) || {};
            return foundFee && fees.length > 0 ? foundFee[currentMarket] : emptyFees;
        }
        return emptyFees;
    };

    private formatCurrency(wallet: WalletItemProps | null) {
        return (wallet || defaultWallet).currency.toUpperCase();
    }

    private formatBalance(wallet: WalletItemProps | null) {
        const userWallet = (wallet || defaultWallet);
        const currency = userWallet.currency;
        const balance = Number(userWallet.balance);
        return currency.toLowerCase() === 'bch'
            ? balance.toFixed(4)
            : balance.toFixed(8);
    }

    private selectWalletFrom = (i: number): void => {
        const {walletsFrom} = this.state;
        this.setState({
            selectedWalletFrom: walletsFrom[i],
        });
        this.getWalletsToList(this.props, walletsFrom[i]);
        this.hideModal();
    };

    private selectWalletTo = (i: number): void => {
        const {walletsTo} = this.state;
        this.setState({
            selectedWalletTo: walletsTo[i],
        });
        this.hideModal();
    };

    // tslint:disable-next-line
    private showModal = (e: any, key: string) => {
        // @ts-ignore
        this.setState({
            [key]: true,
        });
    };

    private hideModal = () => {
        this.setState({
            showFrom: false,
            showSubmit: false,
            showTo: false,
            filteredWallets: null,
        });
    };

    private handleChangeAmount = (text: string) => {
        this.setState({
            amountFrom: parseFloat(text) || 0,
            amountTo: parseFloat(text) ? parseFloat(text) * this.state.currentTickerValue : 0,
        });
    };

    // tslint:disable-next-line: no-any
    private searchCallback = (value: any) => {
        this.setState({
            filteredWallets: value,
        });
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    executeError: selectOrderExecuteError(state),
    marketsData: selectMarkets(state),
    marketTickers: selectMarketTickers(state),
    fees: selectFees(state),
    wallets: selectWallets(state),
    walletsError: selectWalletsError(state),
    walletsLoading: selectWalletsLoading(state),
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = dispatch => ({
    fetchWallets: () => dispatch(walletsFetch()),
    markets: () => dispatch(marketsFetch()),
    orderExecute: payload => dispatch(orderExecuteFetch(payload)),
    tickers: () => dispatch(marketsTickersFetch()),
});

export const ExchangeElement = connect(mapStateToProps, mapDispatchToProps)(ExchangeComponent);
