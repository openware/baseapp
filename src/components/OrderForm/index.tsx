import classnames from 'classnames';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import { cleanPositiveFloatInput, countSigDigits } from '../../helpers';
import { Market } from '../../modules';
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
     * Amount of money in a wallet
     */
    available?: number;
    /**
     * Whether order is disabled to execute
     */
    disabled?: boolean;
    /**
     * Callback that is called when form is submitted
     */
    onSubmit: OnSubmitCallback;
    /**
     * @default type.toUpperCase()
     * Text for submit Button.
     */
    submitButtonText?: string;
    /**
     * start handling change price
     */
    listenInputPrice?: () => void;
    totalPrice: number;
    amount: string;
    currentMarket: Market;
    translate: (id: string, values?: any) => string;
    handleAmountChange: (amount: string, type: FormType) => void;
    handleChangeAmountByButton: (value: number, orderType: string | React.ReactNode, price: string, type: string) => void;
}

interface FilterPrice {
    valid: boolean;
    priceStep: number;
}

interface OrderFormState {
    orderType: string | React.ReactNode;
    price: string;
    priceMarket: number;
    amountFocused: boolean;
    priceFocused: boolean;
}

const handleSetValue = (value: string | number | undefined, defaultValue: string) => (
    value || defaultValue
);

const getFinexFilter = (type: string, currentMarket: Market) => {
    if (currentMarket.filters) {
        const currentFilter = currentMarket.filters.find(item => item.type === type);

        if (currentFilter) {
            if (type === 'significant_digits') {
                return currentFilter.digits;
            }

            if (type === 'custom_price_steps') {
                return currentFilter.rules;
            }
        }
    }

    return false;
};

const countDecimals = value => {
    if (Math.floor(value) === value) { return 0; }
    const decimalPart = value.toString().split('.')[1];

    return decimalPart ? decimalPart.length : 0;
};

export class OrderForm extends React.PureComponent<OrderFormProps, OrderFormState> {
    constructor(props: OrderFormProps) {
        super(props);
        this.state = {
            orderType: 'Limit',
            price: '',
            priceMarket: this.props.priceMarket,
            priceFocused: false,
            amountFocused: false,
        };
    }

    public componentWillReceiveProps(next: OrderFormProps) {
        const { currentMarket } = this.props;
        const nextPriceLimitTruncated = Decimal.format(next.priceLimit, currentMarket.price_precision);

        if (this.state.orderType === 'Limit' && next.priceLimit && nextPriceLimitTruncated !== this.state.price) {
            this.setState({
                price: nextPriceLimitTruncated,
            });
        }

        if (this.state.priceMarket !== next.priceMarket) {
            this.setState({
                priceMarket: next.priceMarket,
            });
        }

        if (next.currentMarket && currentMarket && next.currentMarket.id !== currentMarket.id) {
            this.setState({
                price: '',
            });
        }
    }

