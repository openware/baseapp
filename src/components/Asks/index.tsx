import { Loader, OrderBook } from '@openware/components';
import classNames from 'classnames';
import * as React from 'react';
import { InjectedIntlProps, injectIntl, intlShape } from 'react-intl';
import {
    connect,
    MapDispatchToPropsFunction,
    MapStateToProps,
} from 'react-redux';
import { accumulateVolume, calcMaxVolume, renderOrderBook, sortAsks } from '../../helpers';
import {
    Market,
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
    asks: string[][];
    asksLoading: boolean;
    asksError?: CommonError;
    bids: string[][];
    currentMarket: Market | undefined;
    currentPrice: string;
}

interface DispatchProps {
    setCurrentPrice: typeof setCurrentPrice;
}

type Props = ReduxProps & DispatchProps & InjectedIntlProps;

export class OrderBookContainer extends React.Component<Props> {
    //tslint:disable-next-line:no-any
    public static propsTypes: React.ValidationMap<any> = {
        intl: intlShape.isRequired,
    };

    public render() {
        const { asks, asksLoading, bids } = this.props;
        const cn = classNames('pg-asks', {
            'pg-asks--loading': asksLoading,
        });

        return (
            <div className={cn}>
                {asksLoading ? <Loader /> : this.orderBook(bids, sortAsks(asks))}
            </div>
        );
    }

    private orderBook = (bids, asks) => (
        <OrderBook
            side={'left'}
            title={this.props.intl.formatMessage({id: 'page.body.trade.header.asks'})}
            headers={this.renderHeaders()}
            data={renderOrderBook(asks, 'asks', this.props.intl.formatMessage({id: 'page.noDataToShow'}), this.props.currentMarket)}
            rowBackgroundColor={'rgba(232, 94, 89, 0.5)'}
            maxVolume={calcMaxVolume(bids, asks)}
            orderBookEntry={accumulateVolume(asks)}
            onSelect={this.handleOnSelect}
        />
    );

    private renderHeaders = () => {
        return [
            this.props.intl.formatMessage({ id: 'page.body.trade.orderbook.header.price' }),
            this.props.intl.formatMessage({ id: 'page.body.trade.orderbook.header.amount' }),
            this.props.intl.formatMessage({ id: 'page.body.trade.orderbook.header.volume' }),
        ];
    }

    private handleOnSelect = (index: number) => {
        const { asks, currentPrice } = this.props;
        const priceToSet = asks[index] ? asks[index][0] : '';

        if (currentPrice !== priceToSet) {
            this.props.setCurrentPrice(priceToSet);
        }
    };
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    asks: selectDepthAsks(state),
    bids: selectDepthBids(state),
    asksLoading: selectDepthLoading(state),
    asksError: selectDepthError(state),
    currentMarket: selectCurrentMarket(state),
    currentPrice: selectCurrentPrice(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        setCurrentPrice: payload => dispatch(setCurrentPrice(payload)),
    });

const Asks = injectIntl(connect(mapStateToProps, mapDispatchToProps)(OrderBookContainer));
type AsksProps = ReduxProps;

export {
    Asks,
    AsksProps,
};
