import cr from 'classnames';
import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { Button } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { CustomInput } from '../CustomInput';
import { EMAIL_REGEX } from '../../helpers';
import { selectMobileDeviceState } from '../../modules/public/globalSettings';

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

const SignIn: React.FC<SignInProps> = ({
    email,
    emailError,
    emailPlaceholder,
    password,
    passwordError,
    passwordPlaceholder,
    isLoading,
    onSignUp,
    image,
    labelSignIn,
    labelSignUp,
    emailLabel,
    passwordLabel,
    emailFocused,
    passwordFocused,
    onForgotPassword,
    forgotPasswordLabel,
    refreshError,
    onSignIn,
    isFormValid,
    handleChangeFocusField,
    changePassword,
    changeEmail,
}) => {
    const isMobileDevice = useSelector(selectMobileDeviceState);
    const history = useHistory();
    const { formatMessage } = useIntl();

    const isValidForm = useCallback(() => {
        const isEmailValid = email.match(EMAIL_REGEX);

        return email && isEmailValid && password;
    }, [email, password]);

    const handleChangeEmail = useCallback(
        (value: string) => {
            changeEmail(value);
        },
        [changeEmail]
    );

    const handleChangePassword = useCallback(
        (value: string) => {
            changePassword(value);
        },
        [changePassword]
    );

    const handleFieldFocus = useCallback(
        (field: string) => {
            handleChangeFocusField(field);
        },
        [handleChangeFocusField]
    );

    const handleSubmitForm = useCallback(() => {
        refreshError();
        onSignIn();
    }, [onSignIn, refreshError]);

    const handleValidateForm = useCallback(() => {
        isFormValid();
    }, [isFormValid]);

    const handleClick = useCallback(
        (e?: MouseEvent) => {
            if (e) {
                e.preventDefault();
            }
            if (!isValidForm()) {
                handleValidateForm();
            } else {
                handleSubmitForm();
            }
        },
        [handleSubmitForm, handleValidateForm, isValidForm]
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

    const renderForgotButton = useMemo(
        () => (
            <div className="cr-sign-in-form__bottom-section">
                <div className="cr-sign-in-form__bottom-section-password" onClick={() => onForgotPassword(email)}>
                    {forgotPasswordLabel || 'Forgot your password?'}
                </div>
            </div>
        ),
        [forgotPasswordLabel, onForgotPassword, email]
    );

    const renderRegister = useMemo(
        () => (
            <div className="pg-sign-in-screen__register">
                <span>
                    {formatMessage({ id: 'page.header.signIN.noAccountYet' })}
                    <span onClick={() => history.push('/signup')} className="pg-sign-in-screen__register-button">
                        {formatMessage({ id: 'page.body.landing.header.button3' })}
                    </span>
                </span>
            </div>
        ),
        [formatMessage, history]
    );

    return (
        <form>
            <div className="cr-sign-in-form" onKeyPress={handleEnterPress}>
                {!isMobileDevice && (
                    <div className="cr-sign-in-form__options-group">
                        <div className="cr-sign-in-form__option">
                            <div className="cr-sign-in-form__option-inner __selected">
                                {labelSignIn ? labelSignIn : 'Sign In'}
                            </div>
                        </div>
                        <div className="cr-sign-in-form__option">
                            <div
                                className="cr-sign-in-form__option-inner cr-sign-in-form__tab-signup"
                                onClick={onSignUp}>
                                {labelSignUp ? labelSignUp : 'Sign Up'}
                            </div>
                        </div>
                    </div>
                )}
                <div className="cr-sign-in-form__form-content">
                    {image ? (
                        <h1 className="cr-sign-in-form__title">
                            <img className="cr-sign-in-form__image" src={image} alt="logo" />
                        </h1>
                    ) : null}
                    <div
                        className={cr('cr-sign-in-form__group', {
                            'cr-sign-in-form__group--focused': emailFocused,
                        })}>
                        <CustomInput
                            type="email"
                            label={emailLabel || 'Email'}
                            placeholder={emailPlaceholder}
                            defaultLabel="Email"
                            handleChangeInput={handleChangeEmail}
                            inputValue={email}
                            handleFocusInput={() => handleFieldFocus('email')}
                            classNameLabel="cr-sign-in-form__label"
                            autoFocus={!isMobileDevice}
                        />
                        {emailError && <div className={'cr-sign-in-form__error'}>{emailError}</div>}
                    </div>
                    <div
                        className={cr('cr-sign-in-form__group', {
                            'cr-sign-in-form__group--focused': passwordFocused,
                        })}>
                        <CustomInput
                            type="password"
                            label={passwordLabel || 'Password'}
                            placeholder={passwordPlaceholder}
                            defaultLabel="Password"
                            handleChangeInput={handleChangePassword}
                            inputValue={password}
                            handleFocusInput={() => handleFieldFocus('password')}
                            classNameLabel="cr-sign-in-form__label"
                            autoFocus={false}
                        />
                        {passwordError && <div className={'cr-sign-in-form__error'}>{passwordError}</div>}
                    </div>
                    {isMobileDevice && renderForgotButton}
                    <div className="cr-sign-in-form__button-wrapper">
                        <Button
                            block={true}
                            type="button"
                            disabled={isLoading || !email.match(EMAIL_REGEX) || !password}
                            onClick={handleClick as any}
                            size="lg"
                            variant="primary">
                            {isLoading ? 'Loading...' : labelSignIn ? labelSignIn : 'Sign in'}
                        </Button>
                    </div>
                    {!isMobileDevice && renderForgotButton}
                    {isMobileDevice && renderRegister}
                </div>
            </div>
        </form>
    );
};

export const SignInComponent = memo(SignIn);
