import cx from 'classnames';
import { History } from 'history';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import {
    InjectedIntlProps,
    injectIntl,
} from 'react-intl';
import {
    connect,
    MapDispatchToPropsFunction,
    MapStateToProps,
} from 'react-redux';
import { withRouter } from 'react-router-dom';
import { captchaType, siteKey } from '../../api';
import { Modal, SignUpForm } from '../../components';
import { GeetestCaptcha } from '../../containers';
import {
    EMAIL_REGEX,
    ERROR_INVALID_EMAIL,
    ERROR_INVALID_PASSWORD,
    ERROR_PASSWORD_CONFIRMATION,
    PASSWORD_REGEX,
    setDocumentTitle,
} from '../../helpers';
import {
    RootState,
    selectCurrentLanguage,
    selectSignUpRequireVerification,
    signUp,
} from '../../modules';

interface ReduxProps {
    requireVerification?: boolean;
    loading?: boolean;
}

interface DispatchProps {
    signUp: typeof signUp;
}

interface RouterProps {
    location: {
        search: string;
    };
    history: History;
}

type Props = ReduxProps & DispatchProps & RouterProps & InjectedIntlProps;

export const extractRefID = (props: RouterProps) => new URLSearchParams(props.location.search).get('refid');

class SignUp extends React.Component<Props> {
    public readonly state = {
        showModal: false,
        email: '',
        password: '',
        confirmPassword: '',
        captcha_response: '',
        recaptchaConfirmed: false,
        refId: '',
        hasConfirmed: false,
        emailError: '',
        passwordError: '',
        confirmationError: '',
        emailFocused: false,
        passwordFocused: false,
        confirmPasswordFocused: false,
        refIdFocused: false,
        geetestCaptchaSuccess: false,
    };

    public constructor(props) {
        super(props);
        this.captchaRef = React.createRef();
    }

    private captchaRef;

    public componentDidMount() {
        setDocumentTitle('Sign Up');
        const localReferralCode = localStorage.getItem('referralCode');
        const refId = this.extractRefID(this.props.location.search);
        const referralCode = refId || localReferralCode || '';
        this.setState({
            refId: referralCode,
        });
        if (refId && refId !== localReferralCode) {
            localStorage.setItem('referralCode', referralCode);
        }
    }

    public componentWillReceiveProps(props: Props) {
        if (props.requireVerification) {
            props.history.push('/email-verification', {email: this.state.email});
        }
    }

