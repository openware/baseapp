import {
    Button,
    Input,
    Loader,
} from '@openware/components';
import cr from 'classnames';
import * as React from 'react';
import {
    EMAIL_REGEX,
} from '../../helpers';

interface EmailFormProps {
    title?: string;
    buttonLabel?: string;
    errorMessage?: string;
    isLoading?: boolean;
    OnSubmit: () => void;
    className?: string;
    emailLabel?: string;
    email: string;
    emailError: string;
    emailFocused: boolean;
    placeholder?: string;
    validateForm: () => void;
    handleInputEmail: (value: string) => void;
    handleFieldFocus: () => void;
}

class EmailForm extends React.Component<EmailFormProps> {
    public render() {
        const {
            title,
            buttonLabel,
            isLoading,
            emailLabel,
            email,
            emailFocused,
            emailError,
        } = this.props;
        const emailGroupClass = cr('cr-email-form__group', {
            'cr-email-form__group--focused': emailFocused,
        });
        return (
            <form>
                <div className="cr-email-form">
                    <div className="cr-email-form__options-group">
                        <div className="cr-email-form__option">
                            <div className="cr-email-form__option-inner">
                                {title ? title : 'Forgot password'}
                            </div>
                        </div>
                    </div>
                    <div className="cr-email-form__form-content">
                        <fieldset className={emailGroupClass}>
                            {email && <legend>{emailLabel}</legend>}
                            <Input
                                type="email"
                                value={email}
                                placeholder="Email"
                                className="cr-email-form__input"
                                onChangeValue={this.props.handleInputEmail}
                                onFocus={this.props.handleFieldFocus}
                                onBlur={this.props.handleFieldFocus}
                            />
                            {emailError && <div className="cr-email-form__error">{emailError}</div>}
                        </fieldset>
                        <div className="cr-email-form__button-wrapper">
                            <div className="cr-email-form__loader">{isLoading ? <Loader/> : null}</div>
                            <Button
                                label={isLoading ? 'Loading...' : buttonLabel ? buttonLabel : 'Send'}
                                type="submit"
                                className={email ? 'cr-email-form__button' : 'cr-email-form__button cr-email-form__button--disabled'}
                                disabled={isLoading}
                                onClick={this.handleClick}
                            />
                        </div>
                    </div>
                </div>
            </form>
        );
    }

    private handleSubmitForm() {
        this.props.OnSubmit();
    }

    private isValidForm() {
        const { email } = this.props;
        const isEmailValid = email.match(EMAIL_REGEX);

        return email && isEmailValid;
    }

    private handleClick = (label?: string, e?: React.FormEvent<HTMLInputElement>) => {
        if (e) {
            e.preventDefault();
        }
        if (!this.isValidForm()) {
            this.props.validateForm();
        } else {
            this.handleSubmitForm();
        }
    };
}


export {
    EmailForm,
    EmailFormProps,
};
