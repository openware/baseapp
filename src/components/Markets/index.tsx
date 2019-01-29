import { Decimal, Loader, Markets } from '@openware/components';
import classnames from 'classnames';
import * as React from 'react';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
// import { preciseData } from '../../helpers';
import { RootState, selectUserInfo, User } from '../../modules';
import {
    Market,
    marketsTickersFetch,
    selectCurrentMarket,
    selectMarkets,
    selectMarketsLoading,
    selectMarketTickers,
    setCurrentMarket,
    Ticker,
} from '../../modules/markets';
import { depthFetch } from '../../modules/orderBook';

interface ReduxProps {
    userData: User;
    markets: Market[];
    marketsLoading?: boolean;
    marketTickers: {
        [key: string]: Ticker,
    };
    currentMarket: Market | undefined;
}

interface DispatchProps {
    setCurrentMarket: typeof setCurrentMarket;
    depthFetch: typeof depthFetch;
    tickers: typeof marketsTickersFetch;
}

type Props = ReduxProps & DispatchProps;

class MarketsContainer extends React.Component<Props> {

    public componentDidMount() {
        this.props.tickers();
    }

    public render() {
        const { marketsLoading } = this.props;
        const className = classnames('pg-markets', {
            'pg-markets--loading': marketsLoading,
        });
        return (
            <div className={className}>
                {marketsLoading ? <Loader /> : this.markets()}
            </div>
        );
    }

    private markets = () => (
        <Markets
            filters={false}
            data={this.mapMarkets()}
            onSelect={this.handleOnSelect}
        />
    )

    private mapMarkets() {
        const { markets, marketTickers } = this.props;
        const defaultTicker = {
            last: 0,
            price_change_percent: '+0.00%',
        };

        return markets.map((market: Market) =>
            ([
                market.name,
                Decimal.format(Number((marketTickers[market.id] || defaultTicker).last), market.ask_precision),
                (marketTickers[market.id] || defaultTicker).price_change_percent,
            ]),
        );
    }

    private handleOnSelect = (index: number) => {
        const { markets, currentMarket } = this.props;
        const marketToSet = markets[index];

        if (!currentMarket || currentMarket.id !== marketToSet.id) {
            this.props.setCurrentMarket(marketToSet);
            this.props.depthFetch(marketToSet);
        }
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    userData: selectUserInfo(state),
    markets: selectMarkets(state),
    marketsLoading: selectMarketsLoading(state),
    marketTickers: selectMarketTickers(state),
    currentMarket: selectCurrentMarket(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        setCurrentMarket: (market: Market) => dispatch(setCurrentMarket(market)),
        depthFetch: (market: Market) => dispatch(depthFetch(market)),
        tickers: () => dispatch(marketsTickersFetch()),
    });

export const MarketsComponent = connect(mapStateToProps, mapDispatchToProps)(MarketsContainer);