    public render() {
        const {
            email,
            password,
            confirmPassword,
            refId,
            captcha_response,
            recaptchaConfirmed,
            hasConfirmed,
            emailError,
            passwordError,
            confirmationError,
            emailFocused,
            passwordFocused,
            confirmPasswordFocused,
            refIdFocused,
            geetestCaptchaSuccess,
        } = this.state;
        const { loading } = this.props;
        const test = !geetestCaptchaSuccess ? <GeetestCaptcha ref={this.captchaRef} onSuccess={this.handleGeetestCaptchaSuccess}/> : undefined;

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
                        refId={refId}
                        handleChangeRefId={this.handleChangeRefId}
                        isLoading={loading}
                        onSignIn={this.handleSignIn}
                        onSignUp={this.handleSignUp}
                        siteKey={siteKey()}
                        captchaType={captchaType()}
                        email={email}
                        handleChangeEmail={this.handleChangeEmail}
                        password={password}
                        handleChangePassword={this.handleChangePassword}
                        confirmPassword={confirmPassword}
                        handleChangeConfirmPassword={this.handleChangeConfirmPassword}
                        recaptchaConfirmed={recaptchaConfirmed}
                        captcha_response={captcha_response}
                        recaptchaOnChange={this.onChange}
                        hasConfirmed={hasConfirmed}
                        clickCheckBox={this.handleCheckboxClick}
                        validateForm={this.handleValidateForm}
                        emailError={emailError}
                        passwordError={passwordError}
                        confirmationError={confirmationError}
                        confirmPasswordFocused={confirmPasswordFocused}
                        refIdFocused={refIdFocused}
                        emailFocused={emailFocused}
                        passwordFocused={passwordFocused}
                        handleFocusEmail={this.handleFocusEmail}
                        handleFocusPassword={this.handleFocusPassword}
                        handleFocusConfirmPassword={this.handleFocusConfirmPassword}
                        handleFocusRefId={this.handleFocusRefId}
                        geetestCaptcha={test}
                        geetestCaptchaSuccess={geetestCaptchaSuccess}
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

    private handleCheckboxClick = () => {
        this.setState({
            hasConfirmed: !this.state.hasConfirmed,
        });
    }

    private onChange = (value: string) => {
        this.setState({
            recaptchaConfirmed: true,
            captcha_response: value,
        });
    };

    private handleChangeEmail = (value: string) => {
        this.setState({
            email: value,
        });
    };

    private handleChangePassword = (value: string) => {
        this.setState({
            password: value,
        });
    };

    private handleChangeConfirmPassword = (value: string) => {
        this.setState({
            confirmPassword: value,
        });
    };

    private handleChangeRefId = (value: string) => {
        this.setState({
            refId: value,
        });
    };

    private handleFocusEmail = () => {
        this.setState({
            emailFocused: !this.state.emailFocused,
        });
    };

    private handleFocusPassword = () => {
        this.setState({
            passwordFocused: !this.state.passwordFocused,
        });
    };

    private handleFocusConfirmPassword = () => {
        this.setState({
            confirmPasswordFocused: !this.state.confirmPasswordFocused,
        });
    };

    private handleFocusRefId = () => {
        this.setState({
            refIdFocused: !this.state.refIdFocused,
        });
    };

    private handleSignIn = () => {
        this.props.history.push('/signin');
    };

    private handleGeetestCaptchaSuccess = () => {
        this.setState({
            geetestCaptchaSuccess: true,
        });
    }

    private handleSignUp = () => {
        const {
            email,
            password,
            captcha_response,
            refId,
        } = this.state;

        const { i18n } = this.props;

        if (refId) {
            switch (captchaType()) {
                case 'none':
                    this.props.signUp({
                        email,
                        password,
                        refid: refId,
                        lang: i18n.toUpperCase(),
                    });
                    this.clearFields();
                    break;
                case 'recaptcha':
                case 'geetest':
                    this.props.signUp({
                        email,
                        password,
                        captcha_response,
                        refid: refId,
                    });
                    this.clearFields();
                    break;
                default:
                    this.props.signUp({
                        email,
                        password,
                        captcha_response,
                        refid: refId,
                        lang: i18n.toUpperCase(),
                    });
                    this.clearFields();
                    break;
            }
        } else {
            switch (captchaType()) {
                case 'none':
                    this.props.signUp({
                        email,
                        password,
                        lang: i18n.toUpperCase(),
                    });
                    break;
                case 'recaptcha':
                case 'geetest':
                default:
                    this.props.signUp({
                        email,
                        password,
                        captcha_response,
                        lang: i18n.toUpperCase(),
                    });
                    this.clearFields();
                    break;
            }
        }
    };

    private clearFields = () => {
        this.setState({
            email: '',
            password: '',
            confirmPassword: '',
            hasConfirmed: false,
            geetestCaptchaSuccess: false,
            refId: '',
        });
    }

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
                    block={true}
                    onClick={this.closeModal}
                    size="lg"
                    variant="primary"
                >
                    {this.props.intl.formatMessage({id: 'page.header.signUp.modal.footer'})}
                </Button>
            </div>
        );
    };

    private closeModal = () => {
        this.setState({showModal: false});
        this.props.history.push('/signin');
    };

    private extractRefID = (url: string) => new URLSearchParams(url).get('refid');

    private handleValidateForm = () => {
        const {email, password, confirmPassword} = this.state;
        const isEmailValid = email.match(EMAIL_REGEX);
        const isPasswordValid = password.match(PASSWORD_REGEX);
        const isConfirmPasswordValid = password === confirmPassword;

        if (!isEmailValid && !isPasswordValid) {
            this.setState({
                confirmationError: '',
                emailError: this.props.intl.formatMessage({ id: ERROR_INVALID_EMAIL }),
                passwordError: this.props.intl.formatMessage({ id: ERROR_INVALID_PASSWORD }),
                hasConfirmed: false,
            });
            return;
        }

        if (!isEmailValid) {
            this.setState({
                confirmationError: '',
                emailError: this.props.intl.formatMessage({ id: ERROR_INVALID_EMAIL }),
                passwordError: '',
                hasConfirmed: false,
            });
            return;
        }

        if (!isPasswordValid) {
            this.setState({
                confirmationError: '',
                emailError: '',
                passwordError: this.props.intl.formatMessage({ id: ERROR_INVALID_PASSWORD }),
                hasConfirmed: false,
            });
            return;
        }

        if (!isConfirmPasswordValid) {
            this.setState({
                confirmationError: this.props.intl.formatMessage({ id: ERROR_PASSWORD_CONFIRMATION }),
                emailError: '',
                passwordError: '',
                hasConfirmed: false,
            });
            return;
        }
    }
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    requireVerification: selectSignUpRequireVerification(state),
    i18n: selectCurrentLanguage(state),
});

const mapDispatchProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        signUp: credentials => dispatch(signUp(credentials)),
    });

// tslint:disable-next-line:no-any
const SignUpScreen = injectIntl(withRouter(connect(mapStateToProps, mapDispatchProps)(SignUp) as any));

export {
    SignUpScreen,
};
