import {
    Button,
    Checkbox,
} from '@openware/components';
import cr from 'classnames';
import {
    CustomInput,
} from '../';

import * as React from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import {
    EMAIL_REGEX,
    PASSWORD_REGEX,
} from '../../helpers';

interface SignUpFormProps {
    siteKey?: string;
    isLoading?: boolean;
    title?: string;
    onSignUp: () => void;
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
    refId: string;
    password: string;
    email: string;
    confirmPassword: string;
    recaptcha_response: string;
    recaptchaConfirmed: boolean;
    recaptchaOnChange: (value: string) => void;
    handleChangeEmail: (value: string) => void;
    handleChangePassword: (value: string) => void;
    handleChangeConfirmPassword: (value: string) => void;
    handleChangeRefId: (value: string) => void;
    hasConfirmed: boolean;
    clickCheckBox: () => void;
    validateForm: () => void;
    emailError: string;
    passwordError: string;
    confirmationError: string;
    handleFocusEmail: () => void;
    handleFocusPassword: () => void;
    handleFocusConfirmPassword: () => void;
    handleFocusRefId: () => void;
    confirmPasswordFocused: boolean;
    refIdFocused: boolean;
    emailFocused: boolean;
    passwordFocused: boolean;
}

class SignUpForm extends React.Component<SignUpFormProps> {
    public render() {
        const {
            email,
            password,
            confirmPassword,
            refId,
            onSignIn,
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
            hasConfirmed,
            emailError,
            passwordError,
            confirmationError,
            emailFocused,
            passwordFocused,
            confirmPasswordFocused,
            refIdFocused,
        } = this.props;

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
        const logo = image ? (
            <h1 className="cr-sign-up-form__title">
                <img className="cr-sign-up-form__image" src={image} alt="logo" />
            </h1>
        ) : null;
        const captcha = hasConfirmed && captchaType !== 'none' ?
            (
                <div className="cr-sign-up-form__recaptcha">
                    <ReCAPTCHA
                        sitekey={siteKey}
                        onChange={this.props.recaptchaOnChange}
                    />
                </div>
            ) : null;

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
                        {logo}
                        <div className={emailGroupClass}>
                            <CustomInput
                                type="email"
                                label={emailLabel || 'Email'}
                                placeholder={emailLabel || 'Email'}
                                defaultLabel="Email"
                                handleChangeInput={this.props.handleChangeEmail}
                                inputValue={email}
                                handleFocusInput={this.props.handleFocusEmail}
                                classNameLabel="cr-sign-up-form__label"
                                classNameInput="cr-sign-up-form__input"
                                autoFocus={true}
                            />
                            {emailError && <div className="cr-sign-up-form__error">{emailError}</div>}
                        </div>
                        <div className={passwordGroupClass}>
                            <CustomInput
                                type="password"
                                label={passwordLabel || 'Password'}
                                placeholder={passwordLabel || 'Password'}
                                defaultLabel="Password"
                                handleChangeInput={this.props.handleChangePassword}
                                inputValue={password}
                                handleFocusInput={this.props.handleFocusPassword}
                                classNameLabel="cr-sign-up-form__label"
                                classNameInput="cr-sign-up-form__input"
                                autoFocus={false}
                            />
                            {passwordError && <div className={'cr-sign-up-form__error'}>{passwordError}</div>}
                        </div>
                        <div className={confirmPasswordGroupClass}>
                            <CustomInput
                                type="password"
                                label={confirmPasswordLabel || 'Confirm Password'}
                                placeholder={confirmPasswordLabel || 'Confirm Password'}
                                defaultLabel="Confirm Password"
                                handleChangeInput={this.props.handleChangeConfirmPassword}
                                inputValue={confirmPassword}
                                handleFocusInput={this.props.handleFocusConfirmPassword}
                                classNameLabel="cr-sign-up-form__label"
                                classNameInput="cr-sign-up-form__input"
                                autoFocus={false}
                            />
                            {confirmationError && <div className={'cr-sign-up-form__error'}>{confirmationError}</div>}
                        </div>
                        <div className={refIdGroupClass}>
                            <CustomInput
                                type="text"
                                label={referalCodeLabel || 'Referral code'}
                                placeholder={referalCodeLabel || 'Referral code'}
                                defaultLabel="Referral code"
                                handleChangeInput={this.props.handleChangeRefId}
                                inputValue={refId}
                                handleFocusInput={this.props.handleFocusRefId}
                                classNameLabel="cr-sign-up-form__label"
                                classNameInput="cr-sign-up-form__input"
                                autoFocus={false}
                            />
                        </div>
                        <Checkbox
                            checked={hasConfirmed}
                            className="cr-sign-up-form__checkbox"
                            onChange={this.props.clickCheckBox}
                            label={termsMessage ? termsMessage : 'I  agree all statements in terms of service'}
                        />
                        {captcha}
                        <div className="cr-sign-up-form__button-wrapper">
                            <Button
                                type="submit"
                                className="cr-sign-up-form__button"
                                label={isLoading ? 'Loading...' : (labelSignUp ? labelSignUp : 'Sign up')}
                                disabled={this.disableButton()}
                                onClick={this.handleClick}
                            />
                        </div>
                    </div>
                </div>
            </form>
        );
    }

    private disableButton = (): boolean => {
        const {
            email,
            password,
            confirmPassword,
            hasConfirmed,
            recaptchaConfirmed,
            isLoading,
            captchaType,
        } = this.props;

        if (!hasConfirmed || isLoading || !email.match(EMAIL_REGEX) || !password || !confirmPassword) {
            return true;
        }
        if (captchaType !== 'none' && !recaptchaConfirmed) {
            return true;
        }
        return false;
    };

    private handleSubmitForm() {
        this.props.onSignUp();
    }

    private isValidForm() {
        const { email, password, confirmPassword } = this.props;
        const isEmailValid = email.match(EMAIL_REGEX);
        const isPasswordValid = password.match(PASSWORD_REGEX);
        const isConfirmPasswordValid = password === confirmPassword;

        return (email && isEmailValid) &&
            (password && isPasswordValid) &&
            (confirmPassword && isConfirmPasswordValid);
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
    SignUpForm,
    SignUpFormProps,
};