    public render() {
        const {
            type,
            orderTypes,
            className,
            currentMarket,
            available,
            submitButtonText,
            totalPrice,
            amount,
            translate,
        } = this.props;
        const {
            orderType,
            price,
            priceMarket,
            priceFocused,
            amountFocused,
        } = this.state;
        const safeAmount = Number(amount) || 0;
        const safePrice = totalPrice / Number(amount) || priceMarket;

        const total = orderType === 'Market'
            ? totalPrice : safeAmount * (Number(price) || 0);
        const amountPercentageArray = [0.25, 0.5, 0.75, 1];

        const availablePrecision = type === 'buy' ? currentMarket.price_precision : currentMarket.amount_precision;
        const availableCurrency = type === 'buy' ? currentMarket.quote_unit : currentMarket.base_unit;
        const priceStepValidation: FilterPrice = this.handleCheckPrice(price);

        const minPriceStepTip = translate(
            'page.body.trade.header.newOrder.content.priceTip',
            { step: priceStepValidation.priceStep, currency: currentMarket.quote_unit.toUpperCase() },
        );

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
                        <OrderInput
                            currency={currentMarket.quote_unit}
                            label={translate('page.body.trade.header.newOrder.content.price')}
                            placeholder={translate('page.body.trade.header.newOrder.content.price')}
                            value={price || ''}
                            isFocused={priceFocused}
                            isWrong={!priceStepValidation.valid}
                            handleChangeValue={this.handlePriceChange}
                            handleFocusInput={e => this.handleFieldFocus('price')}
                        />
                        {priceStepValidation.priceStep ? <span className="cr-order-item__price-tip">{minPriceStepTip}</span> : null}
                    </div>
                ) : (
                    <div className="cr-order-item">
                        <div className="cr-order-input">
                            <fieldset className="cr-order-input__fieldset">
                                <legend className={'cr-order-input__fieldset__label'}>
                                    {translate('page.body.trade.header.newOrder.content.price')}
                                </legend>
                                <div className="cr-order-input__fieldset__input">
                                    &asymp;<span className="cr-order-input__fieldset__input__price">{handleSetValue(Decimal.format(safePrice, currentMarket.price_precision), '0')}</span>
                                </div>
                            </fieldset>
                            <div className="cr-order-input__crypto-icon">
                                {currentMarket.quote_unit.toUpperCase()}
                            </div>
                        </div>
                    </div>
                )}
                <div className="cr-order-item">
                    <OrderInput
                        currency={currentMarket.base_unit}
                        label={translate('page.body.trade.header.newOrder.content.amount')}
                        placeholder={translate('page.body.trade.header.newOrder.content.amount')}
                        value={amount || ''}
                        isFocused={amountFocused}
                        handleChangeValue={this.handleAmountChange}
                        handleFocusInput={e => this.handleFieldFocus('amount')}
                    />
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
                            {orderType === 'Limit' ? (
                                <span className="cr-order-item__total__content__amount">
                                    {total.toFixed(currentMarket.amount_precision + currentMarket.price_precision)}
                                </span>
                            ) : (
                                <span className="cr-order-item__total__content__amount">
                                    &asymp;{total.toFixed(currentMarket.amount_precision + currentMarket.price_precision)}
                                </span>
                            )}
                            <span className="cr-order-item__total__content__currency">
                                {currentMarket.quote_unit.toUpperCase()}
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

    private handleFieldFocus = (field: string) => {
        switch (field) {
            case 'price':
                this.setState(prev => ({
                    priceFocused: !prev.priceFocused,
                }));
                this.props.listenInputPrice && this.props.listenInputPrice();
                break;
            case 'amount':
                this.setState(prev => ({
                    amountFocused: !prev.amountFocused,
                }));
                break;
            default:
                break;
        }
    };

    private handleCheckPrice = (value: string): FilterPrice => {
        const { currentMarket } = this.props;
        const maxDigits = getFinexFilter('significant_digits', currentMarket);
        const priceSteps = getFinexFilter('custom_price_steps', currentMarket);
        let isValid = true;
        let minPriceStep = 0;

        if (typeof maxDigits !== 'boolean') {
            isValid = countSigDigits(value) <= maxDigits;
        }

        if (typeof priceSteps !== 'boolean' && isValid) {
            const nextIndex = priceSteps.findIndex(step => step && +step.limit > +value);
            const zeroIndex = priceSteps.findIndex(step => step && +step.limit === 0);
            const currentLimit = nextIndex > 0 ? (
                priceSteps[nextIndex - 1]
            ) : (
                nextIndex === 0 ? (
                    priceSteps[nextIndex]
                ) : (
                    zeroIndex ? priceSteps[zeroIndex] : null
                )
            );

            if (currentLimit) {
                const stepDecimals = countDecimals(currentLimit.step);
                isValid = stepDecimals ? +value <= +(+value).toFixed(stepDecimals) : !(+value % +currentLimit.step);
                minPriceStep = !isValid ? currentLimit.step : 0;
            }
        }

        return { valid: isValid, priceStep: minPriceStep };
    };

    private handlePriceChange = (value: string) => {
        const { currentMarket } = this.props;
        const convertedValue = cleanPositiveFloatInput(String(value));
        const condition = new RegExp(`^(?:[\\d-]*\\.?[\\d-]{0,${currentMarket.price_precision}}|[\\d-]*\\.[\\d-])$`);

        if (convertedValue.match(condition)) {
            this.setState({
                price: convertedValue,
            });
        }

        this.props.listenInputPrice && this.props.listenInputPrice();
    };

    private handleAmountChange = (value: string) => {
        const { currentMarket } = this.props;
        const convertedValue = cleanPositiveFloatInput(String(value));
        const condition = new RegExp(`^(?:[\\d-]*\\.?[\\d-]{0,${currentMarket.amount_precision}}|[\\d-]*\\.[\\d-])$`);

        if (convertedValue.match(condition)) {
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
        this.setState({
            price: '',
        }, () => {
            this.props.handleAmountChange('', this.props.type);
        });
    };

    private checkButtonIsDisabled = (): boolean => {
        const { disabled, available, amount, totalPrice } = this.props;
        const { orderType, priceMarket, price } = this.state;
        const safePrice = totalPrice / Number(amount) || priceMarket;

        const invalidAmount = Number(amount) <= 0;
        const invalidLimitPrice = Number(price) <= 0 && orderType === 'Limit';
        const invalidMarketPrice = safePrice <= 0 && orderType === 'Market';

        return disabled || !available || invalidAmount || invalidLimitPrice || invalidMarketPrice;
    };

    private handleEnterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();

            this.handleSubmit();
        }
    };
}
