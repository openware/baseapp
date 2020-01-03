import { OrderInput } from '../OrderInput';
import { PercentageButton } from '../PercentageButton';
import classnames from 'classnames';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import { Decimal } from '../Decimal';
import { getAmount, getTotalPrice } from '../../helpers/getTotalPrice';
import { DropdownComponent } from '../Dropdown';
import { OrderProps } from '../Order';

// tslint:disable:no-magic-numbers jsx-no-lambda jsx-no-multiline-js
type OnSubmitCallback = (order: OrderProps) => void;
type DropdownElem = number | string | React.ReactNode;
type FormType = 'buy' | 'sell';

export interface OrderFormProps {
    /**
     * Price that is applied during total order amount calculation when type is Market
     */
    priceMarket: number;
    /**
     * Price that is applied during total order amount calculation when type is Market
     */
    priceLimit?: number;
    /**
     * Type of form, can be 'buy' or 'cell'
     */
    type: FormType;
    /**
     * Available types of order
     */
    orderTypes: DropdownElem[];
    /**
     * Available types of order without translations
     */
    orderTypesIndex: DropdownElem[];
    /**
     * Additional class name. By default element receives `cr-order` class
     * @default empty
     */
    className?: string;
    /**
     * Name of currency for price field
     */
    from: string;
    /**
     * Name of currency for amount field
     */
    to: string;
    /**
     * Amount of money in a wallet
     */
    available?: number;
    /**
     * Precision of amount, total, available, fee value
     */
    currentMarketAskPrecision: number;
    /**
     * Precision of price value
     */
    currentMarketBidPrecision: number;
    /**
     * Whether order is disabled to execute
     */
    disabled?: boolean;
    /**
     * Callback that is called when form is submitted
     */
    onSubmit: OnSubmitCallback;
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
     * @default type.toUpperCase()
     * Text for submit Button.
     */
    submitButtonText?: string;
    /**
     * proposal data for buy or sell [[price, volume]]
     */
    proposals: string[][];
    /**
     * start handling change price
     */
    listenInputPrice?: () => void;
}

interface OrderFormState {
    orderType: string | React.ReactNode;
    amount: string;
    price: string;
    priceMarket: number;
    currentMarketAskPrecision: number;
    currentMarketBidPrecision: number;
    amountFocused: boolean;
    priceFocused: boolean;
}

const handleSetValue = (value: string | number | undefined, defaultValue: string) => (
    value || defaultValue
);

const cleanPositiveFloatInput = (text: string) => {
    let cleanInput = text
        .replace(',', '.')
        .replace(/-+/, '')
        .replace(/^0+/, '0')
        .replace(/\.+/, '.')
        .replace(/^0+([1-9])/, '$1');

    if (cleanInput[0] === '.') {
        cleanInput = `0${cleanInput}`;
    }
    return cleanInput;
};

const checkButtonIsDisabled = (safeAmount: number, safePrice: number, price: string, props: OrderFormProps, state: OrderFormState) => {
    const invalidAmount = safeAmount <= 0;
    const invalidLimitPrice = Number(price) <= 0 && state.orderType === 'Limit';
    const invalidMarketPrice = safePrice <= 0 && state.orderType === 'Market';
    return props.disabled || !props.available || invalidAmount || invalidLimitPrice || invalidMarketPrice;
};

export class OrderForm extends React.Component<OrderFormProps, OrderFormState> {
    constructor(props: OrderFormProps) {
        super(props);
        this.state = {
            orderType: 'Limit',
            amount: '',
            price: '',
            priceMarket: this.props.priceMarket,
            currentMarketAskPrecision: this.props.currentMarketAskPrecision || 6,
            currentMarketBidPrecision: this.props.currentMarketBidPrecision || 6,
            priceFocused: false,
            amountFocused: false,
        };
    }

    public componentWillReceiveProps(next: OrderFormProps) {
        const nextPriceLimitTruncated = Decimal.format(next.priceLimit, this.state.currentMarketBidPrecision);
        if (this.state.orderType === 'Limit' && next.priceLimit && nextPriceLimitTruncated !== this.state.price) {
            this.setState({
                price: nextPriceLimitTruncated,
            });
        }

        this.setState({
            priceMarket: next.priceMarket,
            currentMarketAskPrecision: next.currentMarketAskPrecision,
            currentMarketBidPrecision: next.currentMarketBidPrecision,
        });
    }

