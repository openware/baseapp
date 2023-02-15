import * as React from 'react';
import { Decimal, OrderForm } from '../';
import { TabPanel } from '../../components';
import { FilterPrice } from '../../filters';
import { getAmount, getTotalPrice } from '../../helpers';

export type FormType = 'buy' | 'sell';

export type DropdownElem = number | string | React.ReactNode;

export interface OrderProps {
    type: FormType;
    orderType: string | React.ReactNode;
    price: number | string;
    trigger: number | string;
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
     * If orderType is 'Stop-loss', 'Take-profit', 'Stop-limit', 'Take-limit' this value will be used as trigger price
     */
    trigger?: number;
    /**
     * Current market id
     */
    marketId: string;
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
    /**
     * Precision of amount, total, available, fee value
     */
    currentMarketAskPrecision: number;
    /**
     * Precision of price value
     */
    currentMarketBidPrecision: number;
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
    /**
     * start handling change trigger price
     */
    listenInputTrigger?: () => void;
    /**
     * default tab index
     */
    defaultTabIndex?: number;
    isMobileDevice?: boolean;
    currentMarketFilters: FilterPrice[];
    translate: (id: string, value?: any) => string;
}

interface State {
    index: number;
    amountSell: string;
    amountBuy: string;
}

const defaultOrderTypes: DropdownElem[] = ['Limit', 'Market', 'Stop-loss', 'Take-profit', 'Stop-limit', 'Take-limit'];

const splitBorder = 449;
const defaultWidth = 635;

export class Order extends React.Component<OrderComponentProps, State> {
    public state = {
        index: 0,
        amountSell: '',
        amountBuy: '',
    };

    public componentDidMount() {
        const { defaultTabIndex } = this.props;

        if (defaultTabIndex !== undefined) {
            this.handleChangeTab(defaultTabIndex);
        }
    }

    public render() {
        const { width = defaultWidth } = this.props;

        if (width < splitBorder) {
            return (
                <div className="cr-order">
                    <TabPanel
                        fixed={true}
                        panels={this.getPanels()}
                        onTabChange={this.handleChangeTab}
                        currentTabIndex={this.state.index}
                    />
                </div>
            );
        }

        return (
            <div className="cr-order cr-order--extended">
                <div className="cr-order--extended__buy">
                    <TabPanel
                        fixed={true}
                        panels={[this.getPanel('buy')]}
                        onTabChange={this.handleChangeTab}
                        currentTabIndex={this.state.index}
                    />
                </div>
                <div className="cr-order--extended__sell">
                    <TabPanel
                        fixed={true}
                        panels={[this.getPanel('sell')]}
                        onTabChange={this.handleChangeTab}
                        currentTabIndex={this.state.index}
                    />
                </div>
            </div>
        );
    }

    public getPanel = (type: FormType) => {
        const {
            marketId,
            availableBase,
            availableQuote,
            disabled,
            priceMarketBuy,
            priceMarketSell,
            priceLimit,
            trigger,
            from,
            to,
            currentMarketAskPrecision,
            currentMarketBidPrecision,
            asks,
            bids,
            currentMarketFilters,
            isMobileDevice,
            listenInputPrice,
            listenInputTrigger,
            translate,
        } = this.props;
        const { amountSell, amountBuy } = this.state;

        const proposals = this.isTypeSell(type) ? bids : asks;
        const available = this.isTypeSell(type) ? availableBase : availableQuote;
        const priceMarket = this.isTypeSell(type) ? priceMarketSell : priceMarketBuy;
        const disabledData = this.isTypeSell(type) ? {} : { disabled };
        const amount = this.isTypeSell(type) ? amountSell : amountBuy;
        const preLabel = this.isTypeSell(type)
            ? translate('page.body.trade.header.newOrder.content.tabs.sell')
            : translate('page.body.trade.header.newOrder.content.tabs.buy');
        const label = this.isTypeSell(type) ? 'Sell' : 'Buy';

        return {
            content: (
                <OrderForm
                    marketId={marketId}
                    type={type}
                    from={from}
                    {...disabledData}
                    to={to}
                    available={available}
                    priceMarket={priceMarket}
                    priceLimit={priceLimit}
                    trigger={trigger}
                    onSubmit={this.props.onSubmit}
                    orderTypes={this.getOrderTypes()}
                    orderTypesIndex={this.getOrderTypes()}
                    currentMarketAskPrecision={currentMarketAskPrecision}
                    currentMarketBidPrecision={currentMarketBidPrecision}
                    totalPrice={getTotalPrice(amount, priceMarket, proposals)}
                    amount={amount}
                    bestAsk={this.bestOBPrice(asks)}
                    bestBid={this.bestOBPrice(bids)}
                    listenInputPrice={listenInputPrice}
                    listenInputTrigger={listenInputTrigger}
                    handleAmountChange={this.handleAmountChange}
                    handleChangeAmountByButton={this.handleChangeAmountByButton}
                    currentMarketFilters={currentMarketFilters}
                    isMobileDevice={isMobileDevice}
                    translate={translate}
                />
            ),
            label: preLabel || label,
        };
    };

    private getOrderTypes = () => {
        const { orderTypes } = this.props;

        if (orderTypes && orderTypes.length) {
            return orderTypes.sort((a, b) => (defaultOrderTypes.indexOf(a) < defaultOrderTypes.indexOf(b) ? -1 : 1));
        }

        return defaultOrderTypes;
    };

    private getPanels = () => {
        return [this.getPanel('buy'), this.getPanel('sell')];
    };

    private handleChangeTab = (index: number, label?: string) => {
        if (this.props.handleSendType && label) {
            this.props.handleSendType(index, label);
        }

        this.setState({
            index: index,
        });
    };

    private handleAmountChange = (amount, type) => {
        if (type === 'sell') {
            this.setState({ amountSell: amount });
        } else {
            this.setState({ amountBuy: amount });
        }
    };

    private handleChangeAmountByButton = (value, orderType, price, type) => {
        const { bids, asks, availableBase, availableQuote } = this.props;
        const proposals = this.isTypeSell(type) ? bids : asks;
        const available = this.isTypeSell(type) ? availableBase : availableQuote;
        let newAmount = '';

        switch (type) {
            case 'buy':
                switch (orderType) {
                    case 'Market':
                        newAmount = available
                            ? Decimal.format(
                                  getAmount(Number(available), proposals, value),
                                  this.props.currentMarketAskPrecision,
                              )
                            : '';

                        break;
                    default:
                        newAmount =
                            available && +price
                                ? Decimal.format((available / +price) * value, this.props.currentMarketAskPrecision)
                                : '';

                        break;
                }
                break;
            case 'sell':
                newAmount = available ? Decimal.format(available * value, this.props.currentMarketAskPrecision) : '';

                break;
            default:
                break;
        }

        if (type === 'sell') {
            this.setState({ amountSell: newAmount });
        } else {
            this.setState({ amountBuy: newAmount });
        }
    };

    private isTypeSell = (type: string) => type === 'sell';

    private bestOBPrice = (list: string[][]) => list[0] && list[0][0];
}
