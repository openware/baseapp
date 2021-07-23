import classnames from 'classnames';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { CustomInput } from '../';
import { cleanPositiveFloatInput, precisionRegExp } from '../../helpers';

interface InternalTransferInputProps {
    field: string;
    handleChangeInput: (value: string) => void;
    value?: string;
    fixed?: number;
}

export const InternalTransferInput = (props: InternalTransferInputProps) => {
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
        const inputPrimaryPattern = /[^A-Za-z0-9]+/g;

        switch (props.field) {
            case 'username':
                setInputValue(value.replace(inputPrimaryPattern, '').toLowerCase());
                props.handleChangeInput(value.replace(inputPrimaryPattern, '').toLowerCase());

                break;
            case 'uid':
                setInputValue(value.replace(inputPrimaryPattern, ''));
                props.handleChangeInput(value.replace(inputPrimaryPattern, ''));
    
                break;
            case 'amount':
                const convertedValue = cleanPositiveFloatInput(String(value));

                if (convertedValue.match(precisionRegExp(props.fixed ? props.fixed : 0))) {
                    setInputValue(convertedValue);
                    props.handleChangeInput(convertedValue);
                }

                break;
            case 'otp':
                const converted = cleanPositiveFloatInput(String(value));

                if ((value.length <= 6 && value.match(/^\d+$/)) || value === '') {
                    setInputValue(value);
                    props.handleChangeInput(value);
                }

                break;
            default:
                setInputValue(value);
                props.handleChangeInput(value);

                break;
        }
    }, [setInputValue, props]);

    return (
        <div key={props.field} className={focusedClass}>
            <div className="cr-internal-transfer__inputs-text">{translate(`page.body.internal.transfer.header.input.${props.field}`)}</div>
            <CustomInput
                type="text"
                label={translate(`page.body.internal.transfer.label.${props.field}`)}
                placeholder={inputFocused ? '' : translate(`page.body.internal.transfer.placeholder.${props.field}`)}
                defaultLabel={props.field}
                handleChangeInput={handleChange}
                inputValue={inputValue}
                handleFocusInput={() => setInputFocused(!inputFocused)}
                classNameLabel="cr-email-form__label"
                classNameInput="cr-email-form__input"
                autoFocus={props.field === 'username' || props.field === 'uid'}
                labelVisible={inputFocused}
            />
        </div>
    );
};
