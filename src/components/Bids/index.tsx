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
    bids: string[][];
    bidsLoading: boolean;
    bidsError?: CommonError;
    asks: string[][];
    currentMarket: Market | undefined;
}

interface DispatchProps {
    orderBookFetch: typeof orderBookFetch;
}

type Props = ReduxProps & DispatchProps;

class OrderBookContainer extends React.Component<Props> {
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
        const { bids, bidsLoading, asks } = this.props;
        const cn = classNames('', {
            'pg-bids--loading': bidsLoading,
        });
        return (
            <div className={cn}>
                {bidsLoading ? <Loader /> : this.orderBook(bids, asks)}
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
            return Number(accumulator) + Number(currentValue);
        }, 0);
        return total;
    }

    private static renderData(bids: string[][]) {
        const total = this.renderTotal(bids);
        return (bids.length > 0) ? bids.map((item, i) => {
            const [price, volume] = item;
            return [total[i], volume, price];
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
            side={'right'}
            title={'Bids'}
            headers={['Volume', 'Amount', 'Price']}
            data={OrderBookContainer.renderData(bids)}
            rowBackgroundColor={'rgba(84, 180, 137, 0.5)'}
            maxVolume={OrderBookContainer.calcMaxVolume(bids, asks)}
            orderBookEntry={OrderBookContainer.renderTotal(bids)}
            onSelect={this.selectEntry}
        />
    );
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    bids: selectDepthBids(state),
    asks: selectDepthAsks(state),
    bidsLoading: selectDepthLoading(state),
    bidsError: selectDepthError(state),
    currentMarket: selectCurrentMarket(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        orderBookFetch: payload => dispatch(orderBookFetch(payload)),
    });

const Bids = connect(mapStateToProps, mapDispatchToProps)(OrderBookContainer);
const renderVolume = OrderBookContainer.renderTotal;
type BidsProps = ReduxProps;

export {
    Bids,
    BidsProps,
    renderVolume,
};
