import cr from 'classnames';
import * as React from 'react';
import { CryptoIcon} from '../CryptoIcon';
import { Input } from '@openware/components';

export interface OrderInputProps {
    /**
     * Additional class name for styling. By default element receives `cr-input-block` class
     * @default empty
     */
    className?: string;
    /**
     * Code of cryptocurrency
     * @default empty
     */
    currency: string;
    /**
     * Checking if input focused
     */
    isFocused: boolean;
    /**
     * Label on the border
     */
    label?: string;
    /**
     * Placeholder on the border
     */
    placeholder?: string;
    /**
     * Value of Input component
     */
    value: string | number;
    /**
     * Function for getting value of input
     * @default empty
     */
    handleChangeValue: (text: string) => void;
    /**
     * Function for handling input focus
     */
    handleFocusInput: () => void;
    /**
     * Function for handling 'Enter' key
     */
    onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

/**
 * Input with cryptocurrency icon and label.
 */
export const OrderInput: React.FunctionComponent<OrderInputProps> = (props: OrderInputProps) => {
    const { currency, className, isFocused, label, placeholder, value, handleChangeValue, handleFocusInput, onKeyPress } = props;
    const cx = cr('cr-order-input', className);
    const currencyCode = `${currency.toUpperCase()}-alt`;

    const fieldsetFocusedClass = cr('cr-order-input__fieldset', {
        'cr-order-input__fieldset cr-order-input__fieldset--focused': isFocused,
    });

    return (
        <div className={cx}>
            <fieldset className={fieldsetFocusedClass}>
                {value && label ? (
                        <legend className={'cr-order-input__fieldset__label'}>
                            {label}
                        </legend>
                    ) :
                null}
                <Input
                    type="text"
                    value={value}
                    placeholder={placeholder ? placeholder : '0'}
                    className="cr-order-input__fieldset__input"
                    onChangeValue={handleChangeValue}
                    onFocus={handleFocusInput}
                    onBlur={handleFocusInput}
                    onKeyPress={onKeyPress}
                />
            </fieldset>
            <div className="cr-order-input__crypto-icon">
                <CryptoIcon code={currencyCode}>{currency.toUpperCase()}</CryptoIcon>
            </div>
        </div>
    );
};
