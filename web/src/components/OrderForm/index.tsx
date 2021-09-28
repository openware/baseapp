import classnames from 'classnames';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import {
    FilterPrice,
    PriceValidation,
    validatePriceStep,
} from '../../filters';
import {
    AMOUNT_PERCENTAGE_ARRAY,
    ORDER_TYPES_WITH_TRIGGER,
    TRIGGER_BUY_PRICE_MULT,
    TRIGGER_BUY_PRICE_ADJUSTED_TYPES,
} from '../../constants';
import { cleanPositiveFloatInput, precisionRegExp } from '../../helpers';
import { OrderInput as OrderInputMobile } from '../../mobile/components';
import { Decimal } from '../Decimal';
import { DropdownComponent } from '../Dropdown';
import { OrderProps } from '../Order';
import { OrderInput } from '../OrderInput';
import { PercentageButton } from '../PercentageButton';
import { getTriggerSign } from 'src/containers/OpenOrders/helpers';

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
     * Price that is applied when user clicks orderbook row
     */
    trigger?: number;
    /**
     * Type of form, can be 'buy' or 'sell'
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
     * Best ask price
     */
    bestAsk?: string;
    /**
     * Best boid price
     */
    bestBid?: string;
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
    /**
     * start handling change trigger price
     */
    listenInputTrigger?: () => void;
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
    trigger: string;
    isPriceValid: PriceValidation;
    isTriggerValid: PriceValidation;
    amountFocused: boolean;
    priceFocused: boolean;
    triggerFocused: boolean;
    side: string;
}

const handleSetValue = (value: string | number | undefined, defaultValue: string) => (
    value || defaultValue
);

export class OrderForm extends React.PureComponent<OrderFormProps, OrderFormState> {
    constructor(props: OrderFormProps) {
        super(props);
        this.state = {
            side: this.props.type,
            orderType: 'Limit',
            price: '',
            priceMarket: this.props.priceMarket,
            trigger: '',
            isPriceValid: {
                valid: true,
                priceStep: 0,
            },
            isTriggerValid: {
                valid: true,
                priceStep: 0,
            },
            priceFocused: false,
            amountFocused: false,
            triggerFocused: false,
        };
    }

    public componentWillReceiveProps(next: OrderFormProps) {
        const nextPriceLimitTruncated = Decimal.format(next.priceLimit, this.props.currentMarketBidPrecision);

        if ((this.state.orderType as string).toLowerCase().includes('limit') && next.priceLimit && nextPriceLimitTruncated !== this.state.price) {
            this.handlePriceChange(nextPriceLimitTruncated);
        }

        const nextTriggerTruncated = Decimal.format(next.trigger, this.props.currentMarketBidPrecision);

        if (['Stop-loss', 'Take-profit'].includes(String(this.state.orderType)) && next.trigger && nextTriggerTruncated !== this.state.trigger) {
            this.handleTriggerChange(nextTriggerTruncated);
        }

        if (this.state.priceMarket !== next.priceMarket) {
            this.setState({
                priceMarket: next.priceMarket,
            });
        }

        if (this.props.to !== next.to || this.props.from !== next.from) {
            this.setState({ price: '', trigger: '' });
            this.props.handleAmountChange('', next.type);
        }

        if (this.props.marketId !== next.marketId) {
            this.setState({
                orderType: 'Limit',
            });
        }
    }

    public renderPrice = () => {
        const { price, priceFocused, isPriceValid } = this.state;
        const { from, isMobileDevice, currentMarketBidPrecision, translate } = this.props;

        const priceText = translate('page.body.trade.header.newOrder.content.price');
        const priceErrorClass = classnames('error-message', {
            'error-message--visible': (priceFocused || isMobileDevice) && !isPriceValid.valid,
        });

        return (
            <React.Fragment>
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
            </React.Fragment>
        );
    }

