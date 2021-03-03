import classnames from 'classnames';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import {
    FilterPrice,
    PriceValidation,
    validatePriceStep,
} from '../../filters';
import { cleanPositiveFloatInput, precisionRegExp } from '../../helpers';
import { OrderInput as OrderInputMobile } from '../../mobile/components';
import { Decimal } from '../Decimal';
import { DropdownComponent } from '../Dropdown';
import { OrderProps } from '../Order';
import { OrderInput } from '../OrderInput';
import { PercentageButton } from '../PercentageButton';

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
     * start handling change price
     */
    listenInputPrice?: () => void;
    totalPrice: number;
    amount: string;
    isMobileDevice?: boolean;
    currentMarketFilters: FilterPrice[];
    handleAmountChange: (amount: string, type: FormType) => void;
    handleChangeAmountByButton: (value: number, orderType: string | React.ReactNode, price: string, type: string) => void;
    translate: (id: string, value?: any) => string;
}

interface OrderFormState {
    orderType: string | React.ReactNode;
    price: string;
    priceMarket: number;
    isPriceValid: PriceValidation;
    amountFocused: boolean;
    priceFocused: boolean;
}

const handleSetValue = (value: string | number | undefined, defaultValue: string) => (
    value || defaultValue
);

export class OrderForm extends React.PureComponent<OrderFormProps, OrderFormState> {
    constructor(props: OrderFormProps) {
        super(props);
        this.state = {
            orderType: 'Limit',
            price: '',
            priceMarket: this.props.priceMarket,
            isPriceValid: {
                valid: true,
                priceStep: 0,
            },
            priceFocused: false,
            amountFocused: false,
        };
    }

    public componentWillReceiveProps(next: OrderFormProps) {
        const nextPriceLimitTruncated = Decimal.format(next.priceLimit, this.props.currentMarketBidPrecision);

        if (this.state.orderType === 'Limit' && next.priceLimit && nextPriceLimitTruncated !== this.state.price) {
            this.handlePriceChange(nextPriceLimitTruncated);
        }

        if (this.state.priceMarket !== next.priceMarket) {
            this.setState({
                priceMarket: next.priceMarket,
            });
        }

        if (this.props.to !== next.to || this.props.from !== next.from) {
            this.setState({ price: '' });
            this.props.handleAmountChange('', next.type);
        }
    }

