import { Decimal, Loader, OrderBook } from '@openware/components';
import classNames from 'classnames';
import * as React from 'react';
import { InjectedIntlProps, injectIntl, intlShape } from 'react-intl';
import {
    connect,
    MapDispatchToPropsFunction,
    MapStateToProps,
} from 'react-redux';
import { accumulateVolume, calcMaxVolume, sortAsks } from '../../helpers';
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
            data={this.renderOrderBook(asks, 'asks', this.props.intl.formatMessage({id: 'page.noDataToShow'}), this.props.currentMarket)}
            rowBackgroundColor={'rgba(232, 94, 89, 0.4)'}
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

    private renderOrderBook = (array: string[][], side: string, message: string, currentMarket?: Market) => {
        const total = accumulateVolume(array);
        const priceFixed = currentMarket ? currentMarket.bid_precision : 0;
        const amountFixed = currentMarket ? currentMarket.ask_precision : 0;
        return (array.length > 0) ? array.map((item, i) => {
            const [price, volume] = item;
            return [
                    <span style={{ color: 'var(--open-orders-order-sell)' }} key={i}><Decimal fixed={priceFixed}>{price}</Decimal></span>,
                    <Decimal key={i} fixed={amountFixed}>{volume}</Decimal>,
                    <Decimal key={i} fixed={amountFixed}>{total[i]}</Decimal>,
                ];
        }) : [[message]];
    }

    private handleOnSelect = (index: string) => {
        const { asks, currentPrice } = this.props;
        const priceToSet = asks[Number(index)] ? asks[Number(index)][0] : '';

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
