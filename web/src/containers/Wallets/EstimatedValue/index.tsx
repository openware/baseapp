import * as React from 'react';
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { IntlProps } from '../../../';
import { formatWithSeparators } from '../../../components';
import { VALUATION_PRIMARY_CURRENCY, VALUATION_SECONDARY_CURRENCY } from '../../../constants';
import { estimateUnitValue, estimateValue } from '../../../helpers/estimateValue';
import {
    Currency,
    marketsFetch,
    marketsTickersFetch,
    RootState,
    selectMarkets,
    selectMarketTickers,
    selectUserLoggedIn,
    Wallet,
} from '../../../modules';
import { Market, Ticker } from '../../../modules/public/markets';

interface EstimatedValueProps {
    wallets: Wallet[];
    currencies: Currency[];
}

interface ReduxProps {
    markets: Market[];
    tickers: {
        [key: string]: Ticker,
    };
    userLoggedIn: boolean;
}

interface DispatchProps {
    fetchMarkets: typeof marketsFetch;
    fetchTickers: typeof marketsTickersFetch;
}

type Props = DispatchProps & ReduxProps & EstimatedValueProps & IntlProps;

class EstimatedValueContainer extends React.Component<Props> {
    public componentDidMount(): void {
        const {
            fetchMarkets,
            fetchTickers,
            markets,
            tickers,
        } = this.props;

        if (!markets.length) {
            fetchMarkets();
        }

        if (!tickers.length) {
            fetchTickers();
        }
    }

    public componentWillReceiveProps(next: Props) {
        const {
            fetchMarkets,
            fetchTickers,
            markets,
            tickers,
        } = this.props;

        if (!markets.length && next.markets.length) {
            fetchMarkets();
        }

        if (!tickers.length && next.tickers.length) {
            fetchTickers();
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

        return (
            <div className="pg-estimated-value">
                <span className="pg-estimated-value__title">{this.translate('page.body.wallets.estimated_value')}</span>
                <div className="pg-estimated-value__container">
                    <span className="value-container">
                        <span className="value">
                            {formatWithSeparators(estimatedValue, ',')}
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

        return (
            <span className="value-container">
                <span className="value">
                    {formatWithSeparators(estimatedValueSecondary, ',')}
                </span>
                <span className="value-sign">{VALUATION_SECONDARY_CURRENCY.toUpperCase()}</span>
            </span>
        );
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    markets: selectMarkets(state),
    tickers: selectMarketTickers(state),
    userLoggedIn: selectUserLoggedIn(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    fetchMarkets: () => dispatch(marketsFetch()),
    fetchTickers: () => dispatch(marketsTickersFetch()),
});

// tslint:disable-next-line:no-any
export const EstimatedValue = injectIntl(connect(mapStateToProps, mapDispatchToProps)(EstimatedValueContainer)) as any;