    public render() {
        const {
            type,
            orderTypes,
            className,
            from,
            to,
            available,
            currentMarketAskPrecision,
            currentMarketBidPrecision,
            totalPrice,
            amount,
            isMobileDevice,
            translate,
        } = this.props;
        const {
            orderType,
            price,
            priceMarket,
            isPriceValid,
            priceFocused,
            amountFocused,
        } = this.state;
        const safeAmount = Number(amount) || 0;
        const safePrice = totalPrice / Number(amount) || priceMarket;

        const total = orderType === 'Market'
            ? totalPrice : safeAmount * (Number(price) || 0);
        const amountPercentageArray = [0.25, 0.5, 0.75, 1];

        const availablePrecision = type === 'buy' ? currentMarketBidPrecision : currentMarketAskPrecision;
        const availableCurrency = type === 'buy' ? from : to;

        const priceErrorClass = classnames('error-message', {
            'error-message--visible': (priceFocused || isMobileDevice) && !isPriceValid.valid,
        });

        const priceText = this.props.translate('page.body.trade.header.newOrder.content.price');
        const amountText = this.props.translate('page.body.trade.header.newOrder.content.amount');
        const submitButtonText = translate(`page.body.trade.header.newOrder.content.tabs.${type}`);

        return (
            <div className={classnames('cr-order-form', className)} onKeyPress={this.handleEnterPress}>
                <div className="cr-order-item">
                    <div className="cr-order-item__dropdown__label">
                        {translate('page.body.trade.header.newOrder.content.orderType')}
                    </div>
                    <DropdownComponent list={orderTypes} onSelect={this.handleOrderTypeChange} placeholder=""/>
                </div>
                {orderType === 'Limit' ? (
                    <div className="cr-order-item">
                        {isMobileDevice ? (
                            <OrderInputMobile
                                label={priceText}
                                placeholder={translate('page.mobile.order.price.placeholder', { currency: from ? from.toUpperCase() : '' })}
                                value={price || ''}
                                isFocused={priceFocused}
                                precision={currentMarketBidPrecision}
                                handleChangeValue={this.handlePriceChange}
                                handleFocusInput={this.handleFieldFocus}
                            />
                        ) : (
                            <OrderInput
                                currency={from}
                                label={priceText}
                                placeholder={priceText}
                                value={price || ''}
                                isFocused={priceFocused}
                                isWrong={!isPriceValid.valid}
                                handleChangeValue={this.handlePriceChange}
                                handleFocusInput={this.handleFieldFocus}
                            />
                        )}
                        <div className={priceErrorClass}>
                            {translate('page.body.trade.header.newOrder.content.filterPrice', { priceStep: isPriceValid.priceStep })}
                        </div>
                    </div>
                ) : (
                    <div className="cr-order-item">
                        <div className="cr-order-input">
                            <fieldset className="cr-order-input__fieldset">
                                <legend className={'cr-order-input__fieldset__label'}>
                                    {priceText}
                                </legend>
                                <div className="cr-order-input__fieldset__input">
                                    &asymp;<span className="cr-order-input__fieldset__input__price">
                                        {handleSetValue(Decimal.format(safePrice, currentMarketBidPrecision, ','), '0')}
                                    </span>
                                </div>
                            </fieldset>
                            <div className="cr-order-input__crypto-icon">
                                {from.toUpperCase()}
                            </div>
                        </div>
                    </div>
                )}
                <div className="cr-order-item">
                    {isMobileDevice ? (
                        <OrderInputMobile
                            label={amountText}
                            placeholder={translate('page.mobile.order.amount.placeholder', { currency: to ? to.toUpperCase() : '' })}
                            value={amount || ''}
                            isFocused={amountFocused}
                            precision={currentMarketAskPrecision}
                            handleChangeValue={this.handleAmountChange}
                            handleFocusInput={this.handleFieldFocus}
                        />
                    ) : (
                        <OrderInput
                            currency={to}
                            label={amountText}
                            placeholder={amountText}
                            value={amount || ''}
                            isFocused={amountFocused}
                            handleChangeValue={this.handleAmountChange}
                            handleFocusInput={this.handleFieldFocus}
                        />
                    )}
                </div>

                <div className="cr-order-item">
                    <div className="cr-order-item__percentage-buttons">
                        {
                            amountPercentageArray.map((value, index) => <PercentageButton
                                value={value}
                                key={index}
                                onClick={this.handleChangeAmountByButton}
                            />)
                        }
                    </div>
                </div>

                <div className="cr-order-item">
                    <div className="cr-order-item__total">
                        <label className="cr-order-item__total__label">
                            {translate('page.body.trade.header.newOrder.content.total')}
                        </label>
                        <div className="cr-order-item__total__content">
                            <span className="cr-order-item__total__content__amount">
                                {orderType === 'Market' ? <span>&asymp;</span> : null}
                                {Decimal.format(total, currentMarketAskPrecision + currentMarketBidPrecision, ',')}
                            </span>
                            <span className="cr-order-item__total__content__currency">
                                {from.toUpperCase()}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="cr-order-item">
                    <div className="cr-order-item__available">
                        <label className="cr-order-item__available__label">
                            {translate('page.body.trade.header.newOrder.content.available')}
                        </label>
                        <div className="cr-order-item__available__content">
                            <span className="cr-order-item__available__content__amount">
                                {available ? Decimal.format(available, availablePrecision, ',') : ''}
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
                        disabled={this.checkButtonIsDisabled()}
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
        const priceText = this.props.translate('page.body.trade.header.newOrder.content.price');
        const amountText = this.props.translate('page.body.trade.header.newOrder.content.amount');

        switch (field) {
            case priceText:
                this.setState(prev => ({
                    priceFocused: !prev.priceFocused,
                }));
                this.props.listenInputPrice && this.props.listenInputPrice();
                break;
            case amountText:
                this.setState(prev => ({
                    amountFocused: !prev.amountFocused,
                }));
                break;
            default:
                break;
        }
    };

    private handlePriceChange = (value: string) => {
        const { currentMarketBidPrecision, currentMarketFilters } = this.props;
        const convertedValue = cleanPositiveFloatInput(String(value));

        if (convertedValue.match(precisionRegExp(currentMarketBidPrecision))) {
            this.setState({
                price: convertedValue,
                isPriceValid: validatePriceStep(convertedValue, currentMarketFilters),
            });
        }

        this.props.listenInputPrice && this.props.listenInputPrice();
    };

    private handleAmountChange = (value: string) => {
        const { currentMarketAskPrecision } = this.props;
        const convertedValue = cleanPositiveFloatInput(String(value));

        if (convertedValue.match(precisionRegExp(currentMarketAskPrecision))) {
            this.props.handleAmountChange(convertedValue, this.props.type);
        }
    };

    private handleChangeAmountByButton = (value: number) => {
        const { orderType, price } = this.state;

        this.props.handleChangeAmountByButton(value, orderType, price, this.props.type);
    };

    private handleSubmit = () => {
        const { available, type, amount } = this.props;
        const { price, priceMarket, orderType } = this.state;

        const order = {
            type,
            orderType,
            amount,
            price: orderType === 'Market' ? priceMarket : price,
            available: available || 0,
        };

        this.props.onSubmit(order);
        this.handlePriceChange('');
        this.props.handleAmountChange('', this.props.type);
    };

    private checkButtonIsDisabled = (): boolean => {
        const { disabled, available, amount, totalPrice } = this.props;
        const { isPriceValid, orderType, priceMarket, price } = this.state;
        const safePrice = totalPrice / Number(amount) || priceMarket;

        const invalidAmount = Number(amount) <= 0;
        const invalidLimitPrice = orderType === 'Limit' && (Number(price) <= 0 || !isPriceValid.valid);
        const invalidMarketPrice = safePrice <= 0 && orderType === 'Market';

        return disabled || !available || invalidAmount || invalidLimitPrice || invalidMarketPrice;
    };

    private handleEnterPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();

            this.handleSubmit();
        }
    };
}
