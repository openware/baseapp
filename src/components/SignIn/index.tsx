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
    RootState,
    selectSignInRequire2FA,
    selectUserFetching,
    selectUserLoggedIn,
    signIn,
    signInError,
} from '../../modules';
import { TwoFactorAuth } from '../TwoFactorAuth';
import { SignInForm, SignInFormValues } from './SignInForm';

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
    password: string;
}

type Props = ReduxProps & DispatchProps & RouterProps & InjectedIntlProps;

class SignInComponent extends React.Component<Props, SignInState> {
    //tslint:disable-next-line:no-any
    public static propTypes: React.ValidationMap<any> = {
        intl: intlShape.isRequired,
    };

    public state = {
        email: '',
        password: '',
    };

    public componentDidMount() {
        // clear error message
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
        return (
            <SignInForm
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
            />
        );
    }

    private render2FA = () => {
        const { loading } = this.props;
        return (
            <TwoFactorAuth
                isLoading={loading}
                onSignUp={this.handleSignUp}
                onSubmit={this.handle2FASignIn}
            />
        );
    }

    private handleSignIn = ({ email, password }: SignInFormValues) => {
        this.props.signIn({
            email,
            password,
        });
        this.setState({ email, password });
    };

    private handle2FASignIn = (otpCode: string) => {
        const { email, password } = this.state;
        this.props.signIn({
            email,
            password,
            otp_code: otpCode,
        });
    }

    private handleSignUp = () => {
        this.props.history.push('/signup');
    };

    private forgotPassword = () => {
        this.props.history.push('/forgot_password');
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
const SignIn = injectIntl(withRouter(connect(mapStateToProps, mapDispatchProps)(SignInComponent) as any));

export {
    SignIn,
};
