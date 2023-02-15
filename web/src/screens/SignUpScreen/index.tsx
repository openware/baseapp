import cx from 'classnames';
import { History } from 'history';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { isUsernameEnabled } from '../../api';
import { captchaType } from '../../api/config';
import { Captcha, Modal, SignUpForm } from '../../components';
import {
    EMAIL_REGEX,
    ERROR_INVALID_EMAIL,
    ERROR_INVALID_PASSWORD,
    ERROR_PASSWORD_CONFIRMATION,
    passwordErrorFirstSolution,
    passwordErrorSecondSolution,
    passwordErrorThirdSolution,
    PASSWORD_REGEX,
    setDocumentTitle,
} from '../../helpers';
import { IntlProps } from '../../index';
import {
    entropyPasswordFetch,
    GeetestCaptchaResponse,
    LanguageState,
    resetCaptchaState,
    RootState,
    selectCaptchaResponse,
    selectCurrentLanguage,
    selectCurrentPasswordEntropy,
    selectGeetestCaptchaSuccess,
    selectRecaptchaSuccess,
    selectSignUpError,
    selectSignUpRequireVerification,
    signUp,
} from '../../modules';

interface ReduxProps {
    requireVerification?: boolean;
    loading?: boolean;
    currentPasswordEntropy: number;
    captcha_response?: string | GeetestCaptchaResponse;
    reCaptchaSuccess: boolean;
    geetestCaptchaSuccess: boolean;
}

interface DispatchProps {
    signUp: typeof signUp;
    fetchCurrentPasswordEntropy: typeof entropyPasswordFetch;
    resetCaptchaState: typeof resetCaptchaState;
}

interface RouterProps {
    location: {
        search: string;
    };
    history: History;
}

interface OwnProps {
    signUpError: boolean;
    i18n: LanguageState['lang'];
}

type Props = ReduxProps & DispatchProps & RouterProps & IntlProps & OwnProps;

export const extractRefID = (props: RouterProps) => new URLSearchParams(props.location.search).get('refid');

class SignUp extends React.Component<Props> {
    public readonly state = {
        showModal: false,
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        refId: '',
        hasConfirmed: false,
        emailError: '',
        passwordError: '',
        confirmationError: '',
        usernameFocused: false,
        emailFocused: false,
        passwordFocused: false,
        confirmPasswordFocused: false,
        refIdFocused: false,
        typingTimeout: 0,
        passwordErrorFirstSolved: false,
        passwordErrorSecondSolved: false,
        passwordErrorThirdSolved: false,
        passwordPopUp: false,
    };

    private myRef = React.createRef<HTMLInputElement>();
    private passwordWrapper = React.createRef<HTMLDivElement>();

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

