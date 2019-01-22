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
    selectDepthError,
    selectDepthLoading,
} from '../../modules';
import { CommonError } from '../../modules/types';

interface ReduxProps {
    asks: string[][];
    asksLoading: boolean;
    asksError?: CommonError;
    currentMarket: Market;
}

interface DispatchProps {
    orderBookFetch: typeof orderBookFetch;
}

type Props = ReduxProps & DispatchProps;

class OrderBookContainer extends React.Component<Props> {
    public componentDidMount() {
        if (this.props.currentMarket.id){
          this.props.orderBookFetch(this.props.currentMarket);
        }
    }

    public componentWillReceiveProps(next: Props) {
        if (this.props.currentMarket !== next.currentMarket) {
            this.props.orderBookFetch(next.currentMarket);
        }
    }

    public render() {
        const { asks, asksLoading } = this.props;
        const cn = classNames('pg-asks', {
            'pg-asks--loading': asksLoading,
        });
        return (
            <div className={cn}>
                {asksLoading ? <Loader /> : this.orderBook(asks)}
            </div>
        );
    }

    private static renderData(asks: string[][]) {
        return (asks.length > 0) ? asks.map(item => {
            const [ price, volume ] = item;
            return [ price, volume ];
        }) : [['There is no data to show...']];
    }

    private orderBook = items => (
        <OrderBook
            title={'Asks'}
            headers={['Price', 'Amount']}
            data={OrderBookContainer.renderData(items)}
        />
    );
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    asks: selectDepthAsks(state),
    asksLoading: selectDepthLoading(state),
    asksError: selectDepthError(state),
    currentMarket: selectCurrentMarket(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        orderBookFetch: payload => dispatch(orderBookFetch(payload)),
    });

const Asks = connect(mapStateToProps, mapDispatchToProps)(OrderBookContainer);

export {
    Asks,
};