    public renderTrigger = () => {
        const { orderType, triggerFocused, trigger, isTriggerValid } = this.state;
        const { type, from, isMobileDevice, currentMarketBidPrecision, translate } = this.props;

        const triggerErrorClass = classnames('error-message', {
            'error-message--visible': (triggerFocused || isMobileDevice) && !isTriggerValid.valid,
        });
        const triggerText = translate(`page.body.trade.header.newOrder.content.triggerPrice`, { sign: getTriggerSign(String(orderType).toLowerCase(), type) });

        return (
            <React.Fragment>
                {isMobileDevice ? (
                    <OrderInputMobile
                        label={triggerText}
                        placeholder={
                            translate(
                                `page.mobile.order.trigger.placeholder.${(orderType as string).includes('Stop') ? 'stop' : 'take'}`, { currency: from ? from.toUpperCase() : '' },
                            )
                        }
                        value={trigger || ''}
                        isFocused={triggerFocused}
                        precision={currentMarketBidPrecision}
                        handleChangeValue={this.handleTriggerChange}
                        handleFocusInput={this.handleFieldFocus}
                    />
                ) : (
                    <OrderInput
                        currency={from}
                        label={triggerText}
                        placeholder={triggerText}
                        value={trigger || ''}
                        isFocused={triggerFocused}
                        isWrong={!isTriggerValid.valid}
                        handleChangeValue={this.handleTriggerChange}
                        handleFocusInput={this.handleFieldFocus}
                    />
                )}
                <div className={triggerErrorClass}>
                    {translate('page.body.trade.header.newOrder.content.filterPrice', { priceStep: isTriggerValid.priceStep })}
                </div>
            </React.Fragment>
        );
    }

    public getPriceInputs = () => {
        const { orderType, priceMarket } = this.state;
        const { from, totalPrice, amount, currentMarketBidPrecision, translate } = this.props;

        switch (orderType) {
            case 'Limit':
                return this.renderPrice();
            case 'Stop-loss':
            case 'Take-profit':
                return this.renderTrigger();
            case 'Stop-limit':
            case 'Take-limit':
                return (
                    <div className="cr-price-inputs">
                        <div className="cr-price-inputs__trigger">
                            {this.renderTrigger()}
                        </div>
                        {this.renderPrice()}
                    </div>
                );
            case 'Market':
                const safePrice = totalPrice / Number(amount) || priceMarket;
                const priceText = translate('page.body.trade.header.newOrder.content.price');

                return (
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
                );
            default:
                break;
        }
    }

