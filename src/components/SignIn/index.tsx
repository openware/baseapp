import cr from 'classnames';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import { CustomInput } from '../';
import { EMAIL_REGEX } from '../../helpers';

export interface SignInProps {
    labelSignIn?: string;
    labelSignUp?: string;
    emailLabel?: string;
    passwordLabel?: string;
    receiveConfirmationLabel?: string;
    forgotPasswordLabel?: string;
    isLoading?: boolean;
    title?: string;
    onForgotPassword: (email?: string) => void;
    onConfirmationResend?: (email?: string) => void;
    onSignUp: () => void;
    onSignIn: () => void;
    className?: string;
    image?: string;
    email: string;
    emailError: string;
    password: string;
    passwordError: string;
    emailFocused: boolean;
    emailPlaceholder: string;
    passwordFocused: boolean;
    passwordPlaceholder: string;
    isFormValid: () => void;
    refreshError: () => void;
    handleChangeFocusField: (value: string) => void;
    changePassword: (value: string) => void;
    changeEmail: (value: string) => void;
}

export class SignInComponent extends React.Component<SignInProps> {
    public render() {
        const {
            email,
            emailError,
            emailPlaceholder,
            password,
            passwordError,
            passwordPlaceholder,
            isLoading,
            onForgotPassword,
            onSignUp,
            image,
            labelSignIn,
            labelSignUp,
            emailLabel,
            passwordLabel,
            forgotPasswordLabel,
            emailFocused,
            passwordFocused,
        } = this.props;
        const emailGroupClass = cr('cr-sign-in-form__group', {
            'cr-sign-in-form__group--focused': emailFocused,
        });
        const passwordGroupClass = cr('cr-sign-in-form__group', {
            'cr-sign-in-form__group--focused': passwordFocused,
        });
        const logo = image ? (
            <h1 className="cr-sign-in-form__title">
                <img className="cr-sign-in-form__image" src={image} alt="logo" />
            </h1>
        ) : null;

        // tslint:disable:jsx-no-lambda
        return (
            <form>
                <div className="cr-sign-in-form" onKeyPress={this.handleEnterPress}>
                    <div className="cr-sign-in-form__options-group">
                        <div className="cr-sign-in-form__option">
                            <div className="cr-sign-in-form__option-inner __selected">
                                {labelSignIn ? labelSignIn : 'Sign In'}
                            </div>
                        </div>
                        <div className="cr-sign-in-form__option">
                            <div className="cr-sign-in-form__option-inner cr-sign-in-form__tab-signup" onClick={onSignUp}>
                                {labelSignUp ? labelSignUp : 'Sign Up'}
                            </div>
                        </div>
                    </div>
                    <div className="cr-sign-in-form__form-content">
                        {logo}
                        <div className={emailGroupClass}>
                            <CustomInput
                                type="email"
                                label={emailLabel || 'Email'}
                                placeholder={emailPlaceholder}
                                defaultLabel="Email"
                                handleChangeInput={this.handleChangeEmail}
                                inputValue={email}
                                handleFocusInput={() => this.handleFieldFocus('email')}
                                classNameLabel="cr-sign-in-form__label"
                                autoFocus={true}
                            />
                            {emailError && <div className={'cr-sign-in-form__error'}>{emailError}</div>}
                        </div>
                        <div className={passwordGroupClass}>
                            <CustomInput
                                type="password"
                                label={passwordLabel || 'Password'}
                                placeholder={passwordPlaceholder}
                                defaultLabel="Password"
                                handleChangeInput={this.handleChangePassword}
                                inputValue={password}
                                handleFocusInput={() => this.handleFieldFocus('password')}
                                classNameLabel="cr-sign-in-form__label"
                                autoFocus={false}
                            />
                            {passwordError && <div className={'cr-sign-in-form__error'}>{passwordError}</div>}
                        </div>
                        <div className="cr-sign-in-form__button-wrapper">
                            <Button
                                block={true}
                                type="button"
                                disabled={isLoading || !email.match(EMAIL_REGEX) || !password}
                                onClick={e => this.handleClick(e)}
                                size="lg"
                                variant="primary"
                            >
                                {isLoading ? 'Loading...' : (labelSignIn ? labelSignIn : 'Sign in')}
                            </Button>
                        </div>
                        <div className="cr-sign-in-form__bottom-section">
                            <div
                                className="cr-sign-in-form__bottom-section-password"
                                onClick={() => onForgotPassword(email)}
                            >
                                {forgotPasswordLabel ? forgotPasswordLabel : 'Forgot your password?'}
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        );
        // tslint:enable:jsx-no-lambda
    }

    private handleChangeEmail = (value: string) => {
        this.props.changeEmail(value);
    };

    private handleChangePassword = (value: string) => {
        this.props.changePassword(value);
    };

    private handleFieldFocus = (field: string) => {
        this.props.handleChangeFocusField(field);
    };

    private handleSubmitForm = () => {
        this.props.refreshError();
        this.props.onSignIn();
    };

    private isValidForm = () => {
        const { email, password } = this.props;
        const isEmailValid = email.match(EMAIL_REGEX);

        return email && isEmailValid && password;
    };

    private handleValidateForm = () => {
        this.props.isFormValid();
    };

    private handleClick = (label?: string, e?: React.FormEvent<HTMLInputElement>) => {
        if (e) {
            e.preventDefault();
        }
        if (!this.isValidForm()) {
            this.handleValidateForm();
        } else {
            this.handleSubmitForm();
        }
    };

    private handleEnterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();

            this.handleClick();
        }
    }
}
