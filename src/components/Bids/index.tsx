import { Decimal, Loader, OrderBook } from '@openware/components';
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
    selectCurrentPrice,
    selectDepthAsks,
    selectDepthBids,
    selectDepthError,
    selectDepthLoading,
    setCurrentPrice,
} from '../../modules';
import { CommonError } from '../../modules/types';

interface ReduxProps {
    bids: string[][];
    bidsLoading: boolean;
    bidsError?: CommonError;
    asks: string[][];
    currentMarket: Market | undefined;
    currentPrice: string;
}

interface DispatchProps {
    orderBookFetch: typeof orderBookFetch;
    setCurrentPrice: typeof setCurrentPrice;
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

    private static renderData(bids: string[][], currentMarket?: Market) {
        const total = this.renderTotal(bids);
        const priceFixed = currentMarket ? currentMarket.bid_precision : 0;
        const amountFixed = currentMarket ? currentMarket.ask_precision : 0;
        return (bids.length > 0) ? bids.map((item, i) => {
            const [price, volume] = item;
            return [Decimal.format(Number(total[i]), amountFixed), Decimal.format(Number(volume), amountFixed), Decimal.format(Number(price), priceFixed)];
        }) : [['There is no data to show...']];
    }

    public static calcMaxVolume(bids: string[][], asks: string[][]) {
        return Math.max(...this.renderTotal(bids), ...this.renderTotal(asks));
    }

    private orderBook = (bids, asks) => (
        <OrderBook
            side={'right'}
            title={'Bids'}
            headers={['Volume', 'Amount', 'Price']}
            data={OrderBookContainer.renderData(bids, this.props.currentMarket)}
            rowBackgroundColor={'rgba(84, 180, 137, 0.5)'}
            maxVolume={OrderBookContainer.calcMaxVolume(bids, asks)}
            orderBookEntry={OrderBookContainer.renderTotal(bids)}
            onSelect={this.handleOnSelect}
        />
    );

    private handleOnSelect = (index: number) => {
        const { bids, currentPrice } = this.props;
        const priceToSet = bids[index] ? bids[index][0] : '';

        if (currentPrice !== priceToSet) {
            this.props.setCurrentPrice(priceToSet);
        }
    };
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    bids: selectDepthBids(state),
    asks: selectDepthAsks(state),
    bidsLoading: selectDepthLoading(state),
    bidsError: selectDepthError(state),
    currentMarket: selectCurrentMarket(state),
    currentPrice: selectCurrentPrice(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        orderBookFetch: payload => dispatch(orderBookFetch(payload)),
        setCurrentPrice: payload => dispatch(setCurrentPrice(payload)),
    });

const Bids = connect(mapStateToProps, mapDispatchToProps)(OrderBookContainer);
const renderVolume = OrderBookContainer.renderTotal;
type BidsProps = ReduxProps;

export {
    Bids,
    BidsProps,
    renderVolume,
};
