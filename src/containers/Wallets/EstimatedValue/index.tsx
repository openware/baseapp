import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { Decimal } from '../../../components';
import { WalletItemProps } from '../../../components/WalletItem';
import { VALUATION_PRIMARY_CURRENCY, VALUATION_SECONDARY_CURRENCY } from '../../../constants';
import { estimateUnitValue, estimateValue } from '../../../helpers/estimateValue';
import {
    currenciesFetch,
    Currency,
    marketsFetch,
    marketsTickersFetch,
    RootState,
    selectCurrencies,
    selectMarkets,
    selectMarketTickers,
    selectUserLoggedIn,
} from '../../../modules';
import { Market, Ticker } from '../../../modules/public/markets';
import { rangerConnectFetch, RangerConnectFetch } from '../../../modules/public/ranger';
import { RangerState } from '../../../modules/public/ranger/reducer';
import { selectRanger } from '../../../modules/public/ranger/selectors';

interface EstimatedValueProps {
    wallets: WalletItemProps[];
    hello: string;
}

interface ReduxProps {
    currencies: Currency[];
    markets: Market[];
    tickers: {
        [key: string]: Ticker,
    };
    rangerState: RangerState;
    userLoggedIn: boolean;
}

interface DispatchProps {
    fetchCurrencies: typeof currenciesFetch;
    fetchMarkets: typeof marketsFetch;
    fetchTickers: typeof marketsTickersFetch;
    rangerConnect: typeof rangerConnectFetch;
}

type Props = DispatchProps & ReduxProps & EstimatedValueProps & InjectedIntlProps;

class EstimatedValueContainer extends React.Component<Props> {
    public componentDidMount(): void {
        const {
            currencies,
            fetchCurrencies,
            fetchMarkets,
            fetchTickers,
            markets,
            rangerState: {connected},
            userLoggedIn,
        } = this.props;

        if (markets.length === 0) {
            fetchMarkets();
            fetchTickers();
        }

        if (currencies.length === 0) {
            fetchCurrencies();
        }

        if (!connected) {
            this.props.rangerConnect({withAuth: userLoggedIn});
        }
    }

    public componentWillReceiveProps(next: Props) {
        const {
            currencies,
            fetchCurrencies,
            fetchMarkets,
            fetchTickers,
            markets,
        } = this.props;

        if (next.markets.length === 0 && next.markets !== markets) {
            fetchMarkets();
            fetchTickers();
        }

        if (next.currencies.length === 0 && next.currencies !== currencies) {
            fetchCurrencies();
        }
    }

    public render(): React.ReactNode {
        const {
            currencies,
            markets,
            tickers,
            wallets,
        } = this.props;
        const estimatedValue = estimateValue(VALUATION_PRIMARY_CURRENCY, currencies, wallets, markets, tickers);
        const estimatedCurrencyPrecision = (currencies.filter(currency => currency.id.toLowerCase() === VALUATION_PRIMARY_CURRENCY.toLowerCase())[0] || { precision: 2}).precision;

        return (
            <div className="pg-estimated-value">
                <div className="pg-estimated-value__container">
                    {this.translate('page.body.wallets.estimated_value')}
                    <span className="value-container">
                        <span className="value">
                            {Decimal.format(estimatedValue.toString(), estimatedCurrencyPrecision, ',')}
                        </span>
                        <span className="value-sign">{VALUATION_PRIMARY_CURRENCY.toUpperCase()}</span>
                    </span>
                    {VALUATION_SECONDARY_CURRENCY && this.renderSecondaryCurrencyValuation(estimatedValue)}
                </div>
            </div>
        );
    }

    public translate = (key: string) => this.props.intl.formatMessage({id: key});

    private renderSecondaryCurrencyValuation = (estimatedValue: string) => {
        const {
            currencies,
            markets,
            tickers,
        } = this.props;
        const estimatedValueSecondary = estimateUnitValue(VALUATION_SECONDARY_CURRENCY, VALUATION_PRIMARY_CURRENCY, +estimatedValue, currencies, markets, tickers);
        const estimatedCurrencyPrecision = (currencies.filter(currency => currency.id.toLowerCase() === VALUATION_SECONDARY_CURRENCY.toLowerCase())[0] || { precision: 2}).precision;


        return (
            <span className="value-container">
                <span className="value">
                    {Decimal.format(estimatedValueSecondary.toString(), estimatedCurrencyPrecision, ',')}
                </span>
                <span className="value-sign">{VALUATION_SECONDARY_CURRENCY.toUpperCase()}</span>
            </span>
        );
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    currencies: selectCurrencies(state),
    markets: selectMarkets(state),
    tickers: selectMarketTickers(state),
    rangerState: selectRanger(state),
    userLoggedIn: selectUserLoggedIn(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    fetchCurrencies: () => dispatch(currenciesFetch()),
    fetchMarkets: () => dispatch(marketsFetch()),
    fetchTickers: () => dispatch(marketsTickersFetch()),
    rangerConnect: (payload: RangerConnectFetch['payload']) => dispatch(rangerConnectFetch(payload)),
});

// tslint:disable-next-line:no-any
export const EstimatedValue = injectIntl(connect(mapStateToProps, mapDispatchToProps)(EstimatedValueContainer)) as any;
