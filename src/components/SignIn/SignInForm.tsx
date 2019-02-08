import {
    Button,
    Input,
    Loader,
} from '@openware/components';
import cr from 'classnames';
import * as React from 'react';
import {
    EMAIL_REGEX,
    ERROR_EMPTY_PASSWORD,
    ERROR_INVALID_EMAIL,
} from '../../helpers';

interface SignInFormValues {
    email: string;
    password: string;
}

interface SignInFormProps {
    labelSignIn?: string;
    labelSignUp?: string;
    emailLabel?: string;
    passwordLabel?: string;
    receiveConfirmationLabel?: string;
    forgotPasswordLabel?: string;
    errorMessage?: string;
    isLoading?: boolean;
    title?: string;
    onForgotPassword: (email?: string) => void;
    onConfirmationResend?: (email?: string) => void;
    onSignUp: () => void;
    onSignIn: (data: SignInFormValues) => void;
    className?: string;
    image?: string;
}

export interface SignInFormState {
    email: string;
    emailError: string;
    emailFocused: boolean;
    emailPlaceholder: string;
    password: string;
    passwordError: string;
    passwordFocused: boolean;
    passwordPlaceholder: string;
}

class SignInForm extends React.Component<SignInFormProps, SignInFormState> {
    constructor(props: SignInFormProps) {
        super(props);
        this.state = {
            email: '',
            emailError: '',
            emailFocused: false,
            emailPlaceholder: 'email',
            password: '',
            passwordError: '',
            passwordFocused: false,
            passwordPlaceholder: 'password',
        };
    }

    public render() {
        const {
            email,
            emailFocused,
            emailError,
            password,
            passwordFocused,
            passwordError,
        } = this.state;
        const {
            errorMessage,
            isLoading,
            onForgotPassword,
            onConfirmationResend,
            onSignUp,
            image,
            labelSignIn,
            labelSignUp,
            emailLabel,
            passwordLabel,
            receiveConfirmationLabel,
            forgotPasswordLabel,
        } = this.props;
        const buttonWrapperClass = cr('cr-sign-in-form__button-wrapper', {
            'cr-sign-in-form__button-wrapper--empty': !errorMessage,
        });
        const emailGroupClass = cr('cr-sign-in-form__group', {
            'cr-sign-in-form__group--focused': emailFocused,
        });
        const passwordGroupClass = cr('cr-sign-in-form__group', {
            'cr-sign-in-form__group--focused': passwordFocused,
        });
        return (
            <form>
                <div className="cr-sign-in-form">
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
                        {/* tslint:disable */}
                        {image && (
                            <h1 className="cr-sign-in-form__title">
                                <img className="cr-sign-in-form__image" src={image} alt="logo"/>
                            </h1>
                        )}
                        {/* tslint:enable tslint:disable:jsx-no-lambda */}
                        <div className={emailGroupClass}>
                            <label className="cr-sign-in-form__label">
                                {emailLabel ? emailLabel : 'Email'}
                            </label>
                            <Input
                                type={'email'}
                                value={email}
                                className={'cr-sign-in-form__input'}
                                onChangeValue={value => this.handleInput(value, 'email')}
                                onFocus={() => this.handleFieldFocus('email')}
                                onBlur={() => this.handleFieldFocus('email')}
                            />
                            {emailError && <div className={'cr-sign-in-form__error'}>{emailError}</div>}
                        </div>
                        <div className={passwordGroupClass}>
                            <label className="cr-sign-in-form__label">
                                {passwordLabel ? passwordLabel : 'Password'}
                            </label>
                            <Input
                                type={'password'}
                                value={password}
                                className={'cr-sign-in-form__input'}
                                onChangeValue={value => this.handleInput(value, 'password')}
                                onFocus={() => this.handleFieldFocus('password')}
                                onBlur={() => this.handleFieldFocus('password')}
                            />
                            {passwordError && <div className={'cr-sign-in-form__error'}>{passwordError}</div>}
                        </div>
                        <div className={buttonWrapperClass}>
                            <div className="cr-sign-in-form__error-message">{errorMessage || null}</div>
                            <div className="cr-sign-in-form__loader">{isLoading ? <Loader/> : null}</div>
                            <Button
                                label={isLoading ? 'Loading...' : (labelSignIn ? labelSignIn : 'Sign in')}
                                type="submit"
                                className={'cr-sign-in-form__button'}
                                disabled={isLoading}
                                onClick={this.handleClick}
                            />
                        </div>
                        <div className={'cr-sign-in-form__bottom-section'}>
                            <div
                                className={'cr-sign-in-form__bottom-section-resend-confirmation'}
                                onClick={() => onConfirmationResend && onConfirmationResend(email)}
                            >
                                {receiveConfirmationLabel ? receiveConfirmationLabel : 'Didn\'t received your confirmation email?'}
                            </div>
                            <div
                                className={'cr-sign-in-form__bottom-section-password'}
                                onClick={() => onForgotPassword(email)}
                            >
                                {forgotPasswordLabel ? forgotPasswordLabel : 'Forgot your password?'}
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        );
    }

    private handleFieldFocus(field: string) {
        switch (field) {
            case 'email':
                this.setState({
                    emailFocused: !this.state.emailFocused,
                });
                break;
            case 'password':
                this.setState({
                    passwordFocused: !this.state.passwordFocused,
                });
                break;
            default:
                break;
        }
    }

    private handleSubmitForm() {
        const {
            email,
            password,
        } = this.state;

        this.setState({
            emailError: '',
            passwordError: '',
        }, () => {
            this.props.onSignIn({email, password});
        });
    }

    private isValidForm() {
        const {email, password} = this.state;
        const isEmailValid = email.match(EMAIL_REGEX);

        return email && isEmailValid && password;
    }

    private validateForm() {
        const {email,password} = this.state;
        const isEmailValid = email.match(EMAIL_REGEX);

        if (!isEmailValid) {
            this.setState({
                emailError: ERROR_INVALID_EMAIL,
                passwordError: '',
            });
            return;
        }
        if (!password) {
            this.setState({
                emailError: '',
                passwordError: ERROR_EMPTY_PASSWORD,
            });
            return;
        }
    }

    private handleInput = (value: string, type: string) => {
        switch (type) {
            case 'email':
                this.setState({
                    email: value,
                });
                break;
            case 'password':
                this.setState({
                    password: value,
                });
                break;
            default:
                break;
        }
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
    SignInForm,
    SignInFormProps,
    SignInFormValues,
};