        document.addEventListener('click', this.handleOutsideClick, false);
    }

    public componentDidUpdate(prev: Props) {
        const { email } = this.state;

        if (!prev.requireVerification && this.props.requireVerification) {
            this.props.history.push('/email-verification', { email: email });
        }
    }

    public componentWillUnmount() {
        document.removeEventListener('click', this.handleOutsideClick, false);
    }

    public renderCaptcha = () => {
        const { signUpError } = this.props;
        const { confirmationError, emailError } = this.state;

        const error = signUpError || confirmationError || emailError;

        return <Captcha error={error} />;
    };

    public render() {
        const { loading, currentPasswordEntropy, captcha_response, reCaptchaSuccess, geetestCaptchaSuccess } =
            this.props;
        const {
            username,
            email,
            password,
            confirmPassword,
            refId,
            hasConfirmed,
            emailError,
            passwordError,
            confirmationError,
            usernameFocused,
            emailFocused,
            passwordFocused,
            confirmPasswordFocused,
            refIdFocused,
            passwordErrorFirstSolved,
            passwordErrorSecondSolved,
            passwordErrorThirdSolved,
            passwordPopUp,
        } = this.state;

        const className = cx('pg-sign-up-screen__container', { loading });

        return (
            <div className="pg-sign-up-screen">
                <div className={className}>
                    <SignUpForm
                        labelSignIn={this.props.intl.formatMessage({ id: 'page.header.signIn' })}
                        labelSignUp={this.props.intl.formatMessage({ id: 'page.header.signUp' })}
                        emailLabel={this.props.intl.formatMessage({
                            id: 'page.header.signUp.email',
                        })}
                        passwordLabel={this.props.intl.formatMessage({
                            id: 'page.header.signUp.password',
                        })}
                        confirmPasswordLabel={this.props.intl.formatMessage({
                            id: 'page.header.signUp.confirmPassword',
                        })}
                        referalCodeLabel={this.props.intl.formatMessage({
                            id: 'page.header.signUp.referalCode',
                        })}
                        termsMessage={this.props.intl.formatMessage({
                            id: 'page.header.signUp.terms',
                        })}
                        refId={refId}
                        handleChangeRefId={this.handleChangeRefId}
                        isLoading={loading}
                        onSignIn={this.handleSignIn}
                        onSignUp={this.handleSignUp}
                        username={username}
                        handleChangeUsername={this.handleChangeUsername}
                        email={email}
                        handleChangeEmail={this.handleChangeEmail}
                        password={password}
                        handleChangePassword={this.handleChangePassword}
                        confirmPassword={confirmPassword}
                        handleChangeConfirmPassword={this.handleChangeConfirmPassword}
                        hasConfirmed={hasConfirmed}
                        clickCheckBox={this.handleCheckboxClick}
                        validateForm={this.handleValidateForm}
                        emailError={emailError}
                        passwordError={passwordError}
                        confirmationError={confirmationError}
                        confirmPasswordFocused={confirmPasswordFocused}
                        refIdFocused={refIdFocused}
                        usernameFocused={usernameFocused}
                        emailFocused={emailFocused}
                        passwordFocused={passwordFocused}
                        handleFocusUsername={this.handleFocusUsername}
                        handleFocusEmail={this.handleFocusEmail}
                        handleFocusPassword={this.handleFocusPassword}
                        handleFocusConfirmPassword={this.handleFocusConfirmPassword}
                        handleFocusRefId={this.handleFocusRefId}
                        renderCaptcha={this.renderCaptcha()}
                        reCaptchaSuccess={reCaptchaSuccess}
                        geetestCaptchaSuccess={geetestCaptchaSuccess}
                        captcha_response={captcha_response}
                        currentPasswordEntropy={currentPasswordEntropy}
                        passwordErrorFirstSolved={passwordErrorFirstSolved}
                        passwordErrorSecondSolved={passwordErrorSecondSolved}
                        passwordErrorThirdSolved={passwordErrorThirdSolved}
                        passwordPopUp={passwordPopUp}
                        myRef={this.myRef}
                        passwordWrapper={this.passwordWrapper}
                        translate={this.translate}
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

    private translate = (key: string) => this.props.intl.formatMessage({ id: key });

    private handleOutsideClick = (event) => {
        const wrapperElement = this.passwordWrapper.current;

        if (wrapperElement && !wrapperElement.contains(event.target)) {
            this.setState({
                passwordPopUp: false,
            });
        }
    };

    private handleCheckboxClick = (event) => {
        if (event) {
            event.preventDefault();

            this.setState({
                hasConfirmed: !this.state.hasConfirmed,
            });
            this.clearFields();
        }
    };

    private handleChangeUsername = (value: string) => {
        this.setState({
            username: value.replace(/[^A-Za-z0-9]+/g, '').toLowerCase(),
        });
    };

    private handleChangeEmail = (value: string) => {
        this.setState({
            email: value,
        });
    };

    private handleChangePassword = (value: string) => {
        const { passwordErrorFirstSolved, passwordErrorSecondSolved, passwordErrorThirdSolved } = this.state;

        if (passwordErrorFirstSolution(value) && !passwordErrorFirstSolved) {
            this.setState({
                passwordErrorFirstSolved: true,
            });
        } else if (!passwordErrorFirstSolution(value) && passwordErrorFirstSolved) {
            this.setState({
                passwordErrorFirstSolved: false,
            });
        }

        if (passwordErrorSecondSolution(value) && !passwordErrorSecondSolved) {
            this.setState({
                passwordErrorSecondSolved: true,
            });
        } else if (!passwordErrorSecondSolution(value) && passwordErrorSecondSolved) {
            this.setState({
                passwordErrorSecondSolved: false,
            });
        }

        if (passwordErrorThirdSolution(value) && !passwordErrorThirdSolved) {
            this.setState({
                passwordErrorThirdSolved: true,
            });
        } else if (!passwordErrorThirdSolution(value) && passwordErrorThirdSolved) {
            this.setState({
                passwordErrorThirdSolved: false,
            });
        }

        if (this.state.typingTimeout) {
            clearTimeout(this.state.typingTimeout);
        }

        this.setState({
            password: value,
            typingTimeout: setTimeout(() => {
                this.props.fetchCurrentPasswordEntropy({ password: value });
            }, 500),
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

    private handleFocusUsername = () => {
        this.setState({
            usernameFocused: !this.state.usernameFocused,
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
            passwordPopUp: !this.state.passwordPopUp,
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

    private handleSignUp = () => {
        const { i18n, captcha_response } = this.props;
        const { username, email, password, refId } = this.state;
        const payload = {
            email,
            password,
            data: JSON.stringify({
                language: i18n,
            }),
            ...(isUsernameEnabled() && { username }),
            ...(refId && { refid: refId }),
            ...(captchaType() !== 'none' && { captcha_response }),
        };

        this.props.signUp(payload);
        this.props.resetCaptchaState();
    };

    private renderModalHeader = () => {
        return (
            <div className="pg-exchange-modal-submit-header">
                {this.props.intl.formatMessage({ id: 'page.header.signUp.modal.header' })}
            </div>
        );
    };

    private renderModalBody = () => {
        return (
            <div className="pg-exchange-modal-submit-body">
                <h2>{this.props.intl.formatMessage({ id: 'page.header.signUp.modal.body' })}</h2>
            </div>
        );
    };

    private renderModalFooter = () => {
        return (
            <div className="pg-exchange-modal-submit-footer">
                <Button block={true} onClick={this.closeModal} size="lg" variant="primary">
                    {this.props.intl.formatMessage({ id: 'page.header.signUp.modal.footer' })}
                </Button>
            </div>
        );
    };

    private closeModal = () => {
        this.setState({ showModal: false });
        this.props.history.push('/signin');
    };

    private extractRefID = (url: string) => new URLSearchParams(url).get('refid');

    private handleValidateForm = () => {
        const { email, password, confirmPassword } = this.state;
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
                confirmationError: this.props.intl.formatMessage({
                    id: ERROR_PASSWORD_CONFIRMATION,
                }),
                emailError: '',
                passwordError: '',
                hasConfirmed: false,
            });

            return;
        }
    };

    private clearFields = () => {
        this.setState({
            confirmationError: '',
            emailError: '',
            passwordError: '',
        });
    };
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = (state) => ({
    i18n: selectCurrentLanguage(state),
    requireVerification: selectSignUpRequireVerification(state),
    signUpError: selectSignUpError(state),
    currentPasswordEntropy: selectCurrentPasswordEntropy(state),
    captcha_response: selectCaptchaResponse(state),
    reCaptchaSuccess: selectRecaptchaSuccess(state),
    geetestCaptchaSuccess: selectGeetestCaptchaSuccess(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = (dispatch) => ({
    signUp: (credentials) => dispatch(signUp(credentials)),
    fetchCurrentPasswordEntropy: (payload) => dispatch(entropyPasswordFetch(payload)),
    resetCaptchaState: () => dispatch(resetCaptchaState()),
});

export const SignUpScreen = compose(
    injectIntl,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps),
)(SignUp) as React.ComponentClass;
