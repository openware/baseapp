import { Button, Modal } from '@openware/components';
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
import { captchaType, siteKey } from '../../api';
import {
    AuthError,
    RootState,
    selectSignUpRequireVerification,
    signUp,
    signUpError,
} from '../../modules';
import { SignUpForm, SignUpFormValues } from './SignUpForm';

interface ReduxProps {
    requireVerification?: boolean;
    loading?: boolean;
}

interface DispatchProps {
    signUp: typeof signUp;
    signUpError: typeof signUpError;
}

type Props = ReduxProps & DispatchProps & RouterProps & InjectedIntlProps;

class SignUpComponent extends React.Component<Props> {
    //tslint:disable-next-line:no-any
    public static propTypes: React.ValidationMap<any> = {
        intl: intlShape.isRequired,
    };

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
        const { loading } = this.props;

        const className = cx('pg-sign-up-screen__container', { loading });
        return (
            <div className="pg-sign-up-screen">
                <div className={className}>
                    <SignUpForm
                        labelSignIn={this.props.intl.formatMessage({ id: 'page.header.signIn'})}
                        labelSignUp={this.props.intl.formatMessage({ id: 'page.header.signUp'})}
                        emailLabel={this.props.intl.formatMessage({ id: 'page.header.signUp.email'})}
                        passwordLabel={this.props.intl.formatMessage({ id: 'page.header.signUp.password'})}
                        confirmPasswordLabel={this.props.intl.formatMessage({ id: 'page.header.signUp.confirmPassword'})}
                        referalCodeLabel={this.props.intl.formatMessage({ id: 'page.header.signUp.referalCode'})}
                        termsMessage={this.props.intl.formatMessage({ id: 'page.header.signUp.terms'})}
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
                {this.props.intl.formatMessage({id: 'page.header.signUp.modal.header'})}
            </div>
        );
    };

    private renderModalBody = () => {
        return (
            <div className="pg-exchange-modal-submit-body">
                <h2>
                    {this.props.intl.formatMessage({id: 'page.header.signUp.modal.body'})}
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
});

const mapDispatchProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        signUp: credentials => dispatch(signUp(credentials)),
        signUpError: (error: AuthError) => dispatch(signUpError(error)),
    });

// tslint:disable-next-line:no-any
const SignUp = injectIntl(withRouter(connect(mapStateToProps, mapDispatchProps)(SignUpComponent) as any));

export {
    SignUp,
};
