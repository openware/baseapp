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
    selectDepthBids,
    selectDepthError,
    selectDepthLoading,
} from '../../modules';
import { CommonError } from '../../modules/types';

interface ReduxProps {
    bids: string[][];
    bidsLoading: boolean;
    bidsError?: CommonError;
    currentMarket: Market;
}

interface DispatchProps {
    orderBookFetch: typeof orderBookFetch;
}

type Props = ReduxProps & DispatchProps;

class OrderBookContainer extends React.Component<Props> {
    public componentDidMount() {
        this.props.orderBookFetch(this.props.currentMarket);
    }

    public componentWillReceiveProps(next: Props) {
        if (this.props.currentMarket !== next.currentMarket) {
            this.props.orderBookFetch(next.currentMarket);
        }
    }

    public render() {
        const { bidsError, bids, bidsLoading } = this.props;
        const cn = classNames('', {
            'pg-bids--loading': bidsLoading,
        });
        return (
            <div className={cn}>
                {bidsError && (<span>{bidsError.message}</span>)}
                {bidsLoading ? <Loader /> : this.orderBook(bids)}
            </div>
        );
    }

    private static renderData(bids: string[][]) {
        return (bids.length > 0) ? bids.map(item => {
            const [ price, volume ] = item;
            return [ volume, price ];
        }) : [['There is no data to show...']];
    }

    private orderBook = items => (
        <OrderBook
            title={'Bids'}
            headers={['Price', 'Amount']}
            data={OrderBookContainer.renderData(items)}
        />
    );
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    bids: selectDepthBids(state),
    bidsLoading: selectDepthLoading(state),
    bidsError: selectDepthError(state),
    currentMarket: selectCurrentMarket(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        orderBookFetch: payload => dispatch(orderBookFetch(payload)),
    });

const Bids = connect(mapStateToProps, mapDispatchToProps)(OrderBookContainer);

export {
    Bids,
};
