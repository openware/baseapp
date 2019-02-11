import cx from 'classnames';
import * as React from 'react';
import {
    InjectedIntlProps,
    injectIntl,
    intlShape,
} from 'react-intl';
import {
    connect,
    MapDispatchToPropsFunction,
    MapStateToProps,
} from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import {
    SignInComponent,
    TwoFactorAuth,
} from '../../components';
import {
    EMAIL_REGEX,
    ERROR_EMPTY_PASSWORD,
    ERROR_INVALID_EMAIL,
} from '../../helpers';
import {
    RootState,
    selectSignInRequire2FA,
    selectUserFetching,
    selectUserLoggedIn,
    signIn,
    signInError,
} from '../../modules';

interface ReduxProps {
    isLoggedIn: boolean;
    loading?: boolean;
    require2FA?: boolean;
}

interface DispatchProps {
    signIn: typeof signIn;
    signInError: typeof signInError;
}

interface SignInState {
    email: string;
    emailError: string;
    emailFocused: boolean;
    password: string;
    passwordError: string;
    passwordFocused: boolean;
    otpCode: string;
    error2fa: string;
}

type Props = ReduxProps & DispatchProps & RouterProps & InjectedIntlProps;

class SignInBox extends React.Component<Props, SignInState> {
    //tslint:disable-next-line:no-any
    public static propTypes: React.ValidationMap<any> = {
        intl: intlShape.isRequired,
    };

    public state = {
        email: '',
        emailError: '',
        emailFocused: false,
        password: '',
        passwordError: '',
        passwordFocused: false,
        otpCode: '',
        error2fa: '',
    };

    public componentDidMount() {
        this.props.signInError({ code: undefined, message: undefined });
    }

    public componentWillReceiveProps(props: Props) {
        if (props.isLoggedIn) {
            this.props.history.push('/wallets');
        }
    }

    public render() {
        const { loading, require2FA } = this.props;

        const className = cx('pg-sign-in-screen__container', { loading });
        return (
            <div className="pg-sign-in-screen">
                <div className={className}>
                    {require2FA ? this.render2FA() : this.renderSignInForm()}
                </div>
            </div>
        );
    }

    private renderSignInForm = () => {
        const { loading } = this.props;
        const {
            email,
            emailError,
            emailFocused,
            password,
            passwordError,
            passwordFocused,
        } = this.state;

        return (
            <SignInComponent
                email={email}
                emailError={emailError}
                emailFocused={emailFocused}
                emailPlaceholder={this.props.intl.formatMessage({ id: 'page.header.signIn.email'})}
                password={password}
                passwordError={passwordError}
                passwordFocused={passwordFocused}
                passwordPlaceholder={this.props.intl.formatMessage({ id: 'page.header.signIn.password'})}
                labelSignIn={this.props.intl.formatMessage({ id: 'page.header.signIn'})}
                labelSignUp={this.props.intl.formatMessage({ id: 'page.header.signUp'})}
                emailLabel={this.props.intl.formatMessage({ id: 'page.header.signIn.email'})}
                passwordLabel={this.props.intl.formatMessage({ id: 'page.header.signIn.password'})}
                receiveConfirmationLabel={this.props.intl.formatMessage({ id: 'page.header.signIn.receiveConfirmation'})}
                forgotPasswordLabel={this.props.intl.formatMessage({ id: 'page.header.signIn.forgotPassword'})}
                isLoading={loading}
                onForgotPassword={this.forgotPassword}
                onSignUp={this.handleSignUp}
                onSignIn={this.handleSignIn}
                handleChangeFocusField={this.handleFieldFocus}
                isFormValid={this.validateForm}
                refreshError={this.refreshError}
                changeEmail={this.handleChangeEmailValue}
                changePassword={this.handleChangePasswordValue}
            />
        );
    }


    private render2FA = () => {
        const { loading } = this.props;
        const { otpCode, error2fa } = this.state;
        return (
            <TwoFactorAuth
                isLoading={loading}
                onSignUp={this.handleSignUp}
                onSubmit={this.handle2FASignIn}
                signInLabel={this.props.intl.formatMessage({ id: 'page.header.signIn'})}
                codeLabel={this.props.intl.formatMessage({id: 'page.body.wallets.tabs.withdraw.content.code2fa'})}
                buttonLabel={this.props.intl.formatMessage({ id: 'page.header.signIn'})}
                footerCreateAccountLabel={this.props.intl.formatMessage({id: 'page.header.signIn.createAccount'})}
                signUpLabel={this.props.intl.formatMessage({ id: 'page.header.signUp'})}
                otpCode={otpCode}
                error={error2fa}
                handleOtpCodeChange={this.handleChangeOtpCode}
            />
        );
    };

    private refreshError = () => {
        this.setState({
            emailError: '',
            passwordError: '',
        });
    };

    private handleChangeOtpCode = (value: string) => {
        this.setState({
            error2fa: '',
            otpCode: value,
        });
    };

    private handleSignIn = () => {
        const { email, password } = this.state;
        this.props.signIn({
            email,
            password,
        });
    };

    private handle2FASignIn = () => {
        const { email, password, otpCode } = this.state;
        if (!otpCode) {
            this.setState({
                error2fa: 'Please enter 2fa code',
            });
        } else {
            this.props.signIn({
                email,
                password,
                otp_code: otpCode,
            });
        }
    };

    private handleSignUp = () => {
        this.props.history.push('/signup');
    };

    private forgotPassword = () => {
        this.props.history.push('/forgot_password');
    };

    private handleFieldFocus = (field: string) => {
        switch (field) {
            case 'email':
                this.setState(prev => ({
                    emailFocused: !prev.emailFocused,
                }));
                break;
            case 'password':
                this.setState(prev => ({
                    passwordFocused: !prev.passwordFocused,
                }));
                break;
            default:
                break;
        }
    };

    private validateForm = () => {
        const { email,password } = this.state;
        const isEmailValid = email.match(EMAIL_REGEX);

        if (!isEmailValid) {
            this.setState({
                emailError: ERROR_INVALID_EMAIL,
                passwordError: '',
            });
            return;
        }
        if (!password) {
            this.setState({
                emailError: '',
                passwordError: ERROR_EMPTY_PASSWORD,
            });
            return;
        }
    };

    private handleChangeEmailValue = (value: string) => {
        this.setState({
            email: value,
        });
    };

    private handleChangePasswordValue = (value: string) => {
        this.setState({
            password: value,
        });
    };
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    isLoggedIn: selectUserLoggedIn(state),
    loading: selectUserFetching(state),
    require2FA: selectSignInRequire2FA(state),
});

const mapDispatchProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        signIn: data => dispatch(signIn(data)),
        signInError: error => dispatch(signInError(error)),
    });

// tslint:disable-next-line no-any
const SignIn = injectIntl(withRouter(connect(mapStateToProps, mapDispatchProps)(SignInBox) as any));

export {
    SignIn,
};
