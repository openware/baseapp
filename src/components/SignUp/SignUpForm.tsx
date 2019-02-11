// TODO: add checkbox(not merged)
/* tslint:disable:jsx-no-lambda*/
import {
    Button,
    Checkbox,
    Input,
    Loader,
} from '@openware/components';
import cr from 'classnames';
import * as React from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import {
    EMAIL_REGEX,
    ERROR_INVALID_EMAIL,
    ERROR_INVALID_PASSWORD,
    ERROR_PASSWORD_CONFIRMATION,
    PASSWORD_REGEX,
} from '../../helpers';

interface SignUpFormValues {
    email: string;
    password: string;
    recaptcha_response: string;
    refId: string;
}

interface SignUpFormProps {
    refId?: string;
    siteKey?: string;
    errorMessage?: string;
    isLoading?: boolean;
    title?: string;
    onSignUp: (data: SignUpFormValues) => void;
    onSignIn?: () => void;
    className?: string;
    image?: string;
    captchaType: 'recaptcha' | 'geetest' | 'none';
    labelSignIn?: string;
    labelSignUp?: string;
    emailLabel?: string;
    passwordLabel?: string;
    confirmPasswordLabel?: string;
    referalCodeLabel?: string;
    termsMessage?: string;
}

export interface SignUpFormState {
    confirmPassword: string;
    confirmPasswordFocused: boolean;
    confirmationError: string;
    refId: string;
    refIdFocused: boolean;
    email: string;
    emailFocused: boolean;
    emailError: string;
    password: string;
    passwordFocused: boolean;
    passwordError: string;
    hasConfirmed: boolean;
    recaptchaConfirmed: boolean;
    recaptcha_response: string;
}

class SignUpForm extends React.Component<SignUpFormProps, SignUpFormState> {
    constructor(props: SignUpFormProps) {
        super(props);
        this.state = {
            refId: props.refId ? props.refId : '',
            refIdFocused: false,
            confirmationError: '',
            confirmPassword: '',
            confirmPasswordFocused: false,
            email: '',
            emailFocused: false,
            emailError: '',
            password: '',
            passwordFocused: false,
            passwordError: '',
            hasConfirmed: false,
            recaptchaConfirmed: false,
            recaptcha_response: '',
        };
    }

    public onChange = (value: string) => {
        this.setState({
          recaptchaConfirmed: true,
          recaptcha_response: value,
        });
    };

    public render() {
        const {
            email,
            emailFocused,
            emailError,
            password,
            passwordFocused,
            passwordError,
            confirmPassword,
            confirmPasswordFocused,
            confirmationError,
            refId,
            refIdFocused,
            hasConfirmed,
        } = this.state;
        const {
            onSignIn,
            errorMessage,
            image,
            isLoading,
            siteKey,
            captchaType,
            labelSignIn,
            labelSignUp,
            emailLabel,
            passwordLabel,
            confirmPasswordLabel,
            referalCodeLabel,
            termsMessage,
        } = this.props;
        const buttonWrapperClass = cr('cr-sign-up-form__button-wrapper', {
            'cr-sign-up-form__button-wrapper--empty': !errorMessage,
        });
        const emailGroupClass = cr('cr-sign-up-form__group', {
            'cr-sign-up-form__group--focused': emailFocused,
        });
        const passwordGroupClass = cr('cr-sign-up-form__group', {
            'cr-sign-up-form__group--focused': passwordFocused,
        });
        const confirmPasswordGroupClass = cr('cr-sign-up-form__group', {
            'cr-sign-up-form__group--focused': confirmPasswordFocused,
        });
        const refIdGroupClass = cr('cr-sign-up-form__group', {
            'cr-sign-up-form__group--focused': refIdFocused,
        });
        return (
            <form>
                <div className="cr-sign-up-form">
                    <div className="cr-sign-up-form__options-group">
                        <div className="cr-sign-up-form__option">
                            <div className="cr-sign-up-form__option-inner cr-sign-in-form__tab-signin" onClick={onSignIn}>
                                {labelSignIn ? labelSignIn : 'Sign In'}
                            </div>
                        </div>
                        <div className="cr-sign-up-form__option">
                            <div className="cr-sign-up-form__option-inner __selected">
                              {labelSignUp ? labelSignUp : 'Sign Up'}
                            </div>
                        </div>
                    </div>
                    <div className="cr-sign-up-form__form-content">
                        {/* tslint:disable */}
                        {image && (
                            <h1 className="cr-sign-up-form__title">
                                <img className="cr-sign-up-form__image" src={image} alt="logo"/>
                            </h1>
                        )}
                        {/* tslint:enable tslint:disable:jsx-no-lambda */}
                        <div className={emailGroupClass}>
                            <label className="cr-sign-up-form__label">
                                {emailLabel ? emailLabel : 'Email'}
                            </label>
                            <Input
                                type={'email'}
                                value={email}
                                className={'cr-sign-up-form__input'}
                                onFocus={() => this.handleFieldFocus('email')}
                                onBlur={() => this.handleFieldFocus('email')}
                                onChangeValue={value => this.handleInput(value, 'email')}
                            />
                            {emailError && <div className={'cr-sign-up-form__error'}>{emailError}</div>}
                        </div>
                        <div className={passwordGroupClass}>
                            <label className="cr-sign-up-form__label">
                                {passwordLabel ? passwordLabel : 'Password'}
                            </label>
                            <Input
                                type={'password'}
                                value={password}
                                className={'cr-sign-up-form__input'}
                                onFocus={() => this.handleFieldFocus('password')}
                                onBlur={() => this.handleFieldFocus('password')}
                                onChangeValue={value => this.handleInput(value, 'password')}
                            />
                            {passwordError && <div className={'cr-sign-up-form__error'}>{passwordError}</div>}
                        </div>
                        <div className={confirmPasswordGroupClass}>
                            <label className="cr-sign-up-form__label">
                                {confirmPasswordLabel ? confirmPasswordLabel : 'Confirm Password'}
                            </label>
                            <Input
                                type={'password'}
                                value={confirmPassword}
                                className={'cr-sign-up-form__input'}
                                onFocus={() => this.handleFieldFocus('confirmation')}
                                onBlur={() => this.handleFieldFocus('confirmation')}
                                onChangeValue={value => this.handleInput(value, 'confirmation')}
                            />
                            {confirmationError && <div className={'cr-sign-up-form__error'}>{confirmationError}</div>}
                        </div>
                        <div className={refIdGroupClass}>
                            <label className="cr-sign-up-form__label">
                                {referalCodeLabel ? referalCodeLabel : 'Referral code'}
                            </label>
                            <Input
                                type={'text'}
                                value={refId}
                                className={'cr-sign-up-form__input'}
                                onFocus={() => this.handleFieldFocus('refId')}
                                onBlur={() => this.handleFieldFocus('refId')}
                                onChangeValue={value => this.handleInput(value, 'refId')}
                            />
                        </div>
                        <Checkbox
                            checked={hasConfirmed}
                            className={'cr-sign-up-form__checkbox'}
                            onChange={() => this.handleCheckboxClick()}
                            label={termsMessage ? termsMessage : 'I  agree all statements in terms of service'}
                        />
                        {/* tslint:disable */}
                        {hasConfirmed && captchaType !== 'none' ?
                        <div className="cr-sign-up-form__recaptcha">
                        <ReCAPTCHA
                            sitekey={siteKey}
                            onChange={this.onChange}
                        />
                        </div> : null}
                        {/* tslint:enable tslint:disable:jsx-no-lambda */}
                        <div className={buttonWrapperClass}>
                            <div className="cr-sign-up-form__error-message">{errorMessage || null}</div>
                            <div className="cr-sign-up-form__loader">{isLoading ? <Loader/> : null}</div>
                            <Button
                                type="submit"
                                className={'cr-sign-up-form__button'}
                                label={isLoading ? 'Loading...' : (labelSignUp ? labelSignUp : 'Sign up')}
                                disabled={!hasConfirmed || isLoading || this.disableButton()
                                          || !email.match(EMAIL_REGEX) || !password || !confirmPassword}
                                onClick={this.handleClick}
                            />
                        </div>
                    </div>
                </div>
            </form>
        );
    }