    public render() {
        const {
            type,
            orderTypes,
            className,
            from,
            to,
            available,
            orderTypeText,
            priceText,
            amountText,
            totalText,
            availableText,
            submitButtonText,
            proposals,
        } = this.props;
        const {
            orderType,
            amount,
            price,
            priceMarket,
            currentMarketAskPrecision,
            currentMarketBidPrecision,
            priceFocused,
            amountFocused,
        } = this.state;
        const safeAmount = Number(amount) || 0;
        const totalPrice = getTotalPrice(amount, proposals);
        const safePrice = totalPrice / Number(amount) || priceMarket;

        const total = orderType === 'Market'
            ? totalPrice : safeAmount * (Number(price) || 0);
        const amountPercentageArray = [0.25, 0.5, 0.75, 1];

        const cx = classnames('cr-order-form', className);
        const availablePrecision = type === 'buy' ? currentMarketBidPrecision : currentMarketAskPrecision;
        const availableCurrency = type === 'buy' ? from : to;

        return (
            <div className={cx}>
                <div className="cr-order-item">
                    {orderTypeText ? <div className="cr-order-item__dropdown__label">{orderTypeText}</div> : null}
                    <DropdownComponent list={orderTypes} onSelect={this.handleOrderTypeChange} placeholder=""/>
                </div>
                {orderType === 'Limit' ? (
                    <div className="cr-order-item">
                        <OrderInput
                            currency={from}
                            label={priceText}
                            placeholder={priceText}
                            value={handleSetValue(price,'')}
                            isFocused={priceFocused}
                            handleChangeValue={this.handlePriceChange}
                            handleFocusInput={() => this.handleFieldFocus(priceText)}
                        />
                    </div>
                ) : (
                    <div className="cr-order-item">
                        <div className="cr-order-input">
                            <fieldset className="cr-order-input__fieldset">
                                <legend className={'cr-order-input__fieldset__label'}>
                                    {handleSetValue(priceText, '')}
                                </legend>
                                <div className="cr-order-input__fieldset__input">
                                    &asymp;<span className="cr-order-input__fieldset__input__price">{handleSetValue(Decimal.format(safePrice, currentMarketBidPrecision), '0')}</span>
                                </div>
                            </fieldset>
                            <div className="cr-order-input__crypto-icon">
                                {from.toUpperCase()}
                            </div>
                        </div>
                    </div>
                )}
                <div className="cr-order-item">
                    <OrderInput
                        currency={to}
                        label={amountText}
                        placeholder={amountText}
                        value={handleSetValue(amount, '')}
                        isFocused={amountFocused}
                        handleChangeValue={this.handleAmountChange}
                        handleFocusInput={() => this.handleFieldFocus(amountText)}
                    />
                </div>

                <div className="cr-order-item">
                    <div className="cr-order-item__percentage-buttons">
                        <PercentageButton
                            label={`${amountPercentageArray[0] * 100}%`}
                            onClick={() => this.handleChangeAmountByButton(amountPercentageArray[0], type)}
                        />
                        <PercentageButton
                            label={`${amountPercentageArray[1] * 100}%`}
                            onClick={() => this.handleChangeAmountByButton(amountPercentageArray[1], type)}
                        />
                        <PercentageButton
                            label={`${amountPercentageArray[2] * 100}%`}
                            onClick={() => this.handleChangeAmountByButton(amountPercentageArray[2], type)}
                        />
                        <PercentageButton
                            label={`${amountPercentageArray[3] * 100}%`}
                            onClick={() => this.handleChangeAmountByButton(amountPercentageArray[3], type)}
                        />
                    </div>
                </div>

                <div className="cr-order-item">
                    <div className="cr-order-item__total">
                        <label className="cr-order-item__total__label">
                            {handleSetValue(totalText, 'Total')}
                        </label>
                        <div className="cr-order-item__total__content">
                            {orderType === 'Limit' ? (
                                <span className="cr-order-item__total__content__amount">
                                    {Decimal.format(total, currentMarketBidPrecision)}
                                </span>
                            ) : (
                                <span className="cr-order-item__total__content__amount">
                                    &asymp;{Decimal.format(total, currentMarketBidPrecision)}
                                </span>
                            )}
                            <span className="cr-order-item__total__content__currency">
                                {from.toUpperCase()}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="cr-order-item">
                    <div className="cr-order-item__available">
                        <label className="cr-order-item__available__label">
                            {handleSetValue(availableText, 'Available')}
                        </label>
                        <div className="cr-order-item__available__content">
                            <span className="cr-order-item__available__content__amount">
                                {available ? Decimal.format(available, availablePrecision) : ''}
                            </span>
                            <span className="cr-order-item__available__content__currency">
                                {available ? availableCurrency.toUpperCase() : ''}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="cr-order-item">
                    <Button
                        block={true}
                        className="btn-block mr-1 mt-1 btn-lg"
                        disabled={checkButtonIsDisabled(safeAmount, safePrice, price, this.props, this.state)}
                        onClick={this.handleSubmit}
                        size="lg"
                        variant={type === 'buy' ? 'success' : 'danger'}
                    >
                        {submitButtonText || type}
                    </Button>
                </div>
            </div>
        );
    }

