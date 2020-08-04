import classnames from 'classnames';
import * as React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { incrementalOrderBook } from '../../../../api';
import { SortAsc, SortDefault, SortDesc } from '../../../../assets/images/SortIcons';
import { Decimal, Table } from '../../../../components';
import { IntlProps } from '../../../../index';
import {
    depthFetch,
    Market,
    RootState,
    selectCurrentMarket,
    selectMarkets,
    selectMarketTickers,
    setCurrentMarket,
    setCurrentPrice,
    Ticker,
} from '../../../../modules';

interface ReduxProps {
    currentMarket: Market | undefined;
    markets: Market[];
    marketTickers: {
        [key: string]: Ticker,
    };
}

interface DispatchProps {
    setCurrentMarket: typeof setCurrentMarket;
    depthFetch: typeof depthFetch;
    setCurrentPrice: typeof setCurrentPrice;
}

interface OwnProps {
    search: string;
    currencyQuote: string;
}

interface State {
    sortBy: string;
    reverseOrder: boolean;
}

const handleChangeSortIcon = (sortBy: string, id: string, reverseOrder: boolean) => {
    if (sortBy !== 'none' && id === sortBy && !reverseOrder) {
        return <SortDesc/>;
    }

    if (sortBy !== 'none' && id === sortBy && reverseOrder) {
        return <SortAsc/>;
    }

    return <SortDefault/>;
};

type Props = ReduxProps & OwnProps & DispatchProps & IntlProps;

class MarketsListComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            sortBy: 'none',
            reverseOrder: false,
        };
    }

    public render() {
        const data = this.mapMarkets();

        return (
            <div className="pg-dropdown-markets-list-container">
                <Table
                    data={data.length > 0 ? data : [[]]}
                    header={this.getHeaders()}
                    onSelect={this.currencyPairSelectHandler}
                    selectedKey={this.props.currentMarket && this.props.currentMarket.name}
                    rowKeyIndex={0}
                />
            </div>
        );
    }

    private currencyPairSelectHandler = (key: string) => {
        const { markets } = this.props;
        const marketToSet = markets.find(el => el.name === key);

        this.props.setCurrentPrice(0);
        if (marketToSet) {
            this.props.setCurrentMarket(marketToSet);
            if (!incrementalOrderBook()) {
              this.props.depthFetch(marketToSet);
            }
        }
    };

    private getHeaders = () => [
        {id: 'id', translationKey: 'market'},
        {id: 'last', translationKey: 'last_price'},
        {id: 'volume', translationKey: 'volume'},
        {id: 'price_change_percent_num', translationKey: 'change'},
    ].map(obj => {
        const {sortBy, reverseOrder} = this.state;

        return (
            {
                ...obj,
                selected: sortBy === obj.id,
                reversed: sortBy === obj.id && reverseOrder,
            }
        );
    }).map(obj => {
        const {sortBy, reverseOrder} = this.state;
        const classname = classnames({
            'pg-dropdown-markets-list-container__header-selected': obj.selected,
        });

        return (
            <span className={classname} key={obj.id} onClick={() => this.handleHeaderClick(obj.id)}>
            {this.props.intl.formatMessage({id: `page.body.trade.header.markets.content.${obj.translationKey}`})}
                <span className="sort-icon">
                    {handleChangeSortIcon(sortBy, obj.id, reverseOrder)}
                </span>
            </span>
        );
    });

    private mapMarkets() {
        const { markets, marketTickers, search, currencyQuote } = this.props;
        const defaultTicker = {
            last: 0,
            volume: 0,
            price_change_percent: '+0.00%',
        };
        const arr: Market[] = [];

        const marketsMapped = markets.map((market: Market) => {
            return {
                ...market,
                last: (marketTickers[market.id] || defaultTicker).last,
                volume: (marketTickers[market.id] || defaultTicker).volume,
                price_change_percent: (marketTickers[market.id] || defaultTicker).price_change_percent,
                price_change_percent_num: Number.parseFloat((marketTickers[market.id] || defaultTicker).price_change_percent),
            };
        });

        const {sortBy, reverseOrder} = this.state;

        if (sortBy !== 'none') {
            marketsMapped.sort((a, b) => a[sortBy] > b[sortBy] ? 1 : b[sortBy] > a[sortBy] ? -1 : 0);
        }

        reverseOrder && marketsMapped.reverse();

        return marketsMapped.reduce((pV, cV) => {
            const [,quote] = cV.name.toLowerCase().split('/');
            if (
                cV.id.toLowerCase().includes(search.toLowerCase()) &&
                (
                    currencyQuote === '' ||
                    currencyQuote.toLowerCase() === quote ||
                    currencyQuote.toLowerCase() === 'all'
                )
            ) {
                pV.push(cV);
            }

            return pV;
        }, arr).map((market: any) => {
            const isPositive = /\+/.test((marketTickers[market.id] || defaultTicker).price_change_percent);
            const classname = classnames({
                'pg-dropdown-markets-list-container__positive': isPositive,
                'pg-dropdown-markets-list-container__negative': !isPositive,
            });

            return [
                market.name,
                (<span className={classname}>{Decimal.format(Number(market.last), market.price_precision)}</span>),
                (<span className={classname}>{Decimal.format(Number(market.volume), market.price_precision)}</span>),
                (<span className={classname}>{market.price_change_percent}</span>),
            ];
        });
    }

    private handleHeaderClick = (key: string) => {
        const {sortBy, reverseOrder} = this.state;
        if (key !== sortBy) {
            this.setState({sortBy: key, reverseOrder: false});
        } else if (key === sortBy && !reverseOrder) {
            this.setState({reverseOrder: true});
        } else {
            this.setState({sortBy: 'none', reverseOrder: false});
        }
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    currentMarket: selectCurrentMarket(state),
    markets: selectMarkets(state),
    marketTickers: selectMarketTickers(state),
});

const mapDispatchToProps = {
    setCurrentMarket,
    depthFetch,
    setCurrentPrice,
};

export const MarketsList = compose(
    injectIntl,
    connect(mapStateToProps, mapDispatchToProps),
)(MarketsListComponent) as any; // tslint:disable-line
