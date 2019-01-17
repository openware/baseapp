import { SignUpForm, SignUpFormValues } from '@openware/components';
import cx from 'classnames';
import * as React from 'react';
import {
  connect,
  MapDispatchToPropsFunction,
  MapStateToProps,
} from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import {
    AuthError,
    RootState,
    selectAuthError,
    selectSignUpRequireVerification,
    signUp,
    signUpError,
} from '../../modules';

interface ReduxProps {
    requireVerification?: boolean;
    error?: AuthError;
    loading?: boolean;
}

interface DispatchProps {
    signUp: typeof signUp;
    signUpError: typeof signUpError;
}

type Props = ReduxProps & DispatchProps & RouterProps;

class SignUpComponent extends React.Component<Props> {
    public componentDidMount() {
        this.props.signUpError({ code: undefined, message: undefined });
    }

    public componentWillReceiveProps(props: Props) {
        if (props.requireVerification) {
            this.props.history.push('/signin');
        }
    }

    public render() {
        const { loading, error } = this.props;

        const className = cx('pg-sign-up-screen__container', { loading });
        return (
            <div className="pg-sign-up-screen">
                <div className={className}>
                    <SignUpForm
                        errorMessage={error && error.message}
                        isLoading={loading}
                        onSignIn={this.handleSignIn}
                        onSignUp={this.handleSignUp}
                        siteKey="6LeBHl0UAAAAALq0JBMgY9_CnF35W797k7-q0edn"
                    />
                </div>
            </div>
        );
    }

    private handleSignIn = () => {
        this.props.history.push('/signin');
    };
    private handleSignUp = ({ email, password, recaptcha_response }: SignUpFormValues) => {
        this.props.signUp({
            email,
            password,
            recaptcha_response,
        });
    };
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    requireVerification: selectSignUpRequireVerification(state),
    error: selectAuthError(state),
});

const mapDispatchProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        signUp: credentials => dispatch(signUp(credentials)),
        signUpError: (error: AuthError) => dispatch(signUpError(error)),
    });

// tslint:disable-next-line
const SignUp = withRouter(connect(mapStateToProps, mapDispatchProps)(SignUpComponent) as any);

export {
    SignUp,
};
