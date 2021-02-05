import React, { useCallback, useState, useEffect } from 'react';
import { WrappedFieldProps, BaseFieldProps } from 'redux-form';
import { InputGroup, FormControl } from 'react-bootstrap';

import { FormLine } from '../line';

interface FormTextProps {
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    maxLength?: number;
    readOnly?: boolean;
    inputRegex?: RegExp;
    prepend?: React.ReactNode;
    append?: React.ReactNode;
}

export interface FieldFormTextProps extends BaseFieldProps<FormTextProps>, FormTextProps {}

type Props = FormTextProps & WrappedFieldProps;

export const FormText: React.SFC<Props> = ({
    input: { onChange, value: valueInput, onBlur, onFocus, ...restInput },
    // label,
    placeholder,
    meta: { error, touched, invalid },
    readOnly,
    inputRegex,
    maxLength,
    append,
    ...rest
}): React.ReactElement<Props> => {
    const [value, setValue] = useState('');
    // const [focus, setFocus] = useState(false);

    const handleChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const {
                target: { value },
            } = event;

            let callChange = false;

            if (inputRegex) {
                inputRegex.lastIndex = 0;
                if (inputRegex.test(value)) {
                    callChange = true;
                }
            } else {
                callChange = true;
            }

            if (callChange && maxLength && value && value.length > maxLength) {
                callChange = false;
            }

            if (callChange) {
                onChange(value);
            }
        },
        [inputRegex, maxLength]
    );

    const handleFocus = useCallback((event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onFocus(event);
        // setFocus(true);
    }, []);

    const handleBlur = useCallback((event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onBlur(event);
        // setFocus(false);
    }, []);

    useEffect(() => {
        setValue(valueInput || '');
    }, [valueInput]);
    // error={touched && error}

    return (
        <FormLine error={error} touched={touched} invalid={invalid}>
            <FormControl
                value={value}
                placeholder={placeholder}
                {...restInput}
                {...rest}
                readOnly={readOnly}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
            />
            {append ? (
                <InputGroup.Append>
                    <InputGroup.Text>{append}</InputGroup.Text>
                </InputGroup.Append>
            ) : null}
        </FormLine>
    );
};
