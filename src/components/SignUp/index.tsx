import cr from 'classnames';
import * as React from 'react';
import { Button, Form } from 'react-bootstrap';
import { CustomInput, PasswordStrengthMeter } from '../';
import { EMAIL_REGEX, PASSWORD_REGEX } from '../../helpers';

export interface SignUpFormProps {
    isLoading?: boolean;
    title?: string;
    onSignUp: () => void;
    onSignIn?: () => void;
    className?: string;
    image?: string;
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
    captchaType: 'recaptcha' | 'geetest' | 'none';
    renderCaptcha: JSX.Element | null;
    reCaptchaSuccess: boolean;
    geetestCaptchaSuccess: boolean;
    captcha_response: string;
    currentPasswordEntropy: number;
    minPasswordEntropy: number;
    passwordErrorFirstSolved: boolean;
    passwordErrorSecondSolved: boolean;
    passwordErrorThirdSolved: boolean;
    passwordPopUp: boolean;
    myRef: any;
    passwordWrapper: any;
    translate: (id: string) => string;
}

export class SignUpForm extends React.Component<SignUpFormProps> {
    public render() {
        const {
            email,
            confirmPassword,
            refId,
            onSignIn,
            image,
            isLoading,
            labelSignIn,
            labelSignUp,
            emailLabel,
            confirmPasswordLabel,
            referalCodeLabel,
            termsMessage,
            hasConfirmed,
            emailError,
            confirmationError,
            emailFocused,
            confirmPasswordFocused,
            refIdFocused,
        } = this.props;

        const emailGroupClass = cr('cr-sign-up-form__group', {
            'cr-sign-up-form__group--focused': emailFocused,
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

        return (
            <form>
                <div className="cr-sign-up-form" onKeyPress={this.handleEnterPress}>
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
                        {this.renderPasswordInput()}
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
                        <Form className="cr-sign-up-form__group">
                            <Form.Check
                                type="checkbox"
                                custom
                                id="agreeWithTerms"
                                checked={hasConfirmed}
                                onChange={this.props.clickCheckBox}
                                label={termsMessage ? termsMessage : 'I  agree all statements in terms of service'}
                            />
                        </Form>
                        {this.props.renderCaptcha}
                        <div className="cr-sign-up-form__button-wrapper">
                            <Button
                                block={true}
                                type="button"
                                disabled={this.disableButton()}
                                onClick={e => this.handleClick(e)}
                                size="lg"
                                variant="primary"
                            >
                                {isLoading ? 'Loading...' : (labelSignUp ? labelSignUp : 'Sign up')}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        );
    }

    private renderPasswordInput = () => {
        const {
            password,
            passwordLabel,
            passwordFocused,
            currentPasswordEntropy,
            passwordPopUp,
            translate,
        } = this.props;

        const passwordGroupClass = cr('cr-sign-up-form__group', {
            'cr-sign-up-form__group--focused': passwordFocused,
        });

        return (
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
                {password ?
                    <PasswordStrengthMeter
                        minPasswordEntropy={this.props.minPasswordEntropy}
                        currentPasswordEntropy={currentPasswordEntropy}
                        passwordExist={password !== ''}
                        passwordErrorFirstSolved={this.props.passwordErrorFirstSolved}
                        passwordErrorSecondSolved={this.props.passwordErrorSecondSolved}
                        passwordErrorThirdSolved={this.props.passwordErrorThirdSolved}
                        passwordPopUp={passwordPopUp}
                        translate={translate}
                    /> : null}
            </div>
        );
    }

    private disableButton = (): boolean => {
        const {
            email,
            password,
            confirmPassword,
            hasConfirmed,
            reCaptchaSuccess,
            isLoading,
            captchaType,
            geetestCaptchaSuccess,
        } = this.props;

        if (!hasConfirmed || isLoading || !email.match(EMAIL_REGEX) || !password || !confirmPassword) {
            return true;
        }
        if (captchaType === 'recaptcha' && !reCaptchaSuccess) {
            return true;
        }
        if (captchaType === 'geetest' && !geetestCaptchaSuccess) {
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

    private handleEnterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();

            this.handleClick();
        }
    }
}
