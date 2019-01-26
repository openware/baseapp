import { Table } from '@openware/components';
import * as React from 'react';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { localeDateSec, setTradeColor } from '../../helpers';
import { Market, PublicTrade, RootState, selectCurrentMarket } from '../../modules';
import { recentTradesFetch, selectRecentTradesOfCurrentMarket } from '../../modules/recentTrades';

// tslint:disable no-any
interface ReduxProps {
    recentTrades: PublicTrade[];
    currentMarket: Market;
}

interface DispatchProps {
    tradesFetch: typeof recentTradesFetch;
}

type Props = DispatchProps & ReduxProps;

class RecentTradesComponent extends React.Component<Props> {
    public componentWillReceiveProps(next: Props) {
        if (this.props.currentMarket !== next.currentMarket) {
          this.props.tradesFetch(next.currentMarket);
        }
    }

    public componentDidMount() {
        if (this.props.currentMarket.id){
          this.props.tradesFetch(this.props.currentMarket);
        }
    }

    public render() {
        return (
            <div className="pg-recent-trades">
                <Table data={this.getTrades(this.props.recentTrades)} header={['Price', 'Amount', 'Time']}/>
            </div>
        );
    }

    private getTrades(trades: PublicTrade[]) {
        const renderRow = item => {
            const { id, created_at, maker_type, price, volume } = item;
            return [
                <span style={{ color: setTradeColor(maker_type).color }} key={id}>{price}</span>,
                <span style={{ color: setTradeColor(maker_type).color }} key={id}>{volume}</span>,
                <span style={{ color: setTradeColor(maker_type).color }} key={id}>{localeDateSec(created_at).slice(5)}</span>,
            ];
        };
        return (trades.length > 0)
            ? trades.map(renderRow)
            : [['There is no data to show...', '', '']];
    }
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    recentTrades: selectRecentTradesOfCurrentMarket(state),
    currentMarket: selectCurrentMarket(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    tradesFetch: market => dispatch(recentTradesFetch(market)),
});


export const RecentTrades = connect(mapStateToProps, mapDispatchToProps)(RecentTradesComponent);
