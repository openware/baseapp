import { Button, Input, Loader } from '@openware/components';
import cn from 'classnames';
import * as React from 'react';

interface TwoFactorAuthProps {
    errorMessage?: string;
    isLoading?: boolean;
    onSubmit: () => void;
    onSignUp: () => void;
    signInLabel: string;
    codeLabel: string;
    buttonLabel: string;
    footerCreateAccountLabel: string;
    signUpLabel: string;
    otpCode: string;
    error: string;
    handleOtpCodeChange: (otp: string) => void;
}

class TwoFactorAuthComponent extends React.Component<TwoFactorAuthProps> {
    public render() {
        const {
            errorMessage,
            isLoading,
            onSignUp,
            signInLabel,
            codeLabel,
            buttonLabel,
            footerCreateAccountLabel,
            signUpLabel,
            error,
            otpCode,
        } = this.props;

        const errors = errorMessage || error;
        const buttonWrapperClass = cn('cr-sign-in-form__button-wrapper', {
            'cr-sign-in-form__button-wrapper--empty': !errors,
        });
        return (
            <form onSubmit={this.handleSubmit}>
                <div className="cr-sign-in-form">
                    <h1 className="cr-sign-in-form__title" style={{ marginTop: 119 }}>
                        {signInLabel}
                    </h1>
                    <div className="cr-sign-in-form__form-content">
                      <div className="cr-sign-in-form__group">
                          <label className="cr-sign-in-form__label">
                              {codeLabel}
                          </label>
                          <Input
                              value={otpCode}
                              className="cr-sign-in-form__input"
                              onChangeValue={this.props.handleOtpCodeChange}
                          />
                        </div>
                        <div className={buttonWrapperClass}>
                            <div className="cr-sign-in-form__error-message">{errors || null}</div>
                            <div className="cr-sign-in-form__loader">{isLoading ? <Loader /> : null}</div>
                            <Button
                                label={buttonLabel}
                                className="cr-sign-in-form__button"
                                onClick={this.handleSubmit}
                            />
                        </div>
                        <div className="cr-sign-in-form__footer">
                            <p className="cr-sign-in-form__footer-create">
                                {footerCreateAccountLabel}
                            </p>
                            <a
                                className="cr-sign-in-form__2fa-bottom-section-text"
                                onClick={onSignUp}
                            >
                                {signUpLabel}
                            </a>
                        </div>
                    </div>
                </div>
            </form>
        );
    }

    private handleSubmit = () => {
        this.props.onSubmit();
    };
}

export const TwoFactorAuth = TwoFactorAuthComponent;
