/* tslint:disable:jsx-no-lambda*/
import {
    Button,
    Input,
    Loader,
} from '@openware/components';
import cr from 'classnames';
import * as React from 'react';
import {
    EMAIL_REGEX,
    ERROR_INVALID_EMAIL,
} from '../../helpers';

interface EmailFormProps {
    title?: string;
    buttonLabel?: string;
    errorMessage?: string;
    isLoading?: boolean;
    OnSubmit: (email: string) => void;
    className?: string;
    emailLabel?: string;
}

export interface EmailFormState {
    email: string;
    emailError: string;
    emailFocused: boolean;
    emailPlaceholder: string;
}

class EmailForm extends React.Component<EmailFormProps, EmailFormState> {
    constructor(props: EmailFormProps) {
        super(props);
        this.state = {
            email: '',
            emailError: '',
            emailFocused: false,
            emailPlaceholder: 'email',
        };
    }

    public render() {
        const {
            email,
            emailFocused,
            emailError,
        } = this.state;
        const {
            title,
            buttonLabel,
            errorMessage,
            isLoading,
            emailLabel,
        } = this.props;
        const buttonWrapperClass = cr('cr-email-form__button-wrapper', {
            'cr-email-form__button-wrapper--empty': !errorMessage,
        });
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
                        <div className={emailGroupClass}>
                            <label className="cr-email-form__label">
                                {emailLabel ? emailLabel : 'Email'}
                            </label>
                            <Input
                                type={'mail'}
                                value={email}
                                className={'cr-email-form__input'}
                                onChangeValue={value => this.handleInput(value)}
                                onFocus={() => this.handleFieldFocus()}
                                onBlur={() => this.handleFieldFocus()}
                            />
                            {emailError && <div className={'cr-email-form__error'}>{emailError}</div>}
                        </div>
                        <div className={buttonWrapperClass}>
                            <div className="cr-email-form__error-message">{errorMessage || null}</div>
                            <div className="cr-email-form__loader">{isLoading ? <Loader/> : null}</div>
                            <Button
                                label={isLoading ? 'Loading...' : buttonLabel ? buttonLabel : 'Send'}
                                type="submit"
                                className={'cr-email-form__button'}
                                disabled={isLoading}
                                onClick={this.handleClick}
                            />
                        </div>
                    </div>
                </div>
            </form>
        );
    }

    private handleFieldFocus() {
        this.setState({
            emailFocused: !this.state.emailFocused,
        });
    }

    private handleSubmitForm() {
        const { email } = this.state;

        this.setState({
            emailError: '',
        }, () => {
            this.props.OnSubmit(email);
        });
    }

    private isValidForm() {
        const {email} = this.state;
        const isEmailValid = email.match(EMAIL_REGEX);

        return email && isEmailValid;
    }

    private validateForm() {
        const {email} = this.state;
        const isEmailValid = email.match(EMAIL_REGEX);

        if (!isEmailValid) {
            this.setState({
                emailError: ERROR_INVALID_EMAIL,
            });
            return;
        }
    }

    private handleInput = (value: string) => {
        this.setState({
            email: value,
        });
    };

    private handleClick = (label?: string, e?: React.FormEvent<HTMLInputElement>) => {
        if (e) {
            e.preventDefault();
        }
        if (!this.isValidForm()) {
            this.validateForm();
        } else {
            this.handleSubmitForm();
        }
    };
}


export {
    EmailForm,
    EmailFormProps,
};
