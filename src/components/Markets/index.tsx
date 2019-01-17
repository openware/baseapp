import { Loader, Markets } from '@openware/components';
import classnames from 'classnames';
import * as React from 'react';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { RootState, selectUserInfo, User } from '../../modules';
import {
    Market,
    marketsFetch,
    selectCurrentMarket,
    selectMarkets,
    selectMarketsLoading,
    selectMarketTickers,
    setCurrentMarket,
} from '../../modules/markets';
import { depthFetch } from '../../modules/orderBook';
import { RangerEvent } from '../../modules/types';

interface ReduxProps {
    userData: User;
    markets: Market[];
    marketsLoading?: boolean;
    marketTickers: {
        [key: string]: RangerEvent,
    };
    currentMarket: Market;
}

interface DispatchProps {
    marketsFetch: typeof marketsFetch;
    setCurrentMarket: typeof setCurrentMarket;
    depthFetch: typeof depthFetch;
}

type Props = ReduxProps & DispatchProps;

// tslint:disable
class MarketsContainer extends React.Component<Props> {
    public componentDidMount() {
        if (this.props.markets.length < 2) {
            this.props.marketsFetch();
        }
    }

    public componentWillReceiveProps(nextProps: Props) {
        if (nextProps.userData.uid &&
            (nextProps.markets.length < 2) &&
            !nextProps.marketsLoading) {
            this.props.marketsFetch();
        }
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
        const { markets } = this.props;
        const defaultTicker = { last: 0 };

        return markets.map((market: Market) =>
            ([market.name, (defaultTicker).last]),
        );
    }

    private handleOnSelect = (index: number) => {
        const { markets, currentMarket } = this.props;
        const marketToSet = markets[index];

        if (currentMarket.id !== marketToSet.id) {
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
        marketsFetch: () => dispatch(marketsFetch()),
        setCurrentMarket: (market: Market) => dispatch(setCurrentMarket(market)),
        depthFetch: (market: Market) => dispatch(depthFetch(market)),
    });

export const MarketsComponent = connect(mapStateToProps, mapDispatchToProps)(MarketsContainer);
