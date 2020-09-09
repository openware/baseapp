import classNames from 'classnames';
import * as React from 'react';
import { Spinner } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { CombinedOrderBook, Decimal } from '../../components';
import { colors } from '../../constants';
import { accumulateVolume, calcMaxVolume } from '../../helpers';
import { IntlProps } from '../../index';
import {
    Market,
    RootState,
    selectCurrentColorTheme,
    selectCurrentMarket,
    selectCurrentPrice,
    selectDepthAsks,
    selectDepthBids,
    selectDepthLoading,
    selectMarketTickers,
    selectMobileDeviceState,
    selectOpenOrdersList,
    setCurrentPrice,
    Ticker,
} from '../../modules';
import { OrderCommon } from '../../modules/types';

interface ReduxProps {
    asks: string[][];
    bids: string[][];
    colorTheme: string;
    currentMarket?: Market;
    currentPrice?: number;
    openOrdersList: OrderCommon[];
    orderBookLoading: boolean;
    isMobileDevice: boolean;
}

interface DispatchProps {
    setCurrentPrice: typeof setCurrentPrice;
}

interface State {
    width: number;
}

interface OwnProps {
    marketTickers: {
        [key: string]: Ticker;
    };
    forceLarge?: boolean;
}

type Props = ReduxProps & DispatchProps & OwnProps & IntlProps;

// render big/small breakpoint
const breakpoint = 448;

