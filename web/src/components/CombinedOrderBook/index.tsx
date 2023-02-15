import * as React from 'react';
import { OrderBook } from '../';
import { CellData } from '../Table';

export interface CombinedOrderBookProps {
    /**
     * Data which is used to render Asks Table.
     */
    dataAsks: CellData[][];
    /**
     * Data which is used to render Bids Table.
     */
    dataBids: CellData[][];
    /**
     * Max value of volume which is used to calculate width of background row
     */
    maxVolume?: number;
    /**
     * Data which is used to calculate width of each Asks background row
     */
    orderBookEntryAsks: number[];
    /**
     * Data which is used to calculate width of each Bids background row
     */
    orderBookEntryBids: number[];
    /**
     * Renders table header
     */
    headers: string[];
    /**
     * Sets Asks row background color
     */
    rowBackgroundColorAsks?: string;
    /**
     * Sets Bids row background color
     */
    rowBackgroundColorBids?: string;
    /**
     * Callback that is called when a Asks market is selected
     */
    onSelectAsks: (orderIndex: string) => void;
    /**
     * Callback that is called when Bids a market is selected
     */
    onSelectBids: (orderIndex: string) => void;
    /**
     * Sets component breakpoint
     */
    isLarge: boolean;
    /**
     * Sets last price
     */
    lastPrice: React.ReactNode;
    /**
     * Check if data exist in asks
     */
    noDataAsks: boolean;
    /**
     * Check if data exist in bids
     */
    noDataBids: boolean;
    /**
     * No data message for bids and asks message
     */
    noDataMessage: string;
}

export class CombinedOrderBook extends React.PureComponent<CombinedOrderBookProps> {
    public componentDidMount() {
        const scroll = document.getElementsByClassName('cr-order-book')[0];

        if (!this.props.isLarge && scroll) {
            scroll.scrollTop = scroll.scrollHeight;
        }
    }

    public UNSAFE_componentWillReceiveProps(next: CombinedOrderBookProps) {
        const scroll = document.getElementsByClassName('cr-order-book')[0];

        if (next.isLarge !== this.props.isLarge && !next.isLarge && scroll) {
            scroll.scrollTop = scroll.scrollHeight;
        }
    }

    public render() {
        return (
            <div className="cr-combined-order-book">
                {this.props.isLarge ? this.orderBookLarge() : this.orderBookSmall()}
            </div>
        );
    }

    public renderNoData = (message: string) => (
        <div className="cr-order-book cr-order-book--empty">
            <span className="cr-order-book--empty-item">{message}</span>
        </div>
    );

    private orderBookLarge = () => {
        const {
            dataAsks,
            dataBids,
            maxVolume,
            orderBookEntryAsks,
            orderBookEntryBids,
            headers,
            rowBackgroundColorAsks,
            rowBackgroundColorBids,
            onSelectAsks,
            onSelectBids,
            lastPrice,
            noDataAsks,
            noDataBids,
            noDataMessage,
        } = this.props;

        const reverseHead = headers.slice(0).reverse();

        return (
            <React.Fragment>
                <div className="cr-combined-order-book__large">
                    {noDataBids ? (
                        this.renderNoData(noDataMessage)
                    ) : (
                        <OrderBook
                            side={'right'}
                            headers={reverseHead}
                            data={dataBids}
                            rowBackgroundColor={rowBackgroundColorBids}
                            maxVolume={maxVolume}
                            orderBookEntry={orderBookEntryBids}
                            onSelect={onSelectBids}
                        />
                    )}
                    {noDataAsks ? (
                        this.renderNoData(noDataMessage)
                    ) : (
                        <OrderBook
                            side={'left'}
                            headers={headers}
                            data={dataAsks}
                            rowBackgroundColor={rowBackgroundColorAsks}
                            maxVolume={maxVolume}
                            orderBookEntry={orderBookEntryAsks}
                            onSelect={onSelectAsks}
                        />
                    )}
                </div>
                <div className="cr-combined-order-book__market cr-combined-order-book__large-market">{lastPrice}</div>
            </React.Fragment>
        );
    };

    private orderBookSmall = () => {
        const {
            dataAsks,
            dataBids,
            maxVolume,
            orderBookEntryAsks,
            orderBookEntryBids,
            headers,
            rowBackgroundColorAsks,
            rowBackgroundColorBids,
            onSelectAsks,
            onSelectBids,
            lastPrice,
            noDataAsks,
            noDataBids,
            noDataMessage,
        } = this.props;

        return (
            <React.Fragment>
                <div className="cr-combined-order-book__small">
                    {noDataAsks ? (
                        this.renderNoData(noDataMessage)
                    ) : (
                        <OrderBook
                            side={'left'}
                            headers={headers}
                            data={dataAsks}
                            rowBackgroundColor={rowBackgroundColorAsks}
                            maxVolume={maxVolume}
                            orderBookEntry={orderBookEntryAsks.reverse()}
                            onSelect={onSelectAsks}
                        />
                    )}
                    <div className="cr-combined-order-book__market">{lastPrice}</div>
                    {noDataBids ? (
                        this.renderNoData(noDataMessage)
                    ) : (
                        <OrderBook
                            side={'left'}
                            data={dataBids}
                            rowBackgroundColor={rowBackgroundColorBids}
                            maxVolume={maxVolume}
                            orderBookEntry={orderBookEntryBids}
                            onSelect={onSelectBids}
                        />
                    )}
                </div>
            </React.Fragment>
        );
    };
}
