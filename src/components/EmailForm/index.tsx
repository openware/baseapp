import cr from 'classnames';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import { CustomInput } from '../';
import { CloseIcon } from '../../assets/images/CloseIcon';
import { EMAIL_REGEX } from '../../helpers';

export interface EmailFormProps {
    title?: string;
    buttonLabel?: string;
    errorMessage?: string;
    isLoading?: boolean;
    OnSubmit: () => void;
    className?: string;
    emailLabel?: string;
    email: string;
    message: string;
    emailError: string;
    emailFocused: boolean;
    placeholder?: string;
    validateForm: () => void;
    handleInputEmail: (value: string) => void;
    handleFieldFocus: () => void;
    handleReturnBack: () => void;
}

export class EmailForm extends React.Component<EmailFormProps> {
    public render() {
        const {
            title,
            buttonLabel,
            isLoading,
            emailLabel,
            message,
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
                                <div className="cr-email-form__cros-icon" onClick={this.handleCancel}>
                                    <CloseIcon className="close-icon" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="cr-email-form__form-content">
                        <div className="cr-email-form__header">
                          {message}
                        </div>
                        <div className={emailGroupClass}>
                            <CustomInput
                                type="email"
                                label={emailLabel || 'Email'}
                                placeholder={emailLabel || 'Email'}
                                defaultLabel="Email"
                                handleChangeInput={this.props.handleInputEmail}
                                inputValue={email}
                                handleFocusInput={this.props.handleFieldFocus}
                                classNameLabel="cr-email-form__label"
                                classNameInput="cr-email-form__input"
                                autoFocus={true}
                            />
                            {emailError && <div className="cr-email-form__error">{emailError}</div>}
                        </div>
                        <div className="cr-email-form__button-wrapper">
                            <Button
                                block={true}
                                type="button"
                                disabled={isLoading || !email.match(EMAIL_REGEX)}
                                onClick={e => this.handleClick(e)}
                                size="lg"
                                variant="primary"
                            >
                                {isLoading ? 'Loading...' : buttonLabel ? buttonLabel : 'Send'}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        );
    }

    private handleCancel = () => {
        this.props.handleReturnBack();
    };

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
