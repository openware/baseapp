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
    isDisabled?: boolean;
}

export const QuickExchangeForm = (props: QuickExchangeFormProps) => {
    const { formatMessage } = useIntl();

    const [inputFocused, setInputFocused] = useState(false);

    const translate = useCallback((id: string) => formatMessage({ id: id }), [formatMessage]);

    const focusedClass = useMemo(() => classnames('cr-email-form__group', {
        'cr-email-form__group--focused': inputFocused,
        'cr-email-form__group--amount': props.field === 'amount',
    }), [inputFocused, props.field]);

    useEffect(() => {
        if (typeof props.value !== 'undefined') {
            props.handleChangeInput(props.value);
        }
    }, [props.value]);

    const handleChange = useCallback((value: string) => {
        const convertedValue = cleanPositiveFloatInput(value);

        props.handleChangeInput(convertedValue);
    }, [props]);

    return (
        <div key={props.field} className={focusedClass}>
            <CustomInput
                type="text"
                label={translate(`page.body.quick.exchange.label.${props.field}`)}
                placeholder={inputFocused ? '' : translate(`page.body.quick.exchange.placeholder.${props.field}`)}
                defaultLabel={props.field}
                handleChangeInput={handleChange}
                inputValue={props.value}
                handleFocusInput={() => setInputFocused(!inputFocused)}
                classNameLabel="cr-email-form__label"
                classNameInput="cr-email-form__input"
                isDisabled={props.isDisabled}
                labelVisible={inputFocused}
            />
        </div>
    );
};
