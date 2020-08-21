import cx from 'classnames';
import { History } from 'history';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import ReCAPTCHA from 'react-google-recaptcha';
import {
    injectIntl,
} from 'react-intl';
import {
    connect,
    MapDispatchToPropsFunction,
    MapStateToProps,
} from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { Modal, SignUpForm } from '../../components';
import { GeetestCaptcha } from '../../containers';
import {
    EMAIL_REGEX,
    ERROR_INVALID_EMAIL,
    ERROR_INVALID_PASSWORD,
    ERROR_PASSWORD_CONFIRMATION,
    PASSWORD_REGEX,
    passwordErrorFirstSolution,
    passwordErrorSecondSolution,
    passwordErrorThirdSolution,
    setDocumentTitle,
} from '../../helpers';
import { IntlProps } from '../../index';
import {
    Configs,
    entropyPasswordFetch, LanguageState,
    RootState,
    selectConfigs,
    selectCurrentLanguage,
    selectCurrentPasswordEntropy,
    selectSignUpError,
    selectSignUpRequireVerification,
    signUp,
} from '../../modules';

interface ReduxProps {
    configs: Configs;
    requireVerification?: boolean;
    loading?: boolean;
    currentPasswordEntropy: number;
}

interface DispatchProps {
    signUp: typeof signUp;
    fetchCurrentPasswordEntropy: typeof entropyPasswordFetch;
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
        email: '',
        password: '',
        confirmPassword: '',
        captcha_response: '',
        reCaptchaSuccess: false,
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
        shouldGeetestReset: false,
        typingTimeout: 0,
        passwordErrorFirstSolved: false,
        passwordErrorSecondSolved: false,
        passwordErrorThirdSolved: false,
        passwordPopUp: false,
    };

    public constructor(props) {
        super(props);
        this.reCaptchaRef = React.createRef();
        this.geetestCaptchaRef = React.createRef();
    }

    private myRef = React.createRef<HTMLInputElement>();
    private passwordWrapper = React.createRef<HTMLDivElement>();
    private reCaptchaRef;
    private geetestCaptchaRef;

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

    public componentWillReceiveProps(nextProps: Props) {
        const { email } = this.state;

        if (nextProps.requireVerification) {
            nextProps.history.push('/email-verification', {email: email});
        }

        if (nextProps.signUpError) {
            if (this.reCaptchaRef.current) {
                this.reCaptchaRef.current.reset();
            }

            if (this.geetestCaptchaRef.current) {
                this.setState({ shouldGeetestReset: true });
            }
        }
    }

    public componentWillUnmount() {
        document.removeEventListener('click', this.handleOutsideClick, false);
    }

    public render() {
        const { configs, loading, currentPasswordEntropy } = this.props;
        const {
            email,
            password,
            confirmPassword,
            refId,
            captcha_response,
            reCaptchaSuccess,
            hasConfirmed,
            emailError,
            passwordError,
            confirmationError,
            emailFocused,
            passwordFocused,
            confirmPasswordFocused,
            refIdFocused,
            geetestCaptchaSuccess,
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
                        emailFocused={emailFocused}
                        passwordFocused={passwordFocused}
                        handleFocusEmail={this.handleFocusEmail}
                        handleFocusPassword={this.handleFocusPassword}
                        handleFocusConfirmPassword={this.handleFocusConfirmPassword}
                        handleFocusRefId={this.handleFocusRefId}
                        captchaType={configs.captcha_type}
                        renderCaptcha={this.renderCaptcha()}
                        reCaptchaSuccess={reCaptchaSuccess}
                        geetestCaptchaSuccess={geetestCaptchaSuccess}
                        captcha_response={captcha_response}
                        currentPasswordEntropy={currentPasswordEntropy}
                        minPasswordEntropy={configs.password_min_entropy}
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

    private translate = (key: string) => this.props.intl.formatMessage({id: key});

    private renderCaptcha = () => {
        const { configs } = this.props;
        const { shouldGeetestReset } = this.state;

        switch (configs.captcha_type) {
            case 'recaptcha':
                return (
                    <div className="cr-sign-up-form__recaptcha">
                        <ReCAPTCHA
                            ref={this.reCaptchaRef}
                            sitekey={configs.captcha_id}
                            onChange={this.handleReCaptchaSuccess}
                        />
                    </div>
                );
            case 'geetest':
                return (
                    <GeetestCaptcha
                        ref={this.geetestCaptchaRef}
                        shouldCaptchaReset={shouldGeetestReset}
                        onSuccess={this.handleGeetestCaptchaSuccess}
                    />
                );
            default:
                return null;

        }
    };

    private handleOutsideClick = event => {
        const wrapperElement = this.passwordWrapper.current;

        if (wrapperElement && !wrapperElement.contains(event.target)) {
            this.setState({
                passwordPopUp: false,
            });
        }
    };

    private handleCheckboxClick = event => {
        if (event) {
            event.preventDefault();

            this.setState({
                hasConfirmed: !this.state.hasConfirmed,
            });
        }
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

    private handleReCaptchaSuccess = (value: string) => {
        this.setState({
            reCaptchaSuccess: true,
            captcha_response: value,
        });
    };

    private handleGeetestCaptchaSuccess = value => {
        this.setState({
            geetestCaptchaSuccess: true,
            captcha_response: value,
            shouldGeetestReset: false,
        });
    };

    private handleSignUp = () => {
        const { configs, i18n } = this.props;
        const {
            email,
            password,
            captcha_response,
            refId,
        } = this.state;

        if (refId) {
            switch (configs.captcha_type) {
                case 'none':
                    this.props.signUp({
                        email,
                        password,
                        refid: refId,
                        data: JSON.stringify({
                            language: i18n,
                        }),
                    });
                    break;
                case 'recaptcha':
                case 'geetest':
                    this.props.signUp({
                        email,
                        password,
                        captcha_response,
                        refid: refId,
                    } as any);
                    break;
                default:
                    this.props.signUp({
                        email,
                        password,
                        captcha_response,
                        refid: refId,
                        data: JSON.stringify({
                            language: i18n,
                        }),
                    });
                    break;
            }
        } else {
            switch (configs.captcha_type) {
                case 'none':
                    this.props.signUp({
                        email,
                        password,
                        data: JSON.stringify({
                            language: i18n,
                        }),
                    });
                    break;
                case 'recaptcha':
                case 'geetest':
                default:
                    this.props.signUp({
                        email,
                        password,
                        captcha_response,
                        data: JSON.stringify({
                            language: i18n,
                        }),
                    });
                    break;
            }
        }

        this.setState({
            reCaptchaSuccess: false,
            geetestCaptchaSuccess: false,
            captcha_response: '',
        });
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
    };
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    configs: selectConfigs(state),
    i18n: selectCurrentLanguage(state),
    requireVerification: selectSignUpRequireVerification(state),
    signUpError: selectSignUpError(state),
    currentPasswordEntropy: selectCurrentPasswordEntropy(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        signUp: credentials => dispatch(signUp(credentials)),
        fetchCurrentPasswordEntropy: payload => dispatch(entropyPasswordFetch(payload)),
    });

export const SignUpScreen = compose(
    injectIntl,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps),
)(SignUp) as React.ComponentClass;
