import classnames from 'classnames';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { CustomInput } from '../';
import { cleanPositiveFloatInput, precisionRegExp } from '../../helpers';

interface QuickExchangeFormProps {
    field: string;
    handleChangeInput: (value: string) => void;
    value?: string;
    fixed?: number;
}

export const QuickExchangeForm = (props: QuickExchangeFormProps) => {
    const { formatMessage } = useIntl();

    const [inputValue, setInputValue] = useState('');
    const [inputFocused, setInputFocused] = useState(false);

    const translate = useCallback((id: string) => formatMessage({ id: id }), [formatMessage]);

    const focusedClass = useMemo(() => classnames('cr-email-form__group', {
        'cr-email-form__group--focused': inputFocused,
        'cr-email-form__group--amount': props.field === 'amount',
    }), [inputFocused, props.field]);

    useEffect(() => {
        if (typeof props.value !== 'undefined') {
            setInputValue(props.value);
        }
    }, [props.value]);

    const handleChange = useCallback((value: string) => {
        const convertedValue = cleanPositiveFloatInput(String(value));

        if (convertedValue.match(precisionRegExp(props.fixed ? props.fixed : 0))) {
            setInputValue(convertedValue);
            props.handleChangeInput(convertedValue);
        }
    }, [setInputValue, props]);

    return (
        <div key={props.field} className={focusedClass}>
            <CustomInput
                type="text"
                label={translate(`page.body.quick.exchange.label.${props.field}`)}
                placeholder={translate(`page.body.quick.exchange.placeholder.${props.field}`)}
                defaultLabel={props.field}
                handleChangeInput={handleChange}
                inputValue={inputValue}
                handleFocusInput={() => setInputFocused(!inputFocused)}
                classNameLabel="cr-email-form__label"
                classNameInput="cr-email-form__input"
            />
        </div>
    );
};
