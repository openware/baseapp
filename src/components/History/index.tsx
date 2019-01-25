import { History, Loader } from '@openware/components';
import classnames from 'classnames';
import * as React from 'react';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { localeDate } from '../../helpers';
import { PrivateTrade, RootState, selectTradesLoading, selectTradesOfCurrentMarket } from '../../modules';
import { tradesFetch } from '../../modules/history/trades/actions';
import {
    Market,
    selectCurrentMarket,
} from '../../modules/markets';

interface ReduxProps {
    trades: PrivateTrade[];
    currentMarket: Market;
    ordersLoading?: boolean;
}

interface DispatchProps {
    getTradesHistory: typeof tradesFetch;
}

interface HistoryState {
    historyData: PrivateTrade[];
}

type Props = ReduxProps & DispatchProps;
const sides = ['buy', 'sell'];

class HistoryContainer extends React.Component<Props, HistoryState> {
    public componentDidMount() {
        this.props.getTradesHistory([this.props.currentMarket]);
    }

    public componentWillReceiveProps(next: Props) {
        if (this.props.currentMarket !== next.currentMarket) {
            this.props.getTradesHistory([next.currentMarket]);
        }
    }

    public render() {
        const { ordersLoading, trades } = this.props;
        const classNames = classnames('pg-history', {
            'pg-history--empty': !trades.length,
            'pg-history--loading': ordersLoading,
        });
        return (
            <div className={classNames}>
                {ordersLoading ? <Loader /> : this.history()}
            </div>
        );
    }

    private history = () => <History headers={this.renderHeaders()} data={this.renderData()} />;

    private static getDate(time) {
        return localeDate(time);
    }

    private convertTotal(total: number, fractionDigit = 6) {
        return +Number(total).toFixed(fractionDigit);
    }

    private renderHeaders() {
      return ['Date', 'Action', 'Price', 'Amount', 'Total'];
    }

    private renderSide(side) {
        if (!!(sides.indexOf(side) + 1)) {
            return side === 'sell' ? 'ask' : 'bid';
        }

        return side;
    }

    private renderData() {
        const { trades } = this.props;
        return (trades.length > 0) ? trades.map(item => {
            const {
                created_at,
                side,
                price,
                volume,
            } = item;

            const resultSide = this.renderSide(side);
            return [
                HistoryContainer.getDate(created_at),
                resultSide,
                price,
                volume,
                this.convertTotal(Number(volume) * Number(price)),
            ];
        }) : [['There is no data to show...']];
    }
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    trades: selectTradesOfCurrentMarket(state),
    ordersLoading: selectTradesLoading(state),
    currentMarket: selectCurrentMarket(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        getTradesHistory: (markets: Market[]) => dispatch(tradesFetch(markets)),
    });

export const HistoryComponent = connect(mapStateToProps, mapDispatchToProps)(HistoryContainer);
