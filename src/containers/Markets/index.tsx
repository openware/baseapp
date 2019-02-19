import { Decimal, Loader, Markets } from '@openware/components';
import classnames from 'classnames';
import * as React from 'react';
import {
    InjectedIntlProps,
    injectIntl,
} from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { RootState, selectUserInfo, setCurrentPrice, User } from '../../modules';
import {
    Market,
    marketsTickersFetch,
    selectCurrentMarket,
    selectMarkets,
    selectMarketsLoading,
    selectMarketTickers,
    setCurrentMarket,
    Ticker,
} from '../../modules/public/markets';
import { depthFetch, orderBookFetch } from '../../modules/public/orderBook';
import { walletsFetch } from '../../modules/user/wallets';

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
    walletsFetch: typeof walletsFetch;
    orderBookFetch: typeof orderBookFetch;
    tickers: typeof marketsTickersFetch;
    setCurrentPrice: typeof setCurrentPrice;
}

type Props = ReduxProps & DispatchProps & InjectedIntlProps;

class MarketsContainer extends React.Component<Props> {
    private headers = [
        this.props.intl.formatMessage({id: 'page.body.trade.header.markets.content.pair'}),
        this.props.intl.formatMessage({id: 'page.body.trade.header.markets.content.price'}),
        this.props.intl.formatMessage({id: 'page.body.trade.header.markets.content.change'}),
    ];

    public componentDidMount() {
        if (this.props.markets.length === 0) {
            this.props.tickers();
        } else {
            this.props.setCurrentMarket(this.props.markets[0]);
        }
        this.props.walletsFetch();
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
            rowKeyIndex={0}
            onSelect={this.handleOnSelect}
            headers={this.headers}
            title={this.props.intl.formatMessage({id: 'page.body.trade.header.markets'})}
            filterPlaceholder={this.props.intl.formatMessage({ id: 'page.body.trade.header.markets.content.search'})}
        />
    );

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

    private handleOnSelect = (index: string) => {
        const { markets, currentMarket } = this.props;
        const marketToSet = markets.find(el => el.name === index);
        this.props.setCurrentPrice('');

        if (!currentMarket || currentMarket.id !== marketToSet.id) {
            this.props.setCurrentMarket(marketToSet);
            this.props.depthFetch(marketToSet);
            this.props.orderBookFetch(marketToSet);
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
        walletsFetch: () => dispatch(walletsFetch()),
        depthFetch: (market: Market) => dispatch(depthFetch(market)),
        orderBookFetch: (market: Market) => dispatch(orderBookFetch(market)),
        tickers: () => dispatch(marketsTickersFetch()),
        setCurrentPrice: payload => dispatch(setCurrentPrice(payload)),
    });

export const MarketsComponent = injectIntl(connect(mapStateToProps, mapDispatchToProps)(MarketsContainer));