class OrderBookContainer extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            width: 0,
        };

        this.orderRef = React.createRef();
    }

    private orderRef;

    public componentDidUpdate() {
        if (this.orderRef.current && this.state.width !== this.orderRef.current.clientWidth) {
            this.setState({
                width: this.orderRef.current.clientWidth,
            });
        }
    }

    public shouldComponentUpdate(nextProps: Props) {
        const { asks, bids, currentMarket, openOrdersList, marketTickers, orderBookLoading } = this.props;

        const lastPrice = currentMarket && this.getTickerValue(currentMarket, marketTickers).last;
        const nextLastPrice = nextProps.currentMarket && this.getTickerValue(nextProps.currentMarket, nextProps.marketTickers).last;

        return (
            JSON.stringify(nextProps.asks) !== JSON.stringify(asks) ||
            JSON.stringify(nextProps.bids) !== JSON.stringify(bids) ||
            (nextProps.currentMarket && nextProps.currentMarket.id) !== (currentMarket && currentMarket.id) ||
            nextLastPrice !== lastPrice ||
            nextProps.openOrdersList !== openOrdersList ||
            nextProps.orderBookLoading !== orderBookLoading
        );
    }

    public render() {
        const {
            asks,
            bids,
            forceLarge,
            orderBookLoading,
        } = this.props;

        const isLarge = forceLarge || (this.state.width > breakpoint);

        const cn = classNames('pg-combined-order-book ', {
            'cr-combined-order-book--data-loading': orderBookLoading,
            'pg-combined-order-book--no-data-first': (!asks.length && !isLarge) || (!bids.length && isLarge),
            'pg-combined-order-book--no-data-second': (!bids.length && !isLarge) || (!asks.length && isLarge),
        });

        return (
            <div className={cn} ref={this.orderRef}>
                <div className={'cr-table-header__content'}>
                    {this.props.intl.formatMessage({id: 'page.body.trade.orderbook'})}
                </div>
                {orderBookLoading ? <div className="pg-combined-order-book-loader"><Spinner animation="border" variant="primary" /></div> : this.orderBook(bids, asks)}
            </div>
        );
    }

    private orderBook = (bids, asks) => {
        const {
            forceLarge,
            colorTheme,
            currentMarket,
        } = this.props;

        const isLarge = forceLarge || this.state.width > breakpoint;
        const asksData = isLarge ? asks : asks.slice(0).reverse();

        return (
            <CombinedOrderBook
                maxVolume={calcMaxVolume(bids, asks)}
                orderBookEntryAsks={accumulateVolume(asks)}
                orderBookEntryBids={accumulateVolume(bids)}
                rowBackgroundColorAsks={colors[colorTheme].orderBook.asks}
                rowBackgroundColorBids={colors[colorTheme].orderBook.bids}
                dataAsks={this.renderOrderBook(asksData, 'asks', this.props.intl.formatMessage({id: 'page.noDataToShow'}), currentMarket)}
                dataBids={this.renderOrderBook(bids, 'bids', this.props.intl.formatMessage({id: 'page.noDataToShow'}), currentMarket)}
                headers={this.renderHeaders()}
                lastPrice={this.lastPrice()}
                onSelectAsks={this.handleOnSelectAsks}
                onSelectBids={this.handleOnSelectBids}
                isLarge={isLarge}
            />
        );
    };

    private lastPrice = () => {
        const { currentMarket, isMobileDevice, marketTickers } = this.props;
        const currentTicker = currentMarket && this.getTickerValue(currentMarket, marketTickers);

        if (currentMarket && currentTicker) {
            const cn = classNames('', {
                'cr-combined-order-book__market-negative': currentTicker.price_change_percent.includes('-'),
                'cr-combined-order-book__market-positive': currentTicker.price_change_percent.includes('+'),
            });

            return (
                <React.Fragment>
                    <span className={cn}>
                        {Decimal.format(+(currentTicker.last), currentMarket.price_precision, ',')}&nbsp;
                        {isMobileDevice ? null : currentMarket.quote_unit.toUpperCase()}
                    </span>
                    <span>{this.props.intl.formatMessage({id: 'page.body.trade.orderbook.lastMarket'})}</span>
                </React.Fragment>
            );
        } else {
          return <React.Fragment><span className={'cr-combined-order-book__market-negative'}>0</span><span>{this.props.intl.formatMessage({id: 'page.body.trade.orderbook.lastMarket'})}</span></React.Fragment>;
        }
    };

    private renderHeaders = () => {
        const {
            currentMarket,
            intl,
            isMobileDevice,
        } = this.props;
        const formattedBaseUnit = (currentMarket && currentMarket.base_unit) ? `(${currentMarket.base_unit.toUpperCase()})` : '';
        const formattedQuoteUnit = (currentMarket && currentMarket.quote_unit) ? `(${currentMarket.quote_unit.toUpperCase()})` : '';

        if (isMobileDevice) {
            return [
                `${intl.formatMessage({id: 'page.body.trade.orderbook.header.price'})}\n${formattedQuoteUnit}`,
                `${intl.formatMessage({id: 'page.body.trade.orderbook.header.amount'})}\n${formattedBaseUnit}`,
            ];
        }

        return [
            `${intl.formatMessage({id: 'page.body.trade.orderbook.header.price'})}\n${formattedQuoteUnit}`,
            `${intl.formatMessage({id: 'page.body.trade.orderbook.header.amount'})}\n${formattedBaseUnit}`,
            `${intl.formatMessage({id: 'page.body.trade.orderbook.header.volume'})}\n${formattedBaseUnit}`,
        ];
    };

    private renderOrderBook = (array: string[][], side: string, message: string, currentMarket?: Market) => {
        const { isMobileDevice, forceLarge } = this.props;
        let total = accumulateVolume(array);
        const isLarge = forceLarge || this.state.width > breakpoint;
        const priceFixed = currentMarket ? currentMarket.price_precision : 0;
        const amountFixed = currentMarket ? currentMarket.amount_precision : 0;

        return (array.length > 0) ? array.map((item, i) => {
            const [price, volume] = item;
            switch (side) {
                case 'asks':
                    total = isLarge ? accumulateVolume(array) : accumulateVolume(array.slice(0).reverse()).slice(0).reverse();

                    if (isMobileDevice) {
                        return [
                            <span key={i}>
                                <Decimal fixed={priceFixed} thousSep="," prevValue={array[i + 1] ? array[i + 1][0] : 0}>{price}</Decimal>
                            </span>,
                            <Decimal key={i} fixed={amountFixed} thousSep=",">{total[i]}</Decimal>,
                        ];
                    }

                    return [
                        <span key={i}>
                            <Decimal fixed={priceFixed} thousSep="," prevValue={array[i + 1] ? array[i + 1][0] : 0}>{price}</Decimal>
                        </span>,
                        <Decimal key={i} fixed={amountFixed} thousSep=",">{volume}</Decimal>,
                        <Decimal key={i} fixed={amountFixed} thousSep=",">{total[i]}</Decimal>,
                    ];
                default:
                    if (isLarge) {
                        if (isMobileDevice) {
                            return [
                                <Decimal key={i} fixed={amountFixed}>{total[i]}</Decimal>,
                                <span key={i}>
                                    <Decimal fixed={priceFixed} thousSep="," prevValue={array[i - 1] ? array[i - 1][0] : 0}>{price}</Decimal>
                                </span>,
                            ];
                        }

                        return [
                            <Decimal key={i} fixed={amountFixed} thousSep=",">{total[i]}</Decimal>,
                            <Decimal key={i} fixed={amountFixed} thousSep=",">{volume}</Decimal>,
                            <span key={i}>
                                <Decimal fixed={priceFixed} thousSep="," prevValue={array[i - 1] ? array[i - 1][0] : 0}>{price}</Decimal>
                            </span>,
                        ];
                    } else {
                        if (isMobileDevice) {
                            return [
                                <span key={i}>
                                    <Decimal fixed={priceFixed} thousSep="," prevValue={array[i - 1] ? array[i - 1][0] : 0}>{price}</Decimal>
                                </span>,
                                <Decimal key={i} fixed={amountFixed} thousSep=",">{total[i]}</Decimal>,
                            ];
                        }

                        return [
                            <span key={i}>
                                <Decimal fixed={priceFixed} thousSep="," prevValue={array[i - 1] ? array[i - 1][0] : 0}>{price}</Decimal>
                            </span>,
                            <Decimal key={i} fixed={amountFixed} thousSep=",">{volume}</Decimal>,
                            <Decimal key={i} fixed={amountFixed} thousSep=",">{total[i]}</Decimal>,
                        ];
                    }
            }
        }) : [[[''], message, ['']]];
    };

    private handleOnSelectBids = (index: string) => {
        const { currentPrice, bids } = this.props;
        const priceToSet = bids[Number(index)] && Number(bids[Number(index)][0]);
        if (currentPrice !== priceToSet) {
            this.props.setCurrentPrice(priceToSet);
        }
    };

    private handleOnSelectAsks = (index: string) => {
        const { asks, currentPrice, forceLarge } = this.props;
        const isLarge = forceLarge || this.state.width >= breakpoint;
        const asksData = isLarge ? asks : asks.slice(0).reverse();
        const priceToSet = asksData[Number(index)] && Number(asksData[Number(index)][0]);
        if (currentPrice !== priceToSet) {
            this.props.setCurrentPrice(priceToSet);
        }
    };

    private getTickerValue = (currentMarket: Market, tickers: { [key: string]: Ticker }) => {
        const defaultTicker = { amount: 0, low: 0, last: 0, high: 0, volume: 0, open: 0, price_change_percent: '+0.00%' };

        return tickers[currentMarket.id] || defaultTicker;
    };
}

const mapStateToProps = (state: RootState) => ({
    bids: selectDepthBids(state),
    asks: selectDepthAsks(state),
    colorTheme: selectCurrentColorTheme(state),
    orderBookLoading: selectDepthLoading(state),
    currentMarket: selectCurrentMarket(state),
    currentPrice: selectCurrentPrice(state),
    marketTickers: selectMarketTickers(state),
    openOrdersList: selectOpenOrdersList(state),
    isMobileDevice: selectMobileDeviceState(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        setCurrentPrice: payload => dispatch(setCurrentPrice(payload)),
    });

export const OrderBook = injectIntl(connect(mapStateToProps, mapDispatchToProps)(OrderBookContainer)) as any;
export type OrderBookProps = ReduxProps;
