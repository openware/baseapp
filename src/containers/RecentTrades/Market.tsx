import * as React from 'react';
import {
    injectIntl,
} from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { compose } from 'redux';
import { Decimal, Table } from '../../components';
import { localeDate, setTradeColor } from '../../helpers';
import { IntlProps } from '../../index';
import {
    Market,
    PublicTrade,
    RootState,
    selectCurrentMarket,
    selectCurrentPrice,
    setCurrentPrice,
} from '../../modules';
import { recentTradesFetch, selectRecentTradesOfCurrentMarket } from '../../modules/public/recentTrades';

interface ReduxProps {
    recentTrades: PublicTrade[];
    currentMarket: Market | undefined;
    currentPrice: number | undefined;
}

interface DispatchProps {
    tradesFetch: typeof recentTradesFetch;
    setCurrentPrice: typeof setCurrentPrice;
}

type Props = DispatchProps & ReduxProps & IntlProps;

const handleHighlightValue = (prevValue: string, curValue: string) => {
    let highlighted = '';
    let val = curValue;
    let prev = prevValue;

    while (val !== prev && val.length > 0) {
        highlighted = val[val.length - 1] + highlighted;
        val = val.slice(0, -1);
        prev = prev.slice(0, -1);
    }

    return (
        <React.Fragment>
            <span className="cr-decimal__opacity">{val}</span>
            <span>{highlighted}</span>
        </React.Fragment>
    );
};


class RecentTradesMarketContainer extends React.Component<Props> {
    public componentDidMount() {
        if (this.props.currentMarket) {
            this.props.tradesFetch(this.props.currentMarket);
        }
    }

    public componentWillReceiveProps(next: Props) {
        if (next.currentMarket && this.props.currentMarket !== next.currentMarket) {
            this.props.tradesFetch(next.currentMarket);
        }
    }

    public shouldComponentUpdate(nextProps: Props) {
        return JSON.stringify(nextProps.recentTrades) !== JSON.stringify(this.props.recentTrades);
    }

    public render() {
        return (
            <div className="pg-recent-trades__markets">
                <Table
                    data={this.getTrades(this.props.recentTrades)}
                    header={this.getHeaders()}
                    onSelect={this.handleOnSelect}
                />
            </div>
        );
    }

    private getHeaders = () => {
        return [
            this.props.intl.formatMessage({ id: 'page.body.trade.header.recentTrades.content.time' }),
            this.props.intl.formatMessage({ id: 'page.body.trade.header.recentTrades.content.amount' }),
            this.props.intl.formatMessage({ id: 'page.body.trade.header.recentTrades.content.price' }),
        ];
    };

    private getTrades(trades: PublicTrade[]) {
        const priceFixed = this.props.currentMarket ? this.props.currentMarket.price_precision : 0;
        const amountFixed = this.props.currentMarket ? this.props.currentMarket.amount_precision : 0;

        const renderRow = (item, i) => {
            const { created_at, taker_type, price, amount } = item;
            const higlightedDate = handleHighlightValue(String(localeDate(trades[i - 1] ? trades[i - 1].created_at : '', 'time')), String(localeDate(created_at, 'time')));

            return [
                <span style={{ color: setTradeColor(taker_type).color }} key={i}>{higlightedDate}</span>,
                <span style={{ color: setTradeColor(taker_type).color }} key={i}>
                    <Decimal fixed={amountFixed} thousSep=",">{amount}</Decimal>
                </span>,
                <span style={{ color: setTradeColor(taker_type).color }} key={i}>
                    <Decimal fixed={priceFixed} thousSep="," prevValue={trades[i - 1] ? trades[i - 1].price : 0}>{price}</Decimal>
                </span>,
            ];
        };

        return (trades.length > 0)
            ? trades.map(renderRow)
            : [[[''], this.props.intl.formatMessage({ id: 'page.noDataToShow' }), ['']]];
    }

    private handleOnSelect = (index: string) => {
        const { recentTrades, currentPrice } = this.props;
        const priceToSet = recentTrades[Number(index)] ? Number(recentTrades[Number(index)].price) : 0;

        if (currentPrice !== priceToSet) {
            this.props.setCurrentPrice(priceToSet);
        }
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    recentTrades: selectRecentTradesOfCurrentMarket(state),
    currentMarket: selectCurrentMarket(state),
    currentPrice: selectCurrentPrice(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    tradesFetch: market => dispatch(recentTradesFetch(market)),
    setCurrentPrice: payload => dispatch(setCurrentPrice(payload)),
});

const RecentTradesMarket = compose(
    injectIntl,
    connect(mapStateToProps, mapDispatchToProps),
)(RecentTradesMarketContainer) as any; // tslint:disable-line

export {
    handleHighlightValue,
    RecentTradesMarket,
};
