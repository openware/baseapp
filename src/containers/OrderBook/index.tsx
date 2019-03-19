import { CombinedOrderBook, Decimal, Loader } from '@openware/components';
import classNames from 'classnames';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import {
    connect,
    MapDispatchToPropsFunction,
    MapStateToProps,
} from 'react-redux';
import { accumulateVolume, calcMaxVolume, sortBids } from '../../helpers';
import {
    Market,
    RootState,
    selectCurrentMarket,
    selectCurrentPrice,
    selectDepthAsks,
    selectDepthBids,
    selectDepthLoading,
    selectMarketTickers,
    setCurrentPrice,
} from '../../modules';

interface ReduxProps {
    bids: string[][];
    isLoading: boolean;
    asks: string[][];
    currentMarket: Market | undefined;
    currentPrice: string;
}

interface DispatchProps {
    setCurrentPrice: typeof setCurrentPrice;
}

interface State {
    width: number;
}

type Props = ReduxProps & DispatchProps & InjectedIntlProps;

// render big/small breakpoint
const breakpoint = 449;

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

    public render() {
        const { bids, isLoading, asks } = this.props;
        const cn = classNames('pg-combined-order-book ', {
            'cr-combined-order-book--loading': isLoading,
            'pg-combined-order-book--no-data-asks': !asks.length,
            'pg-combined-order-book--no-data-bids': !bids.length,
        });

        return (
            <div className={cn} ref={this.orderRef}>
                {isLoading ? <Loader /> : this.orderBook(sortBids(bids), asks)}
            </div>
        );
    }

    private orderBook = (bids, asks) => {
        const isLarge = this.state.width >= breakpoint;
        const asksData = isLarge ? asks : asks.slice(0).reverse();
        return (
            <React.Fragment>
                <div className={'cr-table-header__content'}>
                    {this.props.intl.formatMessage({id: 'page.body.trade.orderbook'})}
                </div>
                <CombinedOrderBook
                    maxVolume={calcMaxVolume(bids, asks)}
                    orderBookEntryAsks={accumulateVolume(asks)}
                    orderBookEntryBids={accumulateVolume(bids)}
                    rowBackgroundColorAsks={'rgba(232, 94, 89, 0.4)'}
                    rowBackgroundColorBids={'rgba(84, 180, 137, 0.4)'}
                    dataAsks={this.renderOrderBook(asksData, 'asks', this.props.intl.formatMessage({id: 'page.noDataToShow'}), this.props.currentMarket)}
                    dataBids={this.renderOrderBook(bids, 'bids', this.props.intl.formatMessage({id: 'page.noDataToShow'}), this.props.currentMarket)}
                    headers={this.renderHeaders()}
                    lastPrice={this.lastPrice()}
                    onSelectAsks={this.handleOnSelectAsks}
                    onSelectBids={this.handleOnSelectBids}
                    isLarge={isLarge}
                />
            </React.Fragment>
        );
    };

    private lastPrice = () => {
        const { marketTickers, currentMarket } = this.props;
        const defaultTicker = {
            last: 0,
            price_change_percent: '+0.00%',
        };
        if (currentMarket && marketTickers[currentMarket.id] && marketTickers[currentMarket.id].price_change_percent) {
          const cn = classNames('', {
            'cr-combined-order-book__market-negative': (marketTickers[currentMarket.id] || defaultTicker).price_change_percent.includes('-'),
            'cr-combined-order-book__market-positive': (marketTickers[currentMarket.id] || defaultTicker).price_change_percent.includes('+'),
          });
          return (
              <React.Fragment>
                  <span className={cn}>
                      {Decimal.format(Number((marketTickers[currentMarket.id] || defaultTicker).last), currentMarket.ask_precision)} {currentMarket.bid_unit.toUpperCase()}
                  </span>
                  <span>Last Market Price</span>
              </React.Fragment>
            );
        } else {
          return <React.Fragment><span className={'cr-combined-order-book__market-negative'}>0</span><span>Last Market Price</span></React.Fragment>;
        }
    };

    private renderHeaders = () => {
        return [
            this.props.intl.formatMessage({id: 'page.body.trade.orderbook.header.price'}),
            this.props.intl.formatMessage({id: 'page.body.trade.orderbook.header.amount'}),
            this.props.intl.formatMessage({id: 'page.body.trade.orderbook.header.volume'}),
        ];
    }

    private renderOrderBook = (array: string[][], side: string, message: string, currentMarket?: Market) => {
        let total = accumulateVolume(array);
        const isLarge = this.state.width > breakpoint;
        const priceFixed = currentMarket ? currentMarket.bid_precision : 0;
        const amountFixed = currentMarket ? currentMarket.ask_precision : 0;
        return (array.length > 0) ? array.map((item, i) => {
            const [price, volume] = item;
            const index = array.length - i - 1;
            switch (side) {
                case 'bids':
                    return [
                        <span key={i}><Decimal fixed={priceFixed}>{price}</Decimal></span>,
                        <Decimal key={i} fixed={amountFixed}>{volume}</Decimal>,
                        <Decimal key={i} fixed={amountFixed}>{total[i]}</Decimal>,
                    ];
                default:
                    if (isLarge) {
                        return [
                            <Decimal key={i} fixed={amountFixed}>{total[i]}</Decimal>,
                            <Decimal key={i} fixed={amountFixed}>{volume}</Decimal>,
                            <span key={i}><Decimal fixed={priceFixed}>{price}</Decimal></span>,
                            ];
                    } else {
                        total = accumulateVolume(array.slice(0).reverse());
                        return [
                            <span key={i}><Decimal fixed={priceFixed}>{price}</Decimal></span>,
                            <Decimal key={i} fixed={amountFixed}>{volume}</Decimal>,
                            <Decimal key={i} fixed={amountFixed}>{total[index]}</Decimal>,
                            ];
                    }
            }
        }) : [[[''], message]];
    }

    private handleOnSelectBids = (index: string) => {
        const { currentPrice, bids } = this.props;
        const priceToSet = bids[Number(index)] ? bids[Number(index)][0] : '';
        if (currentPrice !== priceToSet) {
            this.props.setCurrentPrice(priceToSet);
        }
    };
    private handleOnSelectAsks = (index: string) => {
        const { currentPrice, asks } = this.props;
        const isLarge = this.state.width >= breakpoint;
        const asksData = isLarge ? asks : asks.slice(0).reverse();
        const priceToSet = asksData[Number(index)] ? asksData[Number(index)][0] : '';
        if (currentPrice !== priceToSet) {
            this.props.setCurrentPrice(priceToSet);
        }
    };
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    bids: selectDepthBids(state),
    asks: selectDepthAsks(state),
    isLoading: selectDepthLoading(state),
    currentMarket: selectCurrentMarket(state),
    currentPrice: selectCurrentPrice(state),
    marketTickers: selectMarketTickers(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        setCurrentPrice: payload => dispatch(setCurrentPrice(payload)),
    });

const OrderBook = injectIntl(connect(mapStateToProps, mapDispatchToProps)(OrderBookContainer));
type OrderBookProps = ReduxProps;

export {
    OrderBook,
    OrderBookProps,
};
