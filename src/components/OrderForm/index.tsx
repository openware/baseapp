import classnames from 'classnames';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { AMOUNT_PERCENTAGE_ARRAY, DEFAULT_ORDER_TYPES } from '../../constants';
import { cleanPositiveFloatInput, precisionRegExp } from '../../helpers';
import { Decimal } from '../Decimal';
import { DropdownComponent } from '../Dropdown';
import { OrderProps } from '../Order';
import { OrderInput } from '../OrderInput';
import { PercentageButton } from '../PercentageButton';

type OnSubmitCallback = (order: OrderProps) => void;
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
    listenInputPrice?: () => void;
    totalPrice: number;
    amount: string;
    handleAmountChange: (amount: string, type: FormType) => void;
    handleChangeAmountByButton: (value: number, orderType: string | React.ReactNode, price: string, type: string) => void;
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

export const OrderFormComponent = (props: OrderFormProps) => {
    const { formatMessage } = useIntl();

    const [orderType, setOrderType] = React.useState<OrderFormState['orderType']>('Limit');
    const [price, setPrice] = React.useState<OrderFormState['price']>('');
    const [priceMarket, setPriceMarket] = React.useState<OrderFormState['priceMarket']>(props.priceMarket);
    const [priceFocused, setPriceFocused] = React.useState<OrderFormState['amountFocused']>(false);
    const [amountFocused, setAmountFocused] = React.useState<OrderFormState['priceFocused']>(false);

    const orderTypes = React.useMemo(() => [
        formatMessage({ id: 'page.body.trade.header.newOrder.content.orderType.limit' }),
        formatMessage({ id: 'page.body.trade.header.newOrder.content.orderType.market' }),
    ], [formatMessage]);

    const {
        type,
        className,
        from,
        to,
        available,
        currentMarketAskPrecision,
        currentMarketBidPrecision,
        handleChangeAmountByButton,
        handleAmountChange,
        listenInputPrice,
        totalPrice,
        amount,
        onSubmit,
        disabled,
    } = props;

    const safePrice = React.useMemo(() => totalPrice / Number(amount) || priceMarket, [totalPrice, amount, priceMarket]);
    const priceText = React.useMemo(() => formatMessage({ id: 'page.body.trade.header.newOrder.content.price' }), [formatMessage]);
    const amountText = React.useMemo(() => formatMessage({ id: 'page.body.trade.header.newOrder.content.amount' }), [formatMessage]);

    const total = React.useMemo(() => (orderType === 'Market'
        ? totalPrice : (Number(amount) || 0) * (Number(price) || 0)), [orderType, price, totalPrice, amount]);

    const availablePrecision = type === 'buy' ? currentMarketBidPrecision : currentMarketAskPrecision;
    const availableCurrency = type === 'buy' ? from : to;

    const handleFieldFocus = React.useCallback((field: string | undefined) => {
        switch (field) {
            case priceText:
                setPriceFocused(prev => !prev);
                listenInputPrice && listenInputPrice();
                break;
            case amountText:
                setAmountFocused(prev => !prev);
                break;
            default:
                break;
        }
    }, [amountText, listenInputPrice, priceText]);

    const handlePriceChange = React.useCallback((value: string) => {
        const convertedValue = cleanPositiveFloatInput(String(value));

        if (convertedValue.match(precisionRegExp(currentMarketBidPrecision))) {
            setPrice(convertedValue);
        }

        listenInputPrice && listenInputPrice();
    }, [currentMarketBidPrecision, listenInputPrice]);

    const changeAmount = React.useCallback((value: string) => {
        const convertedValue = cleanPositiveFloatInput(String(value));

        if (convertedValue.match(precisionRegExp(currentMarketAskPrecision))) {
            handleAmountChange(convertedValue, type);
        }
    }, [currentMarketAskPrecision, handleAmountChange, type]);

    const changeAmountByButton = React.useCallback((value: number) => {
        handleChangeAmountByButton(value, orderType, price, type);
    }, [orderType, price, type, handleChangeAmountByButton]);

    const handleSubmit = React.useCallback(() => {
        const order = {
            type,
            orderType,
            amount,
            price: orderType === 'Market' ? priceMarket : price,
            available: available || 0,
        };

        onSubmit(order);
        setPrice('');
        handleAmountChange('', type);
    }, [amount, available, price, priceMarket, type, orderType, onSubmit, handleAmountChange]);

    const checkButtonIsDisabled = React.useCallback((): boolean => {
        const invalidAmount = Number(amount) <= 0;
        const invalidLimitPrice = Number(price) <= 0 && orderType === 'Limit';
        const invalidMarketPrice = safePrice <= 0 && orderType === 'Market';

        return disabled || !available || invalidAmount || invalidLimitPrice || invalidMarketPrice;
    }, [amount, available, orderType, price, disabled, safePrice]);

    const handleEnterPress = React.useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();

            handleSubmit();
        }
    }, [handleSubmit]);

    React.useEffect(() => {
        const nextPriceLimitTruncated = Decimal.format(props.priceLimit, props.currentMarketBidPrecision);
        if (orderType === 'Limit' && props.priceLimit && nextPriceLimitTruncated !== price) {
            setPrice(nextPriceLimitTruncated);
        }

        if (priceMarket !== props.priceMarket) {
            setPriceMarket(props.priceMarket);
        }
    }, [props.priceLimit, props.priceMarket, props.currentMarketBidPrecision, orderType, priceMarket, price]);

    return (
        <div className={classnames('cr-order-form', className)} onKeyPress={handleEnterPress}>
            <div className="cr-order-item">
                <div className="cr-order-item__dropdown__label">{formatMessage({ id: 'page.body.trade.header.newOrder.content.orderType' })}</div>
                <DropdownComponent list={orderTypes} onSelect={index => setOrderType(DEFAULT_ORDER_TYPES[index] as string)} placeholder=""/>
            </div>
            {orderType === 'Limit' ? (
                <div className="cr-order-item">
                    <OrderInput
                        currency={from}
                        label={priceText}
                        placeholder={priceText}
                        value={price || ''}
                        isFocused={priceFocused}
                        handleChangeValue={handlePriceChange}
                        handleFocusInput={handleFieldFocus}
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
                    value={amount || ''}
                    isFocused={amountFocused}
                    handleChangeValue={changeAmount}
                    handleFocusInput={handleFieldFocus}
                />
            </div>

            <div className="cr-order-item">
                <div className="cr-order-item__percentage-buttons">
                    {
                        AMOUNT_PERCENTAGE_ARRAY.map((value, index) => <PercentageButton
                            value={value}
                            key={index}
                            onClick={changeAmountByButton}
                        />)
                    }
                </div>
            </div>

            <div className="cr-order-item">
                <div className="cr-order-item__total">
                    <label className="cr-order-item__total__label">
                        {handleSetValue(formatMessage({ id: 'page.body.trade.header.newOrder.content.total' }), 'Total')}
                    </label>
                    <div className="cr-order-item__total__content">
                        {orderType === 'Limit' ? (
                            <span className="cr-order-item__total__content__amount">
                                    {total.toFixed(currentMarketAskPrecision + currentMarketBidPrecision)}
                                </span>
                        ) : (
                            <span className="cr-order-item__total__content__amount">
                                    &asymp;{total.toFixed(currentMarketAskPrecision + currentMarketBidPrecision)}
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
                        {handleSetValue(formatMessage({ id: 'page.body.trade.header.newOrder.content.available' }), 'Available')}
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
                    disabled={checkButtonIsDisabled()}
                    onClick={handleSubmit}
                    size="lg"
                    variant={type === 'buy' ? 'success' : 'danger'}
                >
                    {formatMessage({ id: `page.body.trade.header.newOrder.content.tabs.${type}` })}
                </Button>
            </div>
        </div>
    );
};


export const OrderForm = React.memo(OrderFormComponent);
