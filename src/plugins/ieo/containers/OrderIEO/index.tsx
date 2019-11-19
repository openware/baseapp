import * as React from 'react';
import {
    InjectedIntlProps,
    injectIntl,
} from 'react-intl';
import { connect } from 'react-redux';
import { Decimal, WalletItemProps } from '../../../../components';
import { DEFAULT_CCY_PRECISION } from '../../../../constants';
import { handleCCYPrecision, localeDate } from '../../../../helpers';
import {
    currenciesFetch,
    Currency,
    RootState,
    selectCurrencies,
    selectUserLoggedIn,
    selectWallets,
    Wallet,
    walletsFetch,
} from '../../../../modules';
import { OrderForm } from '../../components';
import {
    DataIEOInterface,
    ieoOrderExecuteFetch,
    ieoOrdersPush,
    OrderIEOData,
    selectIEOOrderExecuteData,
    selectIEOOrderExecuteSuccess,
} from '../../modules';

interface ReduxProps {
    currencies: Currency[];
    ieoOrderExecuteSuccess: boolean;
    wallets: WalletItemProps[];
    ieoOrderExecuteData?: OrderIEOData;
}

interface DispatchProps {
    accountWallets: typeof walletsFetch;
    fetchCurrencies: typeof currenciesFetch;
}

interface OwnProps {
    currentIEO: DataIEOInterface;
    toggleOrderExecuteModal: (data: OrderIEOData) => void;
}

type Props = ReduxProps & DispatchProps & OwnProps & InjectedIntlProps;

class OrderIEOContainer extends React.PureComponent<Props> {
    public componentDidMount() {
        this.props.fetchCurrencies();
    }

    public componentWillReceiveProps(next: Props) {
        const {
            accountWallets,
            ieoOrderExecuteSuccess,
            userLoggedIn,
        } = this.props;

        if (userLoggedIn && (!next.wallets || next.wallets.length === 0)) {
            accountWallets();
        }

        if (next.ieoOrderExecuteSuccess && !ieoOrderExecuteSuccess && next.ieoOrderExecuteData) {
            this.props.ieoOrdersPush(next.ieoOrderExecuteData);
            this.handleToggleOrderExecuteModal(next.ieoOrderExecuteData);
            this.props.accountWallets();
        }
    }

    public render() {
        const { currentIEO } = this.props;

        return (
            <div className="pg-order pg-order-ieo">
                <div className="cr-order">
                    <div className="cr-tab-panel cr-tab-panel__fixed">
                        <div className="cr-tab-content cr-tab-content__active">
                            <div className="pg-order-ieo__info">
                                <div className="pg-order-ieo__info-row">
                                    <span className="pg-order-ieo__info-row-text">
                                        {this.props.intl.formatMessage({ id: 'page.body.ieo.card.start.date' })}
                                    </span>
                                    <span className="pg-order-ieo__info-row-text">{currentIEO && localeDate(currentIEO.starts_at, 'fullDate')}</span>
                                </div>
                                <div className="pg-order-ieo__info-row">
                                    <span className="pg-order-ieo__info-row-text">
                                        {this.props.intl.formatMessage({ id: 'page.body.ieo.card.end.date' })}
                                    </span>
                                    <span className="pg-order-ieo__info-row-text">{currentIEO && localeDate(currentIEO.finishes_at, 'fullDate')}</span>
                                </div>
                            </div>
                            {this.getOrder()}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    private getOrder = () => {
        const { currentIEO, wallets } = this.props;
        const walletQuote = this.getWallet(currentIEO.pairs[0] && currentIEO.pairs[0].quote_currency_id, wallets);
        const to = currentIEO.currency_id;
        let from = '';
        let price = 0;

        if (currentIEO.pairs[0]) {
            from = currentIEO.pairs[0].quote_currency_id;
            price = currentIEO.pairs[0].price;
        }

        const currentProposals = price ? (
            [[String(price), String(this.getAvailableValue(walletQuote) || 0 / price)]]
        ) : [['1', '0']];

        return (
            <OrderForm
                proposals={currentProposals}
                from={from}
                to={to}
                fee={currentIEO && +currentIEO.commission}
                available={+(this.getAvailableValue(walletQuote) || 0)}
                priceMarket={price}
                onSubmit={this.handleSubmit}
                currentMarketAskPrecision={currentIEO.metadata && currentIEO.metadata.precision ? currentIEO.metadata.precision : 0}
                currentMarketBidPrecision={walletQuote ? walletQuote.fixed : 0}
                amountText={this.props.intl.formatMessage({ id: 'page.body.ieo.details.order.youWillPay' })}
                availableText={this.props.intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.available' })}
                orderTypeText={this.props.intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.orderType' })}
                priceText={this.props.intl.formatMessage({ id: 'page.body.ieo.details.order.youWillGet' })}
                totalText={this.props.intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.total' })}
                submitButtonText={this.props.intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.tabs.buy' })}
            />
        );
    };

    private handleSubmit = value => {
        const { currencies, currentIEO } = this.props;
        const quoteUnit = currentIEO.pairs[0] ? currentIEO.pairs[0].quote_currency_id : '';

        const quoteUnitPrecision = handleCCYPrecision(currencies, quoteUnit, DEFAULT_CCY_PRECISION);

        const order = {
            sale: currentIEO.id,
            quote_unit: String(quoteUnit).toLowerCase(),
            contribution: Decimal.format(+value.amount * +value.price, quoteUnitPrecision),
        };

        this.props.executeIEOOrder(order);
    };

    private getWallet(currency: string, wallets: WalletItemProps[]) {
        const currencyLower = currency.toLowerCase();

        return wallets.find(w => w.currency === currencyLower) as Wallet;
    }

    private getAvailableValue(wallet: Wallet | undefined) {
        return wallet ? wallet.balance : 0;
    }

    private handleToggleOrderExecuteModal = (data: OrderIEOData) => {
        this.props.toggleOrderExecuteModal(data);
    };
}

const mapStateToProps = (state: RootState) => ({
    currencies: selectCurrencies(state),
    ieoOrderExecuteData: selectIEOOrderExecuteData(state),
    ieoOrderExecuteSuccess: selectIEOOrderExecuteSuccess(state),
    wallets: selectWallets(state),
    userLoggedIn: selectUserLoggedIn(state),
});

const mapDispatchToProps = dispatch => ({
    fetchCurrencies: () => dispatch(currenciesFetch()),
    executeIEOOrder: payload => dispatch(ieoOrderExecuteFetch(payload)),
    accountWallets: () => dispatch(walletsFetch()),
    ieoOrdersPush: payload => dispatch(ieoOrdersPush(payload)),
});

// tslint:disable-next-line no-any
const OrderIEO = injectIntl(connect(mapStateToProps, mapDispatchToProps)(OrderIEOContainer as any)) as any;

export {
    OrderIEO,
};
