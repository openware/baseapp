
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { connect, MapDispatchToProps } from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { Decimal } from '../../components';
import {
    Market,
    marketsFetch,
    marketsTickersFetch,
    RootState,
    selectMarkets,
    selectMarketTickers,
    selectUserLoggedIn,
    setCurrentMarket,
    Ticker,
} from '../../modules';
import { rangerConnectFetch, RangerConnectFetch } from '../../modules/public/ranger';
import { RangerState } from '../../modules/public/ranger/reducer';
import { selectRanger } from '../../modules/public/ranger/selectors';

interface ReduxProps {
    markets: Market[];
    marketTickers: {
        [key: string]: Ticker,
    };
    rangerState: RangerState;
    loggedIn?: boolean;
}

interface DispatchProps {
    fetchMarkets: typeof marketsFetch;
    rangerConnect: typeof rangerConnectFetch;
    setCurrentMarket: typeof setCurrentMarket;
    tickers: typeof marketsTickersFetch;
}

export type MarketsTableContainerProps = ReduxProps & DispatchProps & RouterProps & InjectedIntlProps;

class MarketsTableContainer extends React.Component<MarketsTableContainerProps> {
    public componentDidMount(): void {
        const {rangerState: { connected }} = this.props;

        if (!connected) {
            this.props.rangerConnect({withAuth: false});
        }
    }

    public UNSAFE_componentWillMount() {
        const { markets } = this.props;

        if (markets.length === 0) {
            this.props.fetchMarkets();
            this.props.tickers();
        }
    }

    public UNSAFE_componentWillReceiveProps(next: MarketsTableContainerProps) {
        const {
            markets,
            tickers,
        } = this.props;

        if (next.markets.length === 0 && next.markets !== markets) {
            tickers();
        }
    }

    public render() {
        const {
            markets,
            marketTickers,
        } = this.props;
        const defaultTicker = {
            last: '0.0',
            high: '0.0',
            open: '0.0',
            low: '0.0',
            price_change_percent: '+0.00%',
            vol: '0.0',
        };

        const formattedMarkets = markets.map(market =>
            ({
                ...market,
                last: Decimal.format(Number((marketTickers[market.id] || defaultTicker).last), market.amount_precision),
                open: Decimal.format(Number((marketTickers[market.id] || defaultTicker).open), market.price_precision),
                price_change_percent: String((marketTickers[market.id] || defaultTicker).price_change_percent),
                high: Decimal.format(Number((marketTickers[market.id] || defaultTicker).high), market.amount_precision),
                low: Decimal.format(Number((marketTickers[market.id] || defaultTicker).low), market.amount_precision),
                vol: Decimal.format(Number((marketTickers[market.id] || defaultTicker).vol), market.amount_precision),
            }),
        ).map(market =>
            ({
                ...market,
                change: Decimal.format((+market.last - +market.open)
                    .toFixed(market.price_precision), market.price_precision),
            }),
        );

        return (
            <div className="pg-markets-table">
                <table className="pg-markets-table__table">
                    <thead>
                        <tr>
                            <th scope="col">{this.translate('page.body.marketsTable.header.pair')}</th>
                            <th scope="col">{this.translate('page.body.marketsTable.header.lastPrice')}</th>
                            <th scope="col">{this.translate('page.body.marketsTable.header.change')}</th>
                            <th scope="col">{this.translate('page.body.marketsTable.header.high')}</th>
                            <th scope="col">{this.translate('page.body.marketsTable.header.low')}</th>
                            <th scope="col">{this.translate('page.body.marketsTable.header.volume')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {formattedMarkets[0] && formattedMarkets.map(this.renderItem)}
                    </tbody>
                </table>
            </div>
        );
    }

    private renderItem = (market, index: number) => {
        const marketChangeColor = +(market.change || 0) < 0 ? 'negative' : 'positive';

        return (
            <tr key={index} onClick={() => this.handleRedirectToTrading(market.id)}>
                <td>
                    <div>
                        {market && market.name}
                    </div>
                </td>
                <td>
                    <span>
                        <Decimal fixed={market.amount_precision} thousSep=",">
                            {market.last}
                        </Decimal>
                    </span>
                </td>
                <td>
                    <span className={marketChangeColor}>{market.price_change_percent}</span>
                </td>
                <td>
                    <span>
                        <Decimal fixed={market.amount_precision} thousSep=",">
                            {market.high}
                        </Decimal>
                    </span>
                </td>
                <td>
                    <span>
                        <Decimal fixed={market.amount_precision} thousSep=",">
                            {market.low}
                        </Decimal>
                    </span>
                </td>
                <td>
                    <span>
                        <Decimal fixed={market.amount_precision} thousSep=",">
                            {market.volume}
                        </Decimal>
                    </span>
                </td>
            </tr>
        );
    };

    private handleRedirectToTrading = (id: string) => {
        const { markets } = this.props;
        const currentMarket: Market | undefined = markets.find(item => item.id === id);

        if (currentMarket) {
            this.props.setCurrentMarket(currentMarket);
            this.props.history.push(`/trading/${currentMarket.id}`);
        }
    }

    private translate = (key: string) => this.props.intl.formatMessage({id: key});
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    loggedIn: selectUserLoggedIn(state),
    markets: selectMarkets(state),
    marketTickers: selectMarketTickers(state),
    rangerState: selectRanger(state),
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = dispatch => ({
    fetchMarkets: () => dispatch(marketsFetch()),
    rangerConnect: (payload: RangerConnectFetch['payload']) => dispatch(rangerConnectFetch(payload)),
    setCurrentMarket: (market: Market) => dispatch(setCurrentMarket(market)),
    tickers: () => dispatch(marketsTickersFetch()),
});

// tslint:disable-next-line:no-any
export const MarketsTable = injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(MarketsTableContainer) as any));