    public getTotal = () => {
        const { orderType, price, trigger, side } = this.state;
        const { totalPrice, amount } = this.props;
        const safeAmount = Number(amount) || 0;

        if (orderType === 'Market') {
            return totalPrice;
        } else if ((orderType as string).toLowerCase().includes('limit')) {
            return safeAmount * (Number(price) || 0);
        } else if (side === 'buy') {
            return TRIGGER_BUY_PRICE_MULT * safeAmount * (Number(trigger) || 0);
        } else {
            return safeAmount * (Number(trigger) || 0);
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
            amount,
            isMobileDevice,
            bestBid,
            bestAsk,
            translate,
        } = this.props;
        const { orderType, amountFocused } = this.state;

        const total = this.getTotal();

        const availablePrecision = type === 'buy' ? currentMarketBidPrecision : currentMarketAskPrecision;
        const availableCurrency = type === 'buy' ? from : to;

        const amountText = this.props.translate('page.body.trade.header.newOrder.content.amount');
        const submitButtonText = translate(`page.body.trade.header.newOrder.content.tabs.${type}`);

        return (
            <div className={classnames('cr-order-form', className)} onKeyPress={this.handleEnterPress}>
                <div className="cr-order-item">
                    <div className="cr-order-item__dropdown__label">
                        {translate('page.body.trade.header.newOrder.content.orderType')}
                    </div>
                    <DropdownComponent list={orderTypes} onSelect={this.handleOrderTypeChange} placeholder={orderType as string}/>
                </div>
                <div className="cr-order-item">
                    {this.getPriceInputs()}
                </div>
                <div className="cr-order-item">
                    {!isMobileDevice && (bestBid || bestAsk) ? (
                            <div className="cr-order-item__prices">
                                {bestBid ? (
                                    <span className="bids">
                                        &#x25B2; {Decimal.format(bestBid, currentMarketBidPrecision, ',')}
                                    </span>
                                ) : null}
                                {bestAsk ? (
                                    <span className="asks">
                                        &#x25BC; {Decimal.format(bestAsk, currentMarketBidPrecision, ',')}
                                    </span>
                                ) : null}
                            </div>
                    ) : null}
                </div>
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
                            AMOUNT_PERCENTAGE_ARRAY.map((value, index) => <PercentageButton
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

    private handleFieldFocus = (field?: string) => {
        const { orderType } = this.state;
        const { type, translate } = this.props;

        const priceText = translate('page.body.trade.header.newOrder.content.price');
        const amountText = translate('page.body.trade.header.newOrder.content.amount');
        const triggerText = translate(`page.body.trade.header.newOrder.content.triggerPrice`, { sign: getTriggerSign(String(orderType).toLowerCase(), type) });

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
            case triggerText:
                this.setState(prev => ({
                    triggerFocused: !prev.triggerFocused,
                }));
                this.props.listenInputTrigger && this.props.listenInputTrigger();
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

    private handleTriggerChange = (value: string) => {
        const { currentMarketBidPrecision, currentMarketFilters } = this.props;
        const convertedValue = cleanPositiveFloatInput(String(value));

        if (convertedValue.match(precisionRegExp(currentMarketBidPrecision))) {
            this.setState({
                trigger: convertedValue,
                isTriggerValid: validatePriceStep(convertedValue, currentMarketFilters),
            });
        }

        this.props.listenInputTrigger && this.props.listenInputTrigger();
    };

    private handleAmountChange = (value: string) => {
        const { currentMarketAskPrecision } = this.props;
        const convertedValue = cleanPositiveFloatInput(String(value));

        if (convertedValue.match(precisionRegExp(currentMarketAskPrecision))) {
            this.props.handleAmountChange(convertedValue, this.props.type);
        }
    };

    private handleChangeAmountByButton = (value: number) => {
        const { orderType, price, trigger, side } = this.state;
        const ordType = (orderType as string).toLowerCase()

        let priceToUse = ordType.includes('limit') || orderType === 'Market' ? price : trigger;

        if (side === 'buy' && TRIGGER_BUY_PRICE_ADJUSTED_TYPES.includes(ordType)) {
            priceToUse = (Number(priceToUse) * TRIGGER_BUY_PRICE_MULT).toString()
        }

        this.props.handleChangeAmountByButton(value, orderType, priceToUse, this.props.type);
    };

    private handleSubmit = () => {
        const { available, type, amount } = this.props;
        const { price, priceMarket, orderType, trigger } = this.state;

        const order = {
            type,
            orderType,
            amount,
            available: available || 0,
            ...((orderType as string).toLowerCase().includes('limit') && { price: orderType === 'Market' ? priceMarket : price }),
            ...(ORDER_TYPES_WITH_TRIGGER.includes(orderType as string) && { trigger }),
        };

        this.props.onSubmit(order);
        this.handlePriceChange('');
        this.handleTriggerChange('');
        this.props.handleAmountChange('', this.props.type);
    };

    private checkButtonIsDisabled = (): boolean => {
        const { disabled, available, amount, totalPrice } = this.props;
        const { isPriceValid, orderType, priceMarket, price, trigger, isTriggerValid } = this.state;
        const safePrice = totalPrice / Number(amount) || priceMarket;

        const invalidAmount = Number(amount) <= 0;
        const invalidLimitPrice = (orderType as string).toLowerCase().includes('limit') && (Number(price) <= 0 || !isPriceValid.valid);
        const invalidTriggerPrice = ORDER_TYPES_WITH_TRIGGER.includes(orderType as string) && (Number(trigger) <= 0 || !isTriggerValid.valid);
        const invalidMarketPrice = safePrice <= 0 && orderType === 'Market';

        return disabled || !available || invalidAmount || invalidLimitPrice || invalidMarketPrice || invalidTriggerPrice;
    };

    private handleEnterPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();

            this.handleSubmit();
        }
    };
}
