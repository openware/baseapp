import { Loader, OrderBook } from '@openware/components';
import classNames from 'classnames';
import * as React from 'react';
import {
    connect,
    MapDispatchToPropsFunction,
    MapStateToProps,
} from 'react-redux';
import {
    Market,
    orderBookFetch,
    RootState,
    selectCurrentMarket,
    selectDepthAsks,
    selectDepthBids,
    selectDepthError,
    selectDepthLoading,
} from '../../modules';
import { CommonError } from '../../modules/types';

interface ReduxProps {
    asks: string[][];
    asksLoading: boolean;
    asksError?: CommonError;
    bids: string[][];
    currentMarket: Market | undefined;
}

interface DispatchProps {
    orderBookFetch: typeof orderBookFetch;
}

type Props = ReduxProps & DispatchProps;

export class OrderBookContainer extends React.Component<Props> {
    public componentDidMount() {
        if (this.props.currentMarket) {
            this.props.orderBookFetch(this.props.currentMarket);
        }
    }

    public componentWillReceiveProps(next: Props) {
        if (this.props.currentMarket !== next.currentMarket && next.currentMarket) {
            this.props.orderBookFetch(next.currentMarket);
        }
    }

    public render() {
        const { asks, asksLoading, bids } = this.props;
        const cn = classNames('pg-asks', {
            'pg-asks--loading': asksLoading,
        });
        return (
            <div className={cn}>
                {asksLoading ? <Loader /> : this.orderBook(bids, asks)}
            </div>
        );
    }

    public static renderTotal = array => {
        const total: number[] = [];
        array.map(item => {
            const [price, volume] = item;
            return [(Number(volume) * Number(price)).toFixed(2)];
        }).reduce((accumulator, currentValue, currentIndex) => {
            total[currentIndex] = Number(accumulator) + Number(currentValue);
            return (Number(accumulator) + Number(currentValue));
        }, 0);
        return total;
    }

    private static renderData(asks: string[][]) {
        const total = this.renderTotal(asks);
        return (asks.length > 0) ? asks.map((item, i) => {
            const [price, volume] = item;
            return [price, volume, total[i]];
        }) : [['There is no data to show...']];
    }

    public static calcMaxVolume(bids: string[][], asks: string[][]) {
        return Math.max(...this.renderTotal(bids), ...this.renderTotal(asks));
    }

    private selectEntry(index) {
        // TODO: prefill the Order component with the selected price
    }

    private orderBook = (bids, asks) => (
        <OrderBook
            side={'left'}
            title={'Asks'}
            headers={['Price', 'Amount', 'Volume']}
            data={OrderBookContainer.renderData(asks.sort())}
            rowBackgroundColor={'rgba(232, 94, 89, 0.5)'}
            maxVolume={OrderBookContainer.calcMaxVolume(bids, asks)}
            orderBookEntry={OrderBookContainer.renderTotal(asks)}
            onSelect={this.selectEntry}
        />
    );

}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    asks: selectDepthAsks(state),
    bids: selectDepthBids(state),
    asksLoading: selectDepthLoading(state),
    asksError: selectDepthError(state),
    currentMarket: selectCurrentMarket(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        orderBookFetch: payload => dispatch(orderBookFetch(payload)),
    });

const Asks = connect(mapStateToProps, mapDispatchToProps)(OrderBookContainer);
const renderTotal = OrderBookContainer.renderTotal;
const calcMaxVolume = OrderBookContainer.calcMaxVolume;
type AsksProps = ReduxProps;

export {
    Asks,
    AsksProps,
    renderTotal,
    calcMaxVolume,
};
