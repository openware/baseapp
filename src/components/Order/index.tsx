import * as React from 'react';
import { TabPanel } from '../../components';
import { DEFAULT_CCY_PRECISION } from '../../constants';
import { getAmount, getTotalPrice } from '../../helpers';
import { Market } from '../../modules';
import { Decimal, OrderForm } from '../index';

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
     * Whether order is disabled to execute
     */
    disabled?: boolean;
    handleSendType?: (index: number, label: string) => void;
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
    currentMarket: Market;
    translate: (id: string, values?: any) => string;
}
interface State {
    index: number;
    amountSell: string;
    amountBuy: string;
}

const defaultOrderTypes: DropdownElem[] = [
    'Limit',
    'Market',
];

const splitBorder = 449;
const defaultWidth = 635;

export class Order extends React.Component<OrderComponentProps, State> {
    public state = {
        index: 0,
        amountSell: '',
        amountBuy: '',
    };

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
            availableBase,
            availableQuote,
            currentMarket,
            disabled,
            priceMarketBuy,
            priceMarketSell,
            priceLimit,
            orderTypes,
            orderTypesIndex,
            asks,
            bids,
            listenInputPrice,
            translate,
        } = this.props;
        const { amountSell, amountBuy } = this.state;

        const proposals = this.isTypeSell(type) ? bids : asks;
        const available = this.isTypeSell(type) ? availableBase : availableQuote;
        const priceMarket = this.isTypeSell(type) ? priceMarketSell : priceMarketBuy;
        const submitButtonText = this.isTypeSell(type) ?
            translate('page.body.trade.header.newOrder.content.tabs.sell') :
            translate('page.body.trade.header.newOrder.content.tabs.buy');
        const preLabel = this.isTypeSell(type) ?
            translate('page.body.trade.header.newOrder.content.tabs.sell') :
            translate('page.body.trade.header.newOrder.content.tabs.buy');
        const label = this.isTypeSell(type) ? 'Sell' : 'Buy';
        const disabledData = this.isTypeSell(type) ? {} : { disabled };
        const amount = this.isTypeSell(type) ? amountSell : amountBuy;

        return {
            content: (
                <OrderForm
                    type={type}
                    {...disabledData}
                    available={available}
                    currentMarket={currentMarket}
                    priceMarket={priceMarket}
                    priceLimit={priceLimit}
                    onSubmit={this.props.onSubmit}
                    orderTypes={orderTypes || defaultOrderTypes}
                    orderTypesIndex={orderTypesIndex || defaultOrderTypes}
                    submitButtonText={submitButtonText}
                    totalPrice={getTotalPrice(amount, proposals)}
                    amount={amount}
                    listenInputPrice={listenInputPrice}
                    handleAmountChange={this.handleAmountChange}
                    handleChangeAmountByButton={this.handleChangeAmountByButton}
                    translate={translate}
                />
            ),
            label: preLabel || label,
        };
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
        const {
            asks,
            availableBase,
            availableQuote,
            bids,
            currentMarket,
        } = this.props;
        const proposals = this.isTypeSell(type) ? bids : asks;
        const available = this.isTypeSell(type) ? availableBase : availableQuote;
        const currentMarketAskPrecision = currentMarket.amount_precision || DEFAULT_CCY_PRECISION;
        let newAmount = '';

        switch (type) {
            case 'buy':
                switch (orderType) {
                    case 'Limit':
                        newAmount = available && +price ? (
                            Decimal.format(available / +price * value, currentMarketAskPrecision)
                        ) : '';

                        break;
                    case 'Market':
                        newAmount = available ? (
                            Decimal.format(getAmount(Number(available), proposals, value), currentMarketAskPrecision)
                        ) : '';

                        break;
                    default:
                        break;
                }
                break;
            case 'sell':
                newAmount = available ? (
                    Decimal.format(available * value, currentMarketAskPrecision)
                ) : '';

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
}
