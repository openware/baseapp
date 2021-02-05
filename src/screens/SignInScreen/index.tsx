import cx from 'classnames';
import React, { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { SignInComponent, TwoFactorAuth } from '../../components';
import { NewSignIn, SignInParams } from '../../components/NewSignIn';
import { EMAIL_REGEX, ERROR_EMPTY_PASSWORD, ERROR_INVALID_EMAIL, setDocumentTitle } from '../../helpers';
import { useReduxSelector } from '../../hooks';
import {
    selectSignInRequire2FA,
    selectUserFetching,
    selectUserLoggedIn,
    signIn,
    signInError,
    signInRequire2FA,
    signUpRequireVerification,
} from '../../modules';
import { CommonError } from '../../modules/types';

export const SignInScreen: React.FC = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { formatMessage } = useIntl();

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [emailFocused, setEmailFocused] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [otpCode, setOtpCode] = useState('');
    const [error2fa, setError2fa] = useState('');
    const [codeFocused, setCodeFocused] = useState(false);

    const isLoggedIn = useReduxSelector(selectUserLoggedIn);
    const loading = useReduxSelector(selectUserFetching);
    const require2FA = useReduxSelector(selectSignInRequire2FA);
    const requireEmailVerification = useReduxSelector((x) => x.user.auth.requireVerification);

    useEffect(() => {
        setDocumentTitle('Sign In');
        dispatch(signInError({ code: 0, message: [''] }));
        dispatch(signUpRequireVerification({ requireVerification: false }));
    }, [dispatch]);

    useEffect(() => {
        if (requireEmailVerification) {
            history.push('/email-verification', { email: email });
        }
    }, [requireEmailVerification, history]);

    useEffect(() => {
        if (isLoggedIn) {
            history.push('/wallets');
        }
    }, [isLoggedIn, history]);

    const refreshError = useCallback(() => {
        setEmailError('');
        setPasswordError('');
    }, []);

    const handleChangeOtpCode = useCallback((value: string) => {
        setError2fa('');
        setOtpCode(value);
    }, []);

    const handleSignIn = useCallback(() => {
        dispatch(
            signIn({
                email,
                password,
            })
        );
    }, [dispatch, email, password]);

    const handleSingInSubmit = useCallback(
        (data: SignInParams) => {
            dispatch(signIn(data));
        },
        [dispatch, email, password]
    );

    const handle2FASignIn = useCallback(() => {
        if (!otpCode) {
            setError2fa('Please enter 2fa code');
        } else {
            dispatch(
                signIn({
                    email,
                    password,
                    otp_code: otpCode,
                })
            );
        }
    }, [dispatch, otpCode, email, password]);

    const handleSignUp = useCallback(() => {
        history.push('/signup');
    }, [history]);

    const forgotPassword = useCallback(() => {
        history.push('/forgot_password');
    }, [history]);

    const handleFieldFocus = useCallback(
        (field: string) => {
            switch (field) {
                case 'email':
                    setEmailFocused(!emailFocused);
                    break;
                case 'password':
                    setPasswordFocused(!passwordFocused);
                    break;
                default:
                    break;
            }
        },
        [emailFocused, passwordFocused]
    );

    const handle2faFocus = useCallback(() => {
        setCodeFocused(!codeFocused);
    }, [codeFocused]);

    const validateForm = useCallback(() => {
        const isEmailValid = email.match(EMAIL_REGEX);

        if (!isEmailValid) {
            setEmailError(formatMessage({ id: ERROR_INVALID_EMAIL }));
            setPasswordError('');

            return;
        }
        if (!password) {
            setEmailError('');
            setPasswordError(formatMessage({ id: ERROR_EMPTY_PASSWORD }));

            return;
        }
    }, [email, password, formatMessage]);

    const handleChangeEmailValue = useCallback((value: string) => {
        setEmail(value);
    }, []);

    const handleChangePasswordValue = useCallback((value: string) => {
        setPassword(value);
    }, []);

    const handleClose = useCallback(() => {
        dispatch(signInRequire2FA({ require2fa: false }));
    }, [dispatch]);

    return (
        <div className="pg-sign-in-screen">
            <div className={cx('pg-sign-in-screen__container', { loading })}>
                {require2FA ? (
                    <TwoFactorAuth
                        isLoading={loading}
                        onSubmit={handle2FASignIn}
                        title={formatMessage({ id: 'page.password2fa' })}
                        label={formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.code2fa' })}
                        buttonLabel={formatMessage({ id: 'page.header.signIn' })}
                        message={formatMessage({ id: 'page.password2fa.message' })}
                        codeFocused={codeFocused}
                        otpCode={otpCode}
                        error={error2fa}
                        handleOtpCodeChange={handleChangeOtpCode}
                        handleChangeFocusField={handle2faFocus}
                        handleClose2fa={handleClose}
                    />
                ) : (
                    <NewSignIn onSubmit={handleSingInSubmit} />
                    // <SignInComponent
                    //     email={email}
                    //     emailError={emailError}
                    //     emailFocused={emailFocused}
                    //     emailPlaceholder={formatMessage({ id: 'page.header.signIn.email' })}
                    //     password={password}
                    //     passwordError={passwordError}
                    //     passwordFocused={passwordFocused}
                    //     passwordPlaceholder={formatMessage({ id: 'page.header.signIn.password' })}
                    //     labelSignIn={formatMessage({ id: 'page.header.signIn' })}
                    //     labelSignUp={formatMessage({ id: 'page.header.signUp' })}
                    //     emailLabel={formatMessage({ id: 'page.header.signIn.email' })}
                    //     passwordLabel={formatMessage({ id: 'page.header.signIn.password' })}
                    //     receiveConfirmationLabel={formatMessage({
                    //         id: 'page.header.signIn.receiveConfirmation',
                    //     })}
                    //     forgotPasswordLabel={formatMessage({ id: 'page.header.signIn.forgotPassword' })}
                    //     isLoading={loading}
                    //     onForgotPassword={forgotPassword}
                    //     onSignUp={handleSignUp}
                    //     onSignIn={handleSignIn}
                    //     handleChangeFocusField={handleFieldFocus}
                    //     isFormValid={validateForm}
                    //     refreshError={refreshError}
                    //     changeEmail={handleChangeEmailValue}
                    //     changePassword={handleChangePasswordValue}
                    // />
                )}
            </div>
        </div>
    );
};
