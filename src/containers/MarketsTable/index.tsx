import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { connect, MapDispatchToProps } from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { Decimal, TickerTable } from '../../components';
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

interface State {
    currentBidUnit: string;
}

export type Props = ReduxProps & DispatchProps & RouterProps & InjectedIntlProps;

class MarketsTableContainer extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            currentBidUnit: '',
        };
    }

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

    public UNSAFE_componentWillReceiveProps(next: Props) {
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
        const { currentBidUnit } = this.state;
        const defaultTicker = {
            last: '0.0',
            high: '0.0',
            open: '0.0',
            low: '0.0',
            price_change_percent: '+0.00%',
            vol: '0.0',
        };

        let currentBidUnitsList: string[] = [''];

        if (markets.length > 0) {
            currentBidUnitsList = markets.reduce(this.formatFilteredMarkets, currentBidUnitsList);
        }

        let currentBidUnitMarkets = markets;

        if (currentBidUnit) {
            currentBidUnitMarkets = markets.length ? markets.filter(market => market.quote_unit === currentBidUnit) : [];
        }

        const formattedMarkets = currentBidUnitMarkets.length && currentBidUnitMarkets.map(market =>
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
            <TickerTable
                currentBidUnit={currentBidUnit}
                currentBidUnitsList={currentBidUnitsList}
                markets={formattedMarkets}
                redirectToTrading={this.handleRedirectToTrading}
                setCurrentBidUnit={this.handleSetCurrentBidUnit}
                translate={this.translate}
            />
        );
    }

    private handleRedirectToTrading = (id: string) => {
        const { markets } = this.props;
        const currentMarket: Market | undefined = markets.find(item => item.id === id);

        if (currentMarket) {
            this.props.setCurrentMarket(currentMarket);
            this.props.history.push(`/trading/${currentMarket.id}`);
        }
    }

    private handleSetCurrentBidUnit = (currentBidUnit?: string) => {
        this.setState({
            currentBidUnit: currentBidUnit || '',
        });
    };

    private formatFilteredMarkets = (list: string[], market: Market) => {
        if (list.indexOf(market.quote_unit) === -1) {
            list.push(market.quote_unit);
        }
        return list;
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
