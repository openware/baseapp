import { Decimal } from '@openware/components';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { WalletItemProps } from '../../../components/WalletItem';
import { estimateValue, estimateWithMarket, findPrecision } from '../../../helpers/estimateValue';
import {
    marketsFetch,
    RootState,
    selectMarkets,
    selectMarketTickers, selectUserLoggedIn,
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
    markets: Market[];
    marketTickers: {
        [key: string]: Ticker,
    };
    rangerState: RangerState;
    userLoggedIn: boolean;
}

interface DispatchProps {
    marketsFetch: typeof marketsFetch;
    rangerConnect: typeof rangerConnectFetch;
}

type Props = DispatchProps & ReduxProps & EstimatedValueProps & InjectedIntlProps;

class EstimatedValueContainer extends React.Component<Props> {
    public componentDidMount(): void {
        const {markets, userLoggedIn, rangerState: {connected}} = this.props;

        if (markets.length < 1) {
            this.props.marketsFetch();
        }

        if (!connected) {
            this.props.rangerConnect({withAuth: userLoggedIn});
        }
    }

    public render(): React.ReactNode {
        const {wallets, markets, marketTickers} = this.props;
        const primaryCurrency = 'usd';
        const primaryCurrencyPrecision = findPrecision(primaryCurrency, markets);
        const estimatedValue = estimateValue(primaryCurrency, wallets, markets, marketTickers);
        const secondaryCurrency = 'eth';
        const secondaryCurrencyPrecision = findPrecision(secondaryCurrency, markets);
        const estimatedValueSecondary = estimateWithMarket(secondaryCurrency, primaryCurrency, estimatedValue, markets, marketTickers);

        return (
            <div className="pg-estimated-value">
                <div className="pg-estimated-value__container">
                    {this.t('page.body.wallets.estimated_value')}
                    <span className="value-container">
                        <span className="value">
                            {Decimal.format(estimatedValue, primaryCurrencyPrecision)}
                        </span>
                        <span className="value-sign">{primaryCurrency.toUpperCase()}</span>
                    </span>

                    <span className="value-container">
                        <span className="value">
                            {Decimal.format(estimatedValueSecondary, secondaryCurrencyPrecision)}
                        </span>
                        <span className="value-sign">{secondaryCurrency.toUpperCase()}</span>
                    </span>
                </div>
            </div>
        );
    }

    public t = (key: string) => {
        return this.props.intl.formatMessage({id: key});
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    markets: selectMarkets(state),
    marketTickers: selectMarketTickers(state),
    rangerState: selectRanger(state),
    userLoggedIn: selectUserLoggedIn(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    marketsFetch: () => dispatch(marketsFetch()),
    rangerConnect: (payload: RangerConnectFetch['payload']) => dispatch(rangerConnectFetch(payload)),
});

// tslint:disable-next-line:no-any
export const EstimatedValue = injectIntl(connect(mapStateToProps, mapDispatchToProps)(EstimatedValueContainer)) as any;
