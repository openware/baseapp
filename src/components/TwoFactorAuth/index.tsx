import { Button, Input, Loader } from '@openware/components';
import cn from 'classnames';
import * as React from 'react';
import {
    InjectedIntlProps,
    injectIntl,
    intlShape,
} from 'react-intl';

interface TwoFactorAuthProps {
    errorMessage?: string;
    isLoading?: boolean;
    onSubmit: (optCode: string) => void;
    onSignUp: () => void;
}

interface TwoFactorAuthState {
    otpCode: string;
    error: string;
}

class TwoFactorAuthComponent extends React.Component<TwoFactorAuthProps & InjectedIntlProps, TwoFactorAuthState> {
    //tslint:disable-next-line:no-any
    public static propTypes: React.ValidationMap<any> = {
        intl: intlShape.isRequired,
    };

    public state = {
        otpCode: '',
        error: '',
    };

    public render() {
        const { errorMessage, isLoading, onSignUp } = this.props;
        const { error } = this.state;
        const errors = errorMessage && error;
        const buttonWrapperClass = cn('cr-sign-in-form__button-wrapper', {
            'cr-sign-in-form__button-wrapper--empty': !errors,
        });
        return (
            <form onSubmit={this.handleSubmit}>
                <div className="cr-sign-in-form">
                    <h1 className="cr-sign-in-form__title" style={{ marginTop: 119 }}>
                        {this.props.intl.formatMessage({ id: 'page.header.signIn'})}
                    </h1>
                    <div className="cr-sign-in-form__form-content">
                      <div className="cr-sign-in-form__group">
                          <label className="cr-sign-in-form__label">
                              {this.props.intl.formatMessage({id: 'page.body.wallets.tabs.withdraw.content.code2fa'})}
                          </label>
                          <Input
                              value={this.state.otpCode}
                              className={'cr-sign-in-form__input'}
                              onChangeValue={this.handleOptCodeChange}
                          />
                        </div>
                        <div className={buttonWrapperClass}>
                            <div className="cr-sign-in-form__error-message">{errors || null}</div>
                            <div className="cr-sign-in-form__loader">{isLoading ? <Loader /> : null}</div>
                            <Button
                                label={this.props.intl.formatMessage({ id: 'page.header.signIn'})}
                                className="cr-sign-in-form__button"
                                onClick={this.handleSubmit}
                            />
                        </div>
                        <div className="cr-sign-in-form__footer">
                            <p className="cr-sign-in-form__footer-create">
                                {this.props.intl.formatMessage({id: 'page.header.signIn.createAccount'})}
                            </p>
                            <a
                                className="cr-sign-in-form__footer-signup"
                                onClick={onSignUp}
                            >
                                {this.props.intl.formatMessage({id: 'page.header.signUp'})}
                            </a>
                        </div>
                    </div>
                </div>
            </form>
        );
    }

    private handleSubmit = () => {
        const { otpCode } = this.state;
        if (!otpCode) {
            this.setState({
                error: 'Please enter 2fa code',
            });
        }
        this.props.onSubmit(otpCode);
    };

    private handleOptCodeChange = (value: string) => {
        this.setState({
            otpCode: value,
        });
    };
}

export const TwoFactorAuth = injectIntl(TwoFactorAuthComponent);