    private handleOrderTypeChange = (index: number) => {
        const { orderTypesIndex } = this.props;
        this.setState({
            orderType: orderTypesIndex[index],
        });
    };

    private handleFieldFocus = (field: string | undefined) => {
        switch (field) {
            case this.props.priceText:
                this.setState(prev => ({
                    priceFocused: !prev.priceFocused,
                }));
                this.props.listenInputPrice && this.props.listenInputPrice();
                break;
            case this.props.amountText:
                this.setState(prev => ({
                    amountFocused: !prev.amountFocused,
                }));
                break;
            default:
                break;
        }
    };

    private handlePriceChange = (value: string) => {
        const convertedValue = cleanPositiveFloatInput(String(value));
        const condition = new RegExp(`^(?:[\\d-]*\\.?[\\d-]{0,${this.state.currentMarketBidPrecision}}|[\\d-]*\\.[\\d-])$`);
        if (convertedValue.match(condition)) {
            this.setState({
                price: convertedValue,
            });
        }
        this.props.listenInputPrice && this.props.listenInputPrice();
    };

    private handleAmountChange = (value: string) => {
        const convertedValue = cleanPositiveFloatInput(String(value));
        const condition = new RegExp(`^(?:[\\d-]*\\.?[\\d-]{0,${this.state.currentMarketAskPrecision}}|[\\d-]*\\.[\\d-])$`);
        if (convertedValue.match(condition)) {
            this.setState({
                amount: convertedValue,
            });
        }
    };

    private handleChangeAmountByButton = (value: number, type: string) => {
        switch (type) {
            case 'buy':
                switch (this.state.orderType) {
                    case 'Limit':
                        this.setState({
                            amount: this.props.available && + this.state.price ? (
                                Decimal.format(this.props.available / +this.state.price * value, this.state.currentMarketAskPrecision)
                            ) : '',
                        });
                        break;
                    case 'Market':
                        this.setState({
                            amount: this.props.available ? (
                                Decimal.format(getAmount(Number(this.props.available), this.props.proposals, value), this.state.currentMarketAskPrecision)
                            ) : '',
                        });
                        break;
                    default:
                        break;
                }
                break;
            case 'sell':
                this.setState({
                    amount: this.props.available ? (
                        Decimal.format(this.props.available * value, this.state.currentMarketAskPrecision)
                    ) : '',
                });
                break;
            default:
                break;
        }
    };

    private handleSubmit = () => {
        const { available, type } = this.props;
        const { amount, price, priceMarket, orderType } = this.state;

        const order = {
            type,
            orderType,
            amount,
            price: orderType === 'Market' ? priceMarket : price,
            available: available || 0,
        };

        this.props.onSubmit(order);
        this.setState({
            amount: '',
            price: '',
        });
    };
}
