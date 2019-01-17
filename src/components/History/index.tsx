import { History, Loader } from '@openware/components';
import classnames from 'classnames';
import * as moment from 'moment';
import * as React from 'react';
import { connect } from 'react-redux';
import { localeDate } from '../../helpers';
import { RootState } from '../../modules';
import {
    Market,
    selectCurrentMarket,
} from '../../modules/markets';
import {
    Order,
    selectOrderHistory,
    selectOrdersLoading,
} from '../../modules/orders';

interface ReduxProps {
    orders: Order[];
    currentMarket: Market;
    ordersLoading?: boolean;
}

interface HistoryState {
    historyData: Order[];
}

type Props = ReduxProps;
const sides = ['buy', 'sell'];

class HistoryContainer extends React.Component<Props, HistoryState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            historyData: [],
        };
    }

    public componentDidMount() {
        this.setState({
            historyData: this.getHistoryData(),
        });
    }

    public componentWillReceiveProps(next: Props) {
        if (this.state.historyData.length === 0 && next.orders.length > 0) {
            this.setState({
                historyData: this.getHistoryData(),
            });
        }
        if (this.props.currentMarket !== next.currentMarket) {
            this.setState({
                historyData: this.getHistoryData(),
            });
        }
    }

    public render() {
        const { ordersLoading } = this.props;
        const { historyData } = this.state;
        const classNames = classnames('pg-history', {
            'pg-history--empty': !historyData.length,
            'pg-history--loading': ordersLoading,
        });
        return (
            <div className={classNames}>
                {ordersLoading ? <Loader /> : this.history()}
            </div>
        );
    }

    private history = () => <History headers={this.renderHeaders()} data={this.renderData()} />;

    private getHistoryData() {
        const { orders } = this.props;
        return this.sortDataByDateTime(orders);
    }

    private sortDataByDateTime(data: Order[]) {
        const sortByDateTime = (a: Order, b: Order) => {
            return moment(localeDate(a.created_at), 'DD/MM HH:mm') > moment(localeDate(b.created_at), 'DD/MM HH:mm') ? -1 : 1;
        };
        const dataToSort = [...data];

        return dataToSort.sort(sortByDateTime);
    }

    private static getDate(time) {
        return localeDate(time);
    }

    private convertTotal(total: number, fractionDigit = 6) {
        return +Number(total).toFixed(fractionDigit);
    }

    private renderHeaders() {
      return ['Date', 'Action', 'State', 'Price', 'Amount', 'Total'];
    }

    private renderState({ remaining_volume, volume, state }) {
        const isVolumeEqual = Number(remaining_volume) === Number(volume);
        if (state === 'cancel' && isVolumeEqual) {
            return 'cancelled';
        }
        if (state === 'cancel' && !isVolumeEqual) {
            return 'stopped';
        }
        if (state === 'done') {
            return 'executed';
        }
        return '';
    }

    private renderSide(side) {
        if (!!(sides.indexOf(side) + 1)) {
            return side === 'sell' ? 'ask' : 'bid';
        }

        return side;
    }

    private renderData() {
        const { historyData } = this.state;
        return (historyData.length > 0) ? historyData.map(item => {
            const {
                price,
                created_at,
                volume,
                side,
                executed_volume,
                remaining_volume,
            } = item;

            const resultState = this.renderState(item);
            const resultSide = this.renderSide(side);
            const resultVolume = resultState === 'executed' ? executed_volume : (remaining_volume || volume);
            return [
                HistoryContainer.getDate(created_at),
                resultSide,
                resultState,
                price,
                resultVolume,
                this.convertTotal(Number(volume) * price),
            ];
        }) : [['There is no data to show...']];
    }
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    orders: selectOrderHistory(state),
    ordersLoading: selectOrdersLoading(state),
    currentMarket: selectCurrentMarket(state),
});

export const HistoryComponent = connect(mapStateToProps)(HistoryContainer);
