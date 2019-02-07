import { Decimal, Table } from '@openware/components';
import * as React from 'react';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { localeDateSec, setTradeColor } from '../../helpers';
import {
    Market,
    PublicTrade,
    RootState,
    selectCurrentMarket,
    selectCurrentPrice,
    setCurrentPrice,
} from '../../modules';
import { recentTradesFetch, selectRecentTradesOfCurrentMarket } from '../../modules/recentTrades';

// tslint:disable no-any
interface ReduxProps {
    recentTrades: PublicTrade[];
    currentMarket: Market | undefined;
    currentPrice: string;
}

interface DispatchProps {
    tradesFetch: typeof recentTradesFetch;
    setCurrentPrice: typeof setCurrentPrice;
}

type Props = DispatchProps & ReduxProps;

class RecentTradesComponent extends React.Component<Props> {
    public componentWillReceiveProps(next: Props) {
        if (next.currentMarket && this.props.currentMarket !== next.currentMarket) {
          this.props.tradesFetch(next.currentMarket);
        }
    }

    public componentDidMount() {
        if (this.props.currentMarket){
          this.props.tradesFetch(this.props.currentMarket);
        }
    }

    public render() {
        return (
            <div className="pg-recent-trades">
                <Table
                    data={this.getTrades(this.props.recentTrades)}
                    header={['Price', 'Amount', 'Time']}
                    onSelect={this.handleOnSelect}
                />
            </div>
        );
    }

    private getTrades(trades: PublicTrade[]) {
        const priceFixed = this.props.currentMarket ? this.props.currentMarket.bid_precision : 0;
        const amountFixed = this.props.currentMarket ? this.props.currentMarket.ask_precision : 0;

        const renderRow = item => {
            const { id, created_at, maker_type, price, volume } = item;
            return [
                <span style={{ color: setTradeColor(maker_type).color }} key={id}><Decimal fixed={priceFixed}>{price}</Decimal></span>,
                <span style={{ color: setTradeColor(maker_type).color }} key={id}><Decimal fixed={amountFixed}>{volume}</Decimal></span>,
                <span style={{ color: setTradeColor(maker_type).color }} key={id}>{localeDateSec(created_at).slice(5)}</span>,
            ];
        };
        return (trades.length > 0)
            ? trades.map(renderRow)
            : [['There is no data to show...', '', '']];
    }

    private handleOnSelect = (index: number) => {
        const { recentTrades, currentPrice } = this.props;
        const priceToSet = recentTrades[index] ? recentTrades[index].price : '';

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


export const RecentTrades = connect(mapStateToProps, mapDispatchToProps)(RecentTradesComponent);
