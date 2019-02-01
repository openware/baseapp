import { Button, Modal, SignUpForm, SignUpFormValues } from '@openware/components';
import cx from 'classnames';
import * as React from 'react';
import {
  connect,
  MapDispatchToPropsFunction,
  MapStateToProps,
} from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { captchaType, siteKey } from '../../api';
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
    public readonly state = { showModal: false };

    public componentDidMount() {
        this.props.signUpError({ code: undefined, message: undefined });
    }

    public componentWillReceiveProps(props: Props) {
        if (props.requireVerification) {
            this.openModal();
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
                        siteKey={siteKey()}
                        captchaType={captchaType()}
                    />
                    <Modal
                        show={this.state.showModal}
                        header={this.renderModalHeader()}
                        content={this.renderModalBody()}
                        footer={this.renderModalFooter()}
                    />
                </div>
            </div>
        );
    }

    private handleSignIn = () => {
        this.props.history.push('/signin');
    };
    private handleSignUp = ({ email, password, recaptcha_response }: SignUpFormValues) => {
        switch (captchaType()) {
            case 'none':
                this.props.signUp({
                    email,
                    password,
                });
                break;
            case 'recaptcha':
            case 'geetest':
            default:
                this.props.signUp({
                    email,
                    password,
                    recaptcha_response,
                });
                break;
        }
    };

    private renderModalHeader = () => {
        return (
            <div className="pg-exchange-modal-submit-header">
                VERIFY YOUR EMAIL ADDRESS
            </div>
        );
    };

    private renderModalBody = () => {
        return (
            <div className="pg-exchange-modal-submit-body">
                <h2>
                    To complete the registration look for an
                    email in your inbox that provides further
                    instruction. If you cannot find the email,
                    please check your spam email
                </h2>
            </div>
        );
    };

    private renderModalFooter = () => {
        return (
            <div className="pg-exchange-modal-submit-footer">
                <Button
                    className="pg-exchange-modal-submit-footer__button-inverse"
                    label="OK"
                    onClick={this.closeModal}
                />
            </div>
        );
    };

    private openModal = () => {
        this.setState({showModal: true});
    };

    private closeModal = () => {
        this.setState({showModal: false});
        this.props.history.push('/signin');
    }
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
