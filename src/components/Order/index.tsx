import * as React from 'react';
import { OrderForm } from '../';
import { TabPanel } from '../molecules/TabPanel/TabPanel';

export type FormType = 'buy' | 'sell';

export type DropdownElem = number | string | React.ReactNode;

export interface OrderProps {
    type: FormType;
    orderType: string | React.ReactNode;
    price: number | string;
    amount: number | string;
    available: number;
}

export type OnSubmitCallback = (order: OrderProps) => void;

export interface OrderComponentProps {
    /**
     * Amount of money in base currency wallet
     */
    availableBase: number;
    /**
     * Amount of money in quote currency wallet
     */
    availableQuote: number;
    /**
     * Callback which is called when a form is submitted
     */
    onSubmit: OnSubmitCallback;
    /**
     * If orderType is 'Market' this value will be used as price for buy tab
     */
    priceMarketBuy: number;
    /**
     * If orderType is 'Market' this value will be used as price for sell tab
     */
    priceMarketSell: number;
    /**
     * If orderType is 'Limit' this value will be used as price
     */
    priceLimit?: number;
    /**
     * Name of currency for price field
     */
    from: string;
    /**
     * Name of currency for amount field
     */
    to: string;
    /**
     * Whether order is disabled to execute
     */
    disabled?: boolean;
    handleSendType?: (index: number, label: string) => void;
    /**
     * Index of tab to switch on
     */
    tabIndex?: number;
    /**
     * Precision of amount, total, available, fee value
     */
    currentMarketAskPrecision: number;
    /**
     * Precision of price value
     */
    currentMarketBidPrecision: number;
    /**
     * @default 'Order Type'
     * Text for order type dropdown label.
     */
    orderTypeText?: string;
    /**
     * @default 'Price'
     * Text for Price field Text.
     */
    priceText?: string;
    /**
     * @default 'Amount'
     * Text for Amount field Text.
     */
    amountText?: string;
    /**
     * @default 'Total'
     * Text for Total field Text.
     */
    totalText?: string;
    /**
     * @default 'Available'
     * Text for Available field Text.
     */
    availableText?: string;
    /**
     * @default 'BUY'
     * Text for buy order submit button.
     */
    submitBuyButtonText?: string;
    /**
     * @default 'SELL'
     * Text for sell order submit button.
     */
    submitSellButtonText?: string;
    /**
     * @default 'Buy'
     * Text for Buy tab label.
     */
    labelFirst?: string;
    /**
     * @default 'Sell'
     * Text for Sell tab label.
     */
    labelSecond?: string;
    orderTypes?: DropdownElem[];
    orderTypesIndex?: DropdownElem[];
    /**
     *
     */
    width?: number;
    /**
     * proposals for buy
     */
    bids: string[][];
    /**
     * proposals for sell
     */
    asks: string[][];
    /**
     * start handling change price
     */
    listenInputPrice?: () => void;
}

const defaultOrderTypes: DropdownElem[] = [
    'Limit',
    'Market',
];

const splitBorder = 449;
const defaultWidth = 635;

class Order extends React.PureComponent<OrderComponentProps> {
    public render() {
        const {
            width = defaultWidth,
        } = this.props;

        if (width < splitBorder) {
            return (
                <div className="cr-order">
                    <TabPanel
                        fixed={true}
                        panels={this.getPanels()}
                        onTabChange={this.handleChangeTab}
                        tabIndex={this.props.tabIndex}
                    />
                </div>
            );
        }

        return (
            <div className="cr-order cr-order--extended">
                <div className="cr-order--extended__buy">
                    <TabPanel
                        fixed={true}
                        panels={this.getPanelsBuy()}
                        onTabChange={this.handleChangeTab}
                        tabIndex={this.props.tabIndex}
                    />
                </div>
                <div className="cr-order--extended__sell">
                    <TabPanel
                        fixed={true}
                        panels={this.getPanelsSell()}
                        onTabChange={this.handleChangeTab}
                        tabIndex={this.props.tabIndex}
                    />
                </div>
            </div>
        );
    }

