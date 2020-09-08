import classNames from 'classnames';
import * as React from 'react';
import { Spinner } from 'react-bootstrap';
import { useIntl} from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { CombinedOrderBook, Decimal } from '../../components';
import { colors } from '../../constants';
import { accumulateVolume, calcMaxVolume } from '../../helpers';
import {
    Market,
    selectCurrentColorTheme,
    selectCurrentMarket,
    selectCurrentPrice,
    selectDepthAsks,
    selectDepthBids,
    selectDepthLoading,
    selectMarketTickers,
    selectMobileDeviceState,
    setCurrentPrice,
    Ticker,
} from '../../modules';
import { OrderBookTableRow } from './OrderBookTableRow';


// render big/small breakpoint
const breakpoint = 448;


export const OrderBook = props => {
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const [width, setWidth] = React.useState(0);
    const orderRef = React.useRef<HTMLDivElement>(null);

    const bids = useSelector(selectDepthBids);
    const asks = useSelector(selectDepthAsks);
    const colorTheme = useSelector(selectCurrentColorTheme);
    const orderBookLoading = useSelector(selectDepthLoading);
    const currentMarket = useSelector(selectCurrentMarket);
    const currentPrice = useSelector(selectCurrentPrice);
    const marketTickers = useSelector(selectMarketTickers);
    const isMobileDevice = useSelector(selectMobileDeviceState);

    const isLarge = React.useMemo(() => (props.forceLarge || (width > breakpoint)), [props.forceLarge, width]);

    const cn = classNames('pg-combined-order-book ', {
        'cr-combined-order-book--data-loading': orderBookLoading,
        'pg-combined-order-book--no-data-first': (!asks.length && !isLarge) || (!bids.length && isLarge),
        'pg-combined-order-book--no-data-second': (!bids.length && !isLarge) || (!asks.length && isLarge),
    });

    const orderBook = () => {
        const asksData = isLarge ? asks : asks.slice(0).reverse();

        return (
            <CombinedOrderBook
                maxVolume={calcMaxVolume(bids, asks)}
                orderBookEntryAsks={accumulateVolume(asks)}
                orderBookEntryBids={accumulateVolume(bids)}
                rowBackgroundColorAsks={colors[colorTheme].orderBook.asks}
                rowBackgroundColorBids={colors[colorTheme].orderBook.bids}
                dataAsks={renderOrderBook(asksData, 'asks', formatMessage({id: 'page.noDataToShow'}), currentMarket) as any}
                dataBids={renderOrderBook(bids, 'bids', formatMessage({id: 'page.noDataToShow'}), currentMarket) as any}
                headers={renderHeaders()}
                lastPrice={lastPrice()}
                onSelectAsks={handleOnSelectAsks}
                onSelectBids={handleOnSelectBids}
                isLarge={isLarge}
            />
        );
    };

    const lastPrice = () => {
        const currentTicker = currentMarket && getTickerValue(currentMarket, marketTickers);

        if (currentMarket && currentTicker) {
            const classnames = classNames('', {
                'cr-combined-order-book__market-negative': currentTicker.price_change_percent.includes('-'),
                'cr-combined-order-book__market-positive': currentTicker.price_change_percent.includes('+'),
            });

            return (
                <React.Fragment>
                    <span className={classnames}>
                        {Decimal.format(+(currentTicker.last), currentMarket.price_precision)}&nbsp;
                        {isMobileDevice ? null : currentMarket.quote_unit.toUpperCase()}
                    </span>
                    <span>{formatMessage({id: 'page.body.trade.orderbook.lastMarket'})}</span>
                </React.Fragment>
            );
        } else {
            return <React.Fragment><span className={'cr-combined-order-book__market-negative'}>0</span><span>{formatMessage({id: 'page.body.trade.orderbook.lastMarket'})}</span></React.Fragment>;
        }
    };

    const renderHeaders = () => {
        const formattedBaseUnit = (currentMarket && currentMarket.base_unit) ? `(${currentMarket.base_unit.toUpperCase()})` : '';
        const formattedQuoteUnit = (currentMarket && currentMarket.quote_unit) ? `(${currentMarket.quote_unit.toUpperCase()})` : '';

        if (isMobileDevice) {
            return [
                `${formatMessage({id: 'page.body.trade.orderbook.header.price'})}\n${formattedQuoteUnit}`,
                `${formatMessage({id: 'page.body.trade.orderbook.header.amount'})}\n${formattedBaseUnit}`,
            ];
        }

        return [
            `${formatMessage({id: 'page.body.trade.orderbook.header.price'})}\n${formattedQuoteUnit}`,
            `${formatMessage({id: 'page.body.trade.orderbook.header.amount'})}\n${formattedBaseUnit}`,
            `${formatMessage({id: 'page.body.trade.orderbook.header.volume'})}\n${formattedBaseUnit}`,
        ];
    };

    const renderOrderBook = (array: string[][], side: string, message: string, currentM?: Market) => {
        let total = accumulateVolume(array);
        const priceFixed = currentM ? currentM.price_precision : 0;
        const amountFixed = currentM ? currentM.amount_precision : 0;

        return (array.length > 0) ? array.map((item, i) => {
            const [price, volume] = item;
            switch (side) {
                case 'asks':
                    total = isLarge ? accumulateVolume(array) : accumulateVolume(array.slice(0).reverse()).slice(0).reverse();

                    if (isMobileDevice) {
                        return [
                            <OrderBookTableRow
                                type="price"
                                prevValue={array[i + 1] ? array[i + 1][0] : 0}
                                price={price}
                                fixed={priceFixed}
                            />,
                              <OrderBookTableRow
                                total={total[i]}
                                fixed={amountFixed}
                              />,
                        ];
                    }

                    return [
                      <OrderBookTableRow
                        type="price"
                        prevValue={array[i + 1] ? array[i + 1][0] : 0}
                        price={price}
                        fixed={priceFixed}
                      />,
                      <OrderBookTableRow total={volume} fixed={amountFixed}/>,
                      <OrderBookTableRow total={total[i]} fixed={amountFixed}/>,
                    ];
                default:
                    if (isLarge) {
                        if (isMobileDevice) {
                            return [
                                <OrderBookTableRow total={total[i]} fixed={amountFixed}/>,
                                <OrderBookTableRow
                                  type="price"
                                  prevValue={array[i - 1] ? array[i - 1][0] : 0}
                                  price={price}
                                  fixed={priceFixed}
                                />,
                            ];
                        }

                        return [
                            <OrderBookTableRow total={total[i]} fixed={amountFixed}/>,
                            <OrderBookTableRow total={volume} fixed={amountFixed}/>,
                            <OrderBookTableRow
                                type="price"
                                prevValue={array[i - 1] ? array[i - 1][0] : 0}
                                price={price}
                                fixed={priceFixed}
                            />,
                        ];
                    } else {
                        if (isMobileDevice) {
                            return [
                                <OrderBookTableRow
                                    type="price"
                                    prevValue={array[i - 1] ? array[i - 1][0] : 0}
                                    price={price}
                                    fixed={priceFixed}
                                />,
                                <OrderBookTableRow total={total[i]} fixed={amountFixed}/>,
                            ];
                        }

                        return [
                            <OrderBookTableRow
                                type="price"
                                prevValue={array[i - 1] ? array[i - 1][0] : 0}
                                price={price}
                                fixed={priceFixed}
                            />,
                            <OrderBookTableRow total={volume} fixed={amountFixed}/>,
                            <OrderBookTableRow total={total[i]} fixed={amountFixed}/>,
                        ];
                    }
            }
        }) : [[[''], message, ['']]];
    };

    const handleOnSelectBids = (index: string) => {
        const priceToSet = bids[Number(index)] && Number(bids[Number(index)][0]);
        if (currentPrice !== priceToSet) {
            dispatch(setCurrentPrice(priceToSet));
        }
    };

    const handleOnSelectAsks = (index: string) => {
        const asksData = isLarge ? asks : asks.slice(0).reverse();
        const priceToSet = asksData[Number(index)] && Number(asksData[Number(index)][0]);
        if (currentPrice !== priceToSet) {
            dispatch(setCurrentPrice(priceToSet));
        }
    };

    const getTickerValue = (cMarket: Market, tickers: { [key: string]: Ticker }) => {
        const defaultTicker = { amount: 0, low: 0, last: 0, high: 0, volume: 0, open: 0, price_change_percent: '+0.00%' };

        return tickers[cMarket.id] || defaultTicker;
    };

    // eslint-disable-next-line
    React.useEffect(() => {
        const { current } = orderRef;
        if (current && (current.clientWidth !== width)) {
            setWidth(current.clientWidth);
        }
    });

    return (
        <div className={cn} ref={orderRef}>
            <div className={'cr-table-header__content'}>
                {formatMessage({ id: 'page.body.trade.orderbook' })}
            </div>
            {orderBookLoading ? <div className="pg-combined-order-book-loader"><Spinner animation="border" variant="primary" /></div> : orderBook()}
        </div>
    );
};
