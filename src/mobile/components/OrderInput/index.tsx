import cr from 'classnames';
import * as React from 'react';
import { CustomInput } from '../../../components';
import { areEqualProps} from '../../../helpers/areEqualProps';

export interface OrderInputProps {
    className?: string;
    isFocused: boolean;
    isWrong?: boolean;
    label?: string;
    placeholder?: string;
    value: string | number;
    precision: number;
    handleChangeValue: (text: string) => void;
    handleFocusInput: (value?: string) => void;
    onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const OrderInput: React.FunctionComponent<OrderInputProps> = React.memo((props: OrderInputProps) => {
    const {
        className,
        handleChangeValue,
        handleFocusInput,
        isFocused,
        isWrong,
        label,
        onKeyPress,
        placeholder,
        precision,
        value,
    } = props;
    const cx = cr('cr-order-input-mobile', className);

    const fieldsetFocusedClass = cr('cr-order-input-mobile__fieldset', {
        'cr-order-input-mobile__fieldset--focused': isFocused,
        'cr-order-input-mobile__fieldset--wrong': isWrong,
    });

    const handleChangeValueByButton = (increase: boolean) => {
        let updatedValue = value;
        const increasedValue = (+updatedValue + (10 ** -precision)).toFixed(precision);
        const decreasedValue = (+updatedValue - (10 ** -precision)).toFixed(precision);

        updatedValue = increase ?
            increasedValue :
            +decreasedValue >= 0 ? decreasedValue : updatedValue;

        props.handleChangeValue(String(updatedValue));
    };

    return (
        <div className={cx}>
            <div
                className="cr-order-input-mobile__button"
                onClick={() => handleChangeValueByButton(false)}
            >-</div>
            <fieldset className={fieldsetFocusedClass}>
                <CustomInput
                    type="number"
                    inputValue={value}
                    placeholder={placeholder || '0'}
                    handleChangeInput={handleChangeValue}
                    label={value && placeholder ? placeholder : ''}
                    defaultLabel={value && placeholder ? placeholder : ''}
                    onKeyPress={onKeyPress}
                    handleFocusInput={() => handleFocusInput(label)}
                />
            </fieldset>
            <div
                className="cr-order-input-mobile__button"
                onClick={() => handleChangeValueByButton(true)}
            >+</div>
        </div>
    );
}, areEqualProps);