    private disableButton = (): boolean => {
        const { captchaType } = this.props;
        const { recaptchaConfirmed } = this.state;

        if (captchaType !== 'none') {
            return !recaptchaConfirmed;
        }

        return false;
    };

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
            case 'confirmation':
                this.setState({
                    confirmPasswordFocused: !this.state.confirmPasswordFocused,
                });
                break;
            case 'refId':
                this.setState({
                    refIdFocused: !this.state.refIdFocused,
                });
                break;
            default:
                break;
        }
    }

    private handleCheckboxClick(): void {
        this.setState(prev => ({
            hasConfirmed: !prev.hasConfirmed,
        }));
    }

    private handleSubmitForm() {
        const {
            email,
            password,
            recaptcha_response,
            refId,
        } = this.state;

        this.setState({
            hasConfirmed: false,
            confirmationError: '',
            emailError: '',
            passwordError: '',
        }, () => {
            this.props.onSignUp({email, password, recaptcha_response, refId});
        });
    }

    private isValidForm() {
        const {email, password, confirmPassword} = this.state;
        const isEmailValid = email.match(EMAIL_REGEX);
        const isPasswordValid = password.match(PASSWORD_REGEX);
        const isConfirmPasswordValid = password === confirmPassword;

        return (email && isEmailValid) &&
            (password && isPasswordValid) &&
            (confirmPassword && isConfirmPasswordValid);
    }

    private validateForm() {
        const {email, password, confirmPassword} = this.state;
        const isEmailValid = email.match(EMAIL_REGEX);
        const isPasswordValid = password.match(PASSWORD_REGEX);
        const isConfirmPasswordValid = password === confirmPassword;

        if (!isEmailValid && !isPasswordValid) {
            this.setState({
                confirmationError: '',
                emailError: ERROR_INVALID_EMAIL,
                passwordError: ERROR_INVALID_PASSWORD,
                hasConfirmed: false,
            });
            return;
        }

        if (!isEmailValid) {
            this.setState({
                confirmationError: '',
                emailError: ERROR_INVALID_EMAIL,
                passwordError: '',
                hasConfirmed: false,
            });
            return;
        }

        if (!isPasswordValid) {
            this.setState({
                confirmationError: '',
                emailError: '',
                passwordError: ERROR_INVALID_PASSWORD,
                hasConfirmed: false,
            });
            return;
        }

        if (!isConfirmPasswordValid) {
            this.setState({
                confirmationError: ERROR_PASSWORD_CONFIRMATION,
                emailError: '',
                passwordError: '',
                hasConfirmed: false,
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
            case 'confirmation': {
                this.setState({
                    confirmPassword: value,
                });
                break;
            }
            case 'refId': {
                this.setState({
                    refId: value,
                });
                break;
            }
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
    SignUpForm,
    SignUpFormProps,
    SignUpFormValues,
};
