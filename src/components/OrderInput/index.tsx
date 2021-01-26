import cr from 'classnames';
import * as React from 'react';
import { CustomInput } from '../../components';
import {areEqualProps} from '../../helpers/areEqualProps';

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
     * Checking if input wrong
     */
    isWrong?: boolean;
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
    handleFocusInput: (value?: string) => void;
    /**
     * Function for handling 'Enter' key
     */
    onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

/**
 * Input with cryptocurrency icon and label.
 */

export const OrderInput: React.FunctionComponent<OrderInputProps> = React.memo((props: OrderInputProps) => {
    const {
        className,
        currency,
        handleChangeValue,
        handleFocusInput,
        isFocused,
        isWrong,
        label,
        onKeyPress,
        placeholder,
        value,
    } = props;
    const cx = cr('cr-order-input', className);

    const fieldsetFocusedClass = cr('cr-order-input__fieldset', {
        'cr-order-input__fieldset--focused': isFocused,
        'cr-order-input__fieldset--wrong': isWrong,
    });

    const cryptoIconClass = cr('cr-order-input__crypto-icon', {
        'cr-order-input__fieldset--focused': isFocused,
        'cr-order-input__fieldset--wrong': isWrong,
    });

    return (
        <div className={cx}>
            <fieldset className={fieldsetFocusedClass}>
                <CustomInput
                    type="number"
                    inputValue={value}
                    placeholder={placeholder || '0'}
                    handleChangeInput={handleChangeValue}
                    label={value && label ? label : ''}
                    defaultLabel={value && label ? label : ''}
                    onKeyPress={onKeyPress}
                    handleFocusInput={() => handleFocusInput(props.label)}
                />
            </fieldset>
            <div className={cryptoIconClass}>
                {currency.toUpperCase()}
            </div>
        </div>
    );
}, areEqualProps);