    private getPanels = () => {
        const {
            availableBase,
            availableQuote,
            disabled,
            priceMarketBuy,
            priceMarketSell,
            priceLimit,
            from,
            to,
            currentMarketAskPrecision,
            currentMarketBidPrecision,
            orderTypeText,
            priceText,
            amountText,
            totalText,
            availableText,
            submitBuyButtonText,
            submitSellButtonText,
            labelFirst,
            labelSecond,
            orderTypes,
            orderTypesIndex,
            asks,
            bids,
            listenInputPrice,
        } = this.props;
        return [
            {
                content: (
                    <OrderForm
                        proposals={asks}
                        disabled={disabled}
                        type="buy"
                        from={from}
                        to={to}
                        available={availableQuote}
                        priceMarket={priceMarketBuy}
                        priceLimit={priceLimit}
                        onSubmit={this.props.onSubmit}
                        orderTypes={orderTypes ? orderTypes : defaultOrderTypes}
                        orderTypesIndex={orderTypesIndex ? orderTypesIndex : defaultOrderTypes}
                        currentMarketAskPrecision={currentMarketAskPrecision}
                        currentMarketBidPrecision={currentMarketBidPrecision}
                        orderTypeText={orderTypeText}
                        priceText={priceText}
                        amountText={amountText}
                        totalText={totalText}
                        availableText={availableText}
                        submitButtonText={submitBuyButtonText}
                        listenInputPrice={listenInputPrice}
                    />
                ),
                label: labelFirst ? labelFirst : 'Buy',
            },
            {
                content: (
                    <OrderForm
                        proposals={bids}
                        type="sell"
                        from={from}
                        to={to}
                        available={availableBase}
                        priceMarket={priceMarketSell}
                        priceLimit={priceLimit}
                        onSubmit={this.props.onSubmit}
                        orderTypes={orderTypes ? orderTypes : defaultOrderTypes}
                        orderTypesIndex={orderTypesIndex ? orderTypesIndex : defaultOrderTypes}
                        currentMarketAskPrecision={currentMarketAskPrecision}
                        currentMarketBidPrecision={currentMarketBidPrecision}
                        orderTypeText={orderTypeText}
                        priceText={priceText}
                        amountText={amountText}
                        totalText={totalText}
                        availableText={availableText}
                        submitButtonText={submitSellButtonText}
                        listenInputPrice={listenInputPrice}
                    />
                ),
                label: labelSecond ? labelSecond : 'Sell',
            },
        ];
    };

    private getPanelsBuy = () => {
        const {
            availableQuote,
            disabled,
            priceMarketBuy,
            priceLimit,
            from,
            to,
            currentMarketAskPrecision,
            currentMarketBidPrecision,
            orderTypeText,
            priceText,
            amountText,
            totalText,
            availableText,
            submitBuyButtonText,
            labelFirst,
            orderTypes,
            orderTypesIndex,
            asks,
            listenInputPrice,
        } = this.props;
        return [
            {
                content: (
                    <OrderForm
                        proposals={asks}
                        disabled={disabled}
                        type="buy"
                        from={from}
                        to={to}
                        available={availableQuote}
                        priceMarket={priceMarketBuy}
                        priceLimit={priceLimit}
                        onSubmit={this.props.onSubmit}
                        orderTypes={orderTypes ? orderTypes : defaultOrderTypes}
                        orderTypesIndex={orderTypesIndex ? orderTypesIndex : defaultOrderTypes}
                        currentMarketAskPrecision={currentMarketAskPrecision}
                        currentMarketBidPrecision={currentMarketBidPrecision}
                        orderTypeText={orderTypeText}
                        priceText={priceText}
                        amountText={amountText}
                        totalText={totalText}
                        availableText={availableText}
                        submitButtonText={submitBuyButtonText}
                        listenInputPrice={listenInputPrice}
                    />
                ),
                label: labelFirst ? labelFirst : 'Buy',
            },
        ];
    };

    private getPanelsSell = () => {
        const {
            availableBase,
            priceMarketSell,
            priceLimit,
            from,
            to,
            currentMarketAskPrecision,
            currentMarketBidPrecision,
            orderTypeText,
            priceText,
            amountText,
            totalText,
            availableText,
            submitSellButtonText,
            labelSecond,
            orderTypes,
            orderTypesIndex,
            bids,
            listenInputPrice,
        } = this.props;
        return [
            {
                content: (
                    <OrderForm
                        proposals={bids}
                        type="sell"
                        from={from}
                        to={to}
                        available={availableBase}
                        priceMarket={priceMarketSell}
                        priceLimit={priceLimit}
                        onSubmit={this.props.onSubmit}
                        orderTypes={orderTypes ? orderTypes : defaultOrderTypes}
                        orderTypesIndex={orderTypesIndex ? orderTypesIndex : defaultOrderTypes}
                        currentMarketAskPrecision={currentMarketAskPrecision}
                        currentMarketBidPrecision={currentMarketBidPrecision}
                        orderTypeText={orderTypeText}
                        priceText={priceText}
                        amountText={amountText}
                        totalText={totalText}
                        availableText={availableText}
                        submitButtonText={submitSellButtonText}
                        listenInputPrice={listenInputPrice}
                    />
                ),
                label: labelSecond ? labelSecond : 'Sell',
            },
        ];
    };

    private handleChangeTab = (index: number, label?: string) => {
        if (this.props.handleSendType && label) {
          this.props.handleSendType(index, label);
        }
    }
}

export {
    Order,
};
