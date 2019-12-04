import { Button, CryptoIcon, Decimal, OrderInput, PercentageButton } from '@openware/components';
import classnames from 'classnames';
import * as React from 'react';
import { OrderProps } from '../../../../components/Order';
import { getAmount, getTotalPrice } from '../../../../helpers/getTotalPrice';

// tslint:disable:no-magic-numbers jsx-no-lambda jsx-no-multiline-js
type OnSubmitCallback = (order: OrderProps) => void;
type FormType = 'buy' | 'sell';

export interface OrderFormProps {
    /**
     * Price that is applied during total order amount calculation when type is Market
     */
    priceMarket: number;
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
     * Fee amount
     */
    fee: number;
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
     * @default 'Fee'
     * Text for Available field Text.
     */
    feeText?: string;
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

export interface OrderFormState {
    orderType: string | React.ReactNode;
    amount: string;
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

const checkButtonIsDisabled = (safeAmount: number, safePrice: number, props: OrderFormProps) => {
    const invalidAmount = safeAmount <= 0;
    const invalidMarketPrice = safePrice <= 0;
    return props.disabled || !props.available || invalidAmount || invalidMarketPrice;
};

const type: FormType = 'buy';

class OrderForm extends React.Component<OrderFormProps, OrderFormState> {
    constructor(props: OrderFormProps) {
        super(props);
        this.state = {
            orderType: 'Market',
            amount: '',
            priceMarket: this.props.priceMarket,
            currentMarketAskPrecision: this.props.currentMarketAskPrecision || 6,
            currentMarketBidPrecision: this.props.currentMarketBidPrecision || 6,
            priceFocused: false,
            amountFocused: false,
        };
    }

    public componentWillReceiveProps(next: OrderFormProps) {
        this.setState({
            priceMarket: next.priceMarket,
            currentMarketAskPrecision: next.currentMarketAskPrecision,
            currentMarketBidPrecision: next.currentMarketBidPrecision,
        });
    }

    public render() {
        const {
            className,
            from,
            to,
            available,
            priceText,
            amountText,
            totalText,
            availableText,
            submitButtonText,
            proposals,
            feeText,
            fee,
        } = this.props;
        const {
            amount,
            priceMarket,
            currentMarketAskPrecision,
            currentMarketBidPrecision,
            amountFocused,
        } = this.state;
        const safeAmount = Number(amount) || 0;
        const totalPrice = getTotalPrice(amount, proposals);
        const commission = +Decimal.format(+amount * fee, currentMarketAskPrecision);

        const amountPercentageArray = [0.25, 0.5, 0.75, 1];

        const cx = classnames('cr-order-form', className);
        const currencyCodeFrom = `${from.toUpperCase()}-alt`;

        return (
            <div className={cx}>
                <div className="cr-order-item">
                    <div className="cr-order-input">
                        <fieldset className="cr-order-input__fieldset">
                            <legend className={'cr-order-input__fieldset__label'}>
                                {handleSetValue(priceText, '')}
                            </legend>
                            <div className="cr-order-input__fieldset__input">
                                <span className="cr-order-input__fieldset__input__price">{handleSetValue(Decimal.format(priceMarket, currentMarketBidPrecision), '0')}</span>
                            </div>
                        </fieldset>
                        <div className="cr-order-input__crypto-icon">
                            <CryptoIcon code={currencyCodeFrom}>{from.toUpperCase()}</CryptoIcon>
                        </div>
                    </div>
                </div>
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
                            onClick={() => this.handleChangeAmountByButton(amountPercentageArray[0])}
                        />
                        <PercentageButton
                            label={`${amountPercentageArray[1] * 100}%`}
                            onClick={() => this.handleChangeAmountByButton(amountPercentageArray[1])}
                        />
                        <PercentageButton
                            label={`${amountPercentageArray[2] * 100}%`}
                            onClick={() => this.handleChangeAmountByButton(amountPercentageArray[2])}
                        />
                        <PercentageButton
                            label={`${amountPercentageArray[3] * 100}%`}
                            onClick={() => this.handleChangeAmountByButton(amountPercentageArray[3])}
                        />
                    </div>
                </div>

                <div className="cr-order-item">
                    <div className="cr-order-item__total">
                        <label className="cr-order-item__total__label">
                            {handleSetValue(totalText, 'Total')}
                        </label>
                        <div className="cr-order-item__total__content">
                            <span className="cr-order-item__total__content__amount">
                                {Decimal.format(totalPrice, currentMarketBidPrecision, ',')}
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
                            {handleSetValue(availableText, 'Available')}
                        </label>
                        <div className="cr-order-item__available__content">
                            <span className="cr-order-item__available__content__amount">
                                {available ? Decimal.format(available, currentMarketBidPrecision, ',') : ''}
                            </span>
                            <span className="cr-order-item__available__content__currency">
                                {available ? from.toUpperCase() : ''}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="cr-order-item">
                    <div className="cr-order-item__fee">
                        <label className="cr-order-item__fee__label">
                            {handleSetValue(feeText, 'Fee')}
                        </label>
                        <div className="cr-order-item__fee__content">
                            <span className="cr-order-item__fee__content__amount">
                                {Decimal.format(commission || 0, currentMarketAskPrecision, ',')}
                            </span>
                            <span className="cr-order-item__fee__content__currency">
                                {to.toUpperCase()}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="cr-order-item">
                    <Button
                        disabled={checkButtonIsDisabled(safeAmount, priceMarket, this.props)}
                        label={submitButtonText || type}
                        noMargin={true}
                        onClick={this.handleSubmit}
                    />
                </div>
            </div>
        );
    }

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

    private handleAmountChange = (value: string) => {
        const convertedValue = cleanPositiveFloatInput(String(value));
        const condition = new RegExp(`^(?:[\\d-]*\\.?[\\d-]{0,${this.state.currentMarketAskPrecision}}|[\\d-]*\\.[\\d-])$`);
        if (convertedValue.match(condition)) {
            this.setState({
                amount: convertedValue,
            });
        }
    };

    private handleChangeAmountByButton = (value: number) => {
        this.setState({
            amount: this.props.available ? (
                Decimal.format(getAmount(Number(this.props.available), this.props.proposals, value), this.state.currentMarketAskPrecision)
            ) : '',
        });
    };

    private handleSubmit = () => {
        const { available } = this.props;
        const { amount, priceMarket, orderType } = this.state;

        const order = {
            type,
            orderType,
            amount,
            price: priceMarket,
            available: available || 0,
        };

        this.props.onSubmit(order);
        this.setState({
            amount: '',
        });
    };
}


export {
    OrderForm,
};
