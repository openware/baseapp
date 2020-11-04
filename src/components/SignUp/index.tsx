import cr from 'classnames';
import React, { memo, useCallback } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { CustomInput, PasswordStrengthMeter } from '../';
import { EMAIL_REGEX, PASSWORD_REGEX } from '../../helpers';
import { GeetestCaptchaResponse } from '../../modules';
import { selectMobileDeviceState } from '../../modules/public/globalSettings';

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
    clickCheckBox: (e: any) => void;
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
    captcha_response?: string | GeetestCaptchaResponse;
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

const SignUpFormComponent: React.FC<SignUpFormProps> = ({
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
    passwordFocused,
    referalCodeLabel,
    termsMessage,
    captchaType,
    geetestCaptchaSuccess,
    hasConfirmed,
    reCaptchaSuccess,
    currentPasswordEntropy,
    passwordPopUp,
    password,
    passwordLabel,
    emailError,
    translate,
    confirmationError,
    emailFocused,
    passwordErrorFirstSolved,
    passwordErrorSecondSolved,
    confirmPasswordFocused,
    handleChangePassword,
    passwordErrorThirdSolved,
    handleFocusPassword,
    minPasswordEntropy,
    refIdFocused,
    validateForm,
    onSignUp,
    handleChangeEmail,
    handleFocusEmail,
    handleChangeConfirmPassword,
    handleFocusConfirmPassword,
    handleChangeRefId,
    handleFocusRefId,
    clickCheckBox,
    renderCaptcha,
}) => {
    const isMobileDevice = useSelector(selectMobileDeviceState);
    const history = useHistory();
    const { formatMessage } = useIntl();

    const disableButton = useCallback((): boolean => {
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
    }, [
        captchaType,
        confirmPassword,
        email,
        geetestCaptchaSuccess,
        hasConfirmed,
        isLoading,
        password,
        reCaptchaSuccess,
    ]);

    const renderPasswordInput = useCallback(() => {
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
                    handleChangeInput={handleChangePassword}
                    inputValue={password}
                    handleFocusInput={handleFocusPassword}
                    classNameLabel="cr-sign-up-form__label"
                    classNameInput="cr-sign-up-form__input"
                    autoFocus={false}
                />
                {password ? (
                    <PasswordStrengthMeter
                        minPasswordEntropy={minPasswordEntropy}
                        currentPasswordEntropy={currentPasswordEntropy}
                        passwordExist={password !== ''}
                        passwordErrorFirstSolved={passwordErrorFirstSolved}
                        passwordErrorSecondSolved={passwordErrorSecondSolved}
                        passwordErrorThirdSolved={passwordErrorThirdSolved}
                        passwordPopUp={passwordPopUp}
                        translate={translate}
                    />
                ) : null}
            </div>
        );
    }, [
        currentPasswordEntropy,
        password,
        passwordFocused,
        passwordLabel,
        passwordPopUp,
        handleChangePassword,
        handleFocusPassword,
        minPasswordEntropy,
        passwordErrorFirstSolved,
        passwordErrorSecondSolved,
        passwordErrorThirdSolved,
        translate,
    ]);

    const handleSubmitForm = useCallback(() => {
        onSignUp();
    }, [onSignUp]);

    const isValidForm = useCallback(() => {
        const isEmailValid = email.match(EMAIL_REGEX);
        const isPasswordValid = password.match(PASSWORD_REGEX);
        const isConfirmPasswordValid = password === confirmPassword;

        return email && isEmailValid && password && isPasswordValid && confirmPassword && isConfirmPasswordValid;
    }, [confirmPassword, email, password]);

    const handleClick = useCallback(
        (e?: React.FormEvent<HTMLInputElement>) => {
            if (e) {
                e.preventDefault();
            }

            if (!isValidForm()) {
                validateForm();
            } else {
                handleSubmitForm();
            }
        },
        [handleSubmitForm, isValidForm, validateForm]
    );

    const handleEnterPress = useCallback(
        (event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key === 'Enter') {
                event.preventDefault();

                handleClick();
            }
        },
        [handleClick]
    );

    const renderLogIn = useCallback(() => {
        return (
            <div className="pg-sign-up-screen__login">
                <span>
                    {formatMessage({ id: 'page.header.signUp.alreadyRegistered' })}
                    <span onClick={() => history.push('/signin')} className="pg-sign-up-screen__login-button">
                        {formatMessage({ id: 'page.mobile.header.signIn' })}
                    </span>
                </span>
            </div>
        );
    }, [history, formatMessage]);

    return (
        <form>
            <div className="cr-sign-up-form" onKeyPress={handleEnterPress}>
                {!isMobileDevice && (
                    <div className="cr-sign-up-form__options-group">
                        <div className="cr-sign-up-form__option">
                            <div
                                className="cr-sign-up-form__option-inner cr-sign-in-form__tab-signin"
                                onClick={onSignIn}>
                                {labelSignIn || 'Sign In'}
                            </div>
                        </div>
                        <div className="cr-sign-up-form__option">
                            <div className="cr-sign-up-form__option-inner __selected">{labelSignUp || 'Sign Up'}</div>
                        </div>
                    </div>
                )}
                <div className="cr-sign-up-form__form-content">
                    {image ? (
                        <h1 className="cr-sign-up-form__title">
                            <img className="cr-sign-up-form__image" src={image} alt="logo" />
                        </h1>
                    ) : null}
                    <div
                        className={cr('cr-sign-up-form__group', {
                            'cr-sign-up-form__group--focused': emailFocused,
                        })}>
                        <CustomInput
                            type="email"
                            label={emailLabel || 'Email'}
                            placeholder={emailLabel || 'Email'}
                            defaultLabel="Email"
                            handleChangeInput={handleChangeEmail}
                            inputValue={email}
                            handleFocusInput={handleFocusEmail}
                            classNameLabel="cr-sign-up-form__label"
                            classNameInput="cr-sign-up-form__input"
                            autoFocus={!isMobileDevice}
                        />
                        {emailError && <div className="cr-sign-up-form__error">{emailError}</div>}
                    </div>
                    {renderPasswordInput()}
                    <div
                        className={cr('cr-sign-up-form__group', {
                            'cr-sign-up-form__group--focused': confirmPasswordFocused,
                        })}>
                        <CustomInput
                            type="password"
                            label={confirmPasswordLabel || 'Confirm Password'}
                            placeholder={confirmPasswordLabel || 'Confirm Password'}
                            defaultLabel="Confirm Password"
                            handleChangeInput={handleChangeConfirmPassword}
                            inputValue={confirmPassword}
                            handleFocusInput={handleFocusConfirmPassword}
                            classNameLabel="cr-sign-up-form__label"
                            classNameInput="cr-sign-up-form__input"
                            autoFocus={false}
                        />
                        {confirmationError && <div className={'cr-sign-up-form__error'}>{confirmationError}</div>}
                    </div>
                    <div
                        className={cr('cr-sign-up-form__group', {
                            'cr-sign-up-form__group--focused': refIdFocused,
                        })}>
                        <CustomInput
                            type="text"
                            label={referalCodeLabel || 'Referral code'}
                            placeholder={referalCodeLabel || 'Referral code'}
                            defaultLabel="Referral code"
                            handleChangeInput={handleChangeRefId}
                            inputValue={refId}
                            handleFocusInput={handleFocusRefId}
                            classNameLabel="cr-sign-up-form__label"
                            classNameInput="cr-sign-up-form__input"
                            autoFocus={false}
                        />
                    </div>
                    <Form className="cr-sign-up-form__group" onClick={clickCheckBox}>
                        <Form.Check
                            type="checkbox"
                            custom
                            id="agreeWithTerms"
                            checked={hasConfirmed}
                            label={termsMessage ? termsMessage : 'I  agree all statements in terms of service'}
                        />
                    </Form>
                    {renderCaptcha}
                    <div className="cr-sign-up-form__button-wrapper">
                        <Button
                            block={true}
                            type="button"
                            disabled={disableButton()}
                            onClick={(e) => handleClick(e as any)}
                            size="lg"
                            variant="primary">
                            {isLoading ? 'Loading...' : labelSignUp ? labelSignUp : 'Sign up'}
                        </Button>
                    </div>
                    {isMobileDevice && renderLogIn()}
                </div>
            </div>
        </form>
    );
};

export const SignUpForm = memo(SignUpFormComponent);
