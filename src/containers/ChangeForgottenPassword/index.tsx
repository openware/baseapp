import {
  Button,
} from '@openware/components';
import cr from 'classnames';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import {
  connect,
  MapDispatchToPropsFunction,
  MapStateToProps,
} from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { CustomInput } from '../../components';
import { PASSWORD_REGEX } from '../../helpers';
import {
    changeForgotPasswordFetch,
    changeLanguage,
    RootState,
    selectChangeForgotPasswordSuccess,
} from '../../modules';

interface ChangeForgottenPasswordState {
    error: boolean;
    password: string;
    passwordFocused: boolean;
    confirmToken: string;
    confirmPassword: string;
    confirmPasswordFocused: boolean;
}

interface ReduxProps {
    changeForgotPassword?: boolean;
}

interface DispatchProps {
    changeForgotPasswordFetch: typeof changeForgotPasswordFetch;
    changeLanguage: typeof changeLanguage;
}

interface HistoryProps {
    history: {
        location: {
            search: string;
        };
    };
}

type Props = RouterProps & DispatchProps & HistoryProps & ReduxProps & InjectedIntlProps;

class ChangeForgottenPasswordComponent extends React.Component<Props, ChangeForgottenPasswordState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            error: false,
            confirmToken: '',
            password: '',
            passwordFocused: false,
            confirmPassword: '',
            confirmPasswordFocused: false,
        };
    }

    public componentDidMount() {
        const { history } = this.props;
        const token = new URLSearchParams(history.location.search).get('reset_token');
        const lang = new URLSearchParams(history.location.search).get('lang');
        if (token) {
            this.setState({
                confirmToken: token,
            });
        }
        if (lang) {
            this.props.changeLanguage(lang);
        }
    }

    public componentWillReceiveProps(next: Props) {
        if (next.changeForgotPassword && (!this.props.changeForgotPassword)) {
            this.props.history.push('/signin');
        }
    }

    public render() {
        const {
            error,
            password,
            passwordFocused,
            confirmPassword,
            confirmPasswordFocused,
        } = this.state;

        const passwordFocusedClass = cr('cr-email-form__group', {
            'cr-email-form__group--focused': passwordFocused,
        });

        const confirmPasswordFocusedClass = cr('cr-email-form__group', {
            'cr-email-form__group--focused': confirmPasswordFocused,
        });

        const updatePassword = e => this.handleChange('password', e);
        const updateConfirmPassword = e => this.handleChange('confirmPassword', e);
        return (
            <div className="pg-change-forgotten-password-screen">
                <div className="pg-change-forgotten-password-screen__container">
                    <form>
                        <div className="cr-email-form">
                            <div className="cr-email-form__options-group">
                                <div className="cr-email-form__option">
                                    <div className="cr-email-form__option-inner">
                                        {this.props.intl.formatMessage({id: 'page.header.signIn.resetPassword.title'})}
                                    </div>
                                </div>
                            </div>
                            <div className="cr-email-form__form-content">
                                <div className={passwordFocusedClass}>
                                    <CustomInput
                                        type="password"
                                        label={this.props.intl.formatMessage({id: 'page.header.signIn.resetPassword.newPassword'})}
                                        placeholder={this.props.intl.formatMessage({id: 'page.header.signIn.resetPassword.newPassword'})}
                                        defaultLabel="New password"
                                        handleChangeInput={updatePassword}
                                        inputValue={password}
                                        handleFocusInput={this.handleFieldFocus('password')}
                                        classNameLabel="cr-email-form__label"
                                        classNameInput="cr-email-form__input"
                                        autoFocus={true}
                                    />
                                </div>
                                <div className={confirmPasswordFocusedClass}>
                                    <CustomInput
                                        type="password"
                                        label={this.props.intl.formatMessage({id: 'page.header.signIn.resetPassword.repeatPassword'})}
                                        placeholder={this.props.intl.formatMessage({id: 'page.header.signIn.resetPassword.repeatPassword'})}
                                        defaultLabel="Repeat password"
                                        handleChangeInput={updateConfirmPassword}
                                        inputValue={confirmPassword}
                                        handleFocusInput={this.handleFieldFocus('confirmPassword')}
                                        classNameLabel="cr-email-form__label"
                                        classNameInput="cr-email-form__input"
                                        autoFocus={false}
                                    />
                                </div>
                                {error && <div className="cr-email-form__error">{this.props.intl.formatMessage({id: 'page.header.signIn.resetPassword.error'})}</div>}
                                <div className="cr-email-form__button-wrapper">
                                    <Button
                                        label={this.props.intl.formatMessage({id: 'page.header.signIn.resetPassword.button'})}
                                        type="submit"
                                        className={!this.disableButton() ? 'cr-email-form__button' : 'cr-email-form__button cr-email-form__button--disabled'}
                                        disabled={this.disableButton()}
                                        onClick={this.handleSendNewPassword}
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    private disableButton = (): boolean => {
        const {
            password,
            confirmPassword,
        } = this.state;

        return !password || !confirmPassword;
    };

    private handleFieldFocus = (field: string) => {
        return () => {
            switch (field) {
                case 'password':
                    this.setState({
                        passwordFocused: !this.state.passwordFocused,
                    });
                    break;
                case 'confirmPassword':
                    this.setState({
                        confirmPasswordFocused: !this.state.confirmPasswordFocused,
                    });
                    break;
                default:
                    break;
            }
        };
    }

    private handleSendNewPassword = () => {
        const { password, confirmPassword, confirmToken } = this.state;
        const isPasswordValid = password.match(PASSWORD_REGEX);
        const isConfirmPasswordValid = password === confirmPassword;

        this.setState({
            error: !(isPasswordValid && isConfirmPasswordValid),
        }, () => {
            if (!this.state.error) {
                this.props.changeForgotPasswordFetch({
                    reset_password_token: confirmToken,
                    password: password,
                    confirm_password: confirmPassword,
                });
            }
        });
    };

    private handleChange = (key: string, value: string) => {
      // @ts-ignore
      this.setState({
        [key]: value,
      });
    };
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    changeForgotPassword: selectChangeForgotPasswordSuccess(state),
});

const mapDispatchProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        changeForgotPasswordFetch: credentials => dispatch(changeForgotPasswordFetch(credentials)),
        changeLanguage: lang => dispatch(changeLanguage(lang)),
    });

// tslint:disable-next-line:no-any
const ChangeForgottenPassword = withRouter(injectIntl(connect(mapStateToProps, mapDispatchProps)(ChangeForgottenPasswordComponent) as any));

export {
    ChangeForgottenPassword,
};
