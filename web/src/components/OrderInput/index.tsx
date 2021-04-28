import cr from 'classnames';
import * as React from 'react';
import { CustomInput } from '../../components';

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
     * Display label
     */
    labelVisible?: boolean;
    /**
     * Placeholder on the border
     */
    placeholder?: string;
    /**
     * Auto focus of field
     */
    autoFocus?: boolean;
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
    /**
     * Show/Hide ALL button
     */
    showAllButton?: boolean;
    /**
     * Display text for ALL button
     */
    allButtonText?: string;
    /**
     * Function for handling click ALL button
     */
    handleClickAllButton?: () => void;
}

/**
 * Input with cryptocurrency icon and label.
 */

export const OrderInput: React.FunctionComponent<OrderInputProps> = React.memo((props: OrderInputProps) => {
    const {
        allButtonText,
        autoFocus,
        className,
        currency,
        handleChangeValue,
        handleFocusInput,
        handleClickAllButton
        isFocused,
        label,
        labelVisible,
        onKeyPress,
        placeholder,
        showAllButton,
        value,
    } = props;

    const fieldsetFocusedClass = React.useMemo(() => cr('cr-order-input__fieldset', {
        'cr-order-input__fieldset cr-order-input__fieldset--focused': isFocused,
    }), [isFocused]);

    const cryptoIconClass = React.useMemo(() => cr('cr-order-input__crypto-icon',{
        'cr-order-input__fieldset--focused': isFocused,
    }), [isFocused]);

    return (
        <div className={cr('cr-order-input', className)}>
            <fieldset className={fieldsetFocusedClass}>
                <CustomInput
                    type="number"
                    inputValue={value}
                    placeholder={placeholder || '0'}
                    handleChangeInput={handleChangeValue}
                    label={(value || labelVisible) && label ? label : ''}
                    labelVisible={labelVisible}
                    defaultLabel={(value || labelVisible) && label ? label : ''}
                    onKeyPress={onKeyPress}
                    handleFocusInput={() => handleFocusInput(props.label)}
                    autoFocus={autoFocus}
                />
            </fieldset>
            <div className={cryptoIconClass}>
                { showAllButton && <span className="cr-order-input__crypto-icon-all" onClick={handleClickAllButton}>{allButtonText}</span> }
                {currency.toUpperCase()}
            </div>
        </div>
    );
});
