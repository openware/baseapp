import { Button, Input, Loader } from '@openware/components';
import cn from 'classnames';
import * as React from 'react';

interface TwoFactorAuthProps {
    errorMessage?: string;
    isLoading?: boolean;
    onSubmit: (optCode: string) => void;
    onSignUp: () => void;
}

interface TwoFactorAuthState {
    otpCode: string;
}

export class TwoFactorAuth extends React.Component<TwoFactorAuthProps, TwoFactorAuthState> {
    public state = {
        otpCode: '',
    };

    public render() {
        const { errorMessage, isLoading, onSignUp } = this.props;
        const buttonWrapperClass = cn('cr-sign-in-form__button-wrapper', {
            'cr-sign-in-form__button-wrapper--empty': !errorMessage,
        });
        return (
            <form onSubmit={this.handleSubmit}>
                <div className="cr-sign-in-form">
                    <h1 className="cr-sign-in-form__title" style={{ marginTop: 119 }}>
                        Sign-in
                    </h1>
                    <div className="cr-sign-in-form__group">
                        <label className="cr-sign-in-form__label">6-digit Google Authenticator code</label>
                        <Input
                            value={this.state.otpCode}
                            className={'cr-sign-in-form__input'}
                            onChangeValue={this.handleOptCodeChange}
                        />
                        <div className={buttonWrapperClass}>
                            <div className="cr-sign-in-form__error-message">{errorMessage || null}</div>
                            <div className="cr-sign-in-form__loader">{isLoading ? <Loader /> : null}</div>
                            <Button
                                label="Sign In"
                                className="cr-sign-in-form__button"
                                onClick={this.handleSubmit}
                            />
                        </div>
                        <div className="cr-sign-in-form__footer">
                            <p className="cr-sign-in-form__footer-create">Create an account?</p>
                            <a
                                className="cr-sign-in-form__footer-signup"
                                onClick={onSignUp}
                            >
                                Sign up
                            </a>
                        </div>
                    </div>
                </div>
            </form>
        );
    }

    private handleSubmit = () => {
        this.props.onSubmit(this.state.otpCode);
    };

    private handleOptCodeChange = (value: string) => {
        this.setState({
            otpCode: value,
        });
    };
}
