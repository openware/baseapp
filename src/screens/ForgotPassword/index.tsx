import * as React from 'react';
import {
    injectIntl,
} from 'react-intl';
import {
    connect,
    MapDispatchToPropsFunction,
    MapStateToProps,
} from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { Captcha, EmailForm } from '../../components';
import {
    EMAIL_REGEX,
    ERROR_INVALID_EMAIL,
    setDocumentTitle,
} from '../../helpers';
import { IntlProps } from '../../index';
import {
    Configs,
    forgotPassword,
    RootState,
    selectConfigs,
    selectCurrentLanguage,
    selectForgotPasswordError,
    selectForgotPasswordSuccess,
} from '../../modules';
import { CommonError } from '../../modules/types';

interface ReduxProps {
    success: boolean;
    error?: CommonError;
    configs: Configs;
}

interface DispatchProps {
    forgotPassword: typeof forgotPassword;
}

interface ForgotPasswordState {
    email: string;
    emailError: string;
    emailFocused: boolean;
    captcha_response: string;
    reCaptchaSuccess: boolean;
    geetestCaptchaSuccess: boolean;
    shouldGeetestReset: boolean;
}

type Props = RouterProps & ReduxProps & DispatchProps & IntlProps;

class ForgotPasswordComponent extends React.Component<Props, ForgotPasswordState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            email: '',
            emailError: '',
            emailFocused: false,
            captcha_response: '',
            reCaptchaSuccess: false,
            geetestCaptchaSuccess: false,
            shouldGeetestReset: false,
        };
    }

    public componentDidMount() {
        setDocumentTitle('Forgot password');
    }

    public renderCaptcha = () => {
        const { shouldGeetestReset } = this.state;
        const { error, success } = this.props;

        return (
            <Captcha
                error={error}
                success={success}
                shouldGeetestReset={shouldGeetestReset}
                setShouldGeetestReset={this.setShouldGeetestReset}
                handleReCaptchaSuccess={this.handleReCaptchaSuccess}
                handleGeetestCaptchaSuccess={this.handleGeetestCaptchaSuccess}
            />
        );
    };

    public render() {
        const {
            email,
            emailFocused,
            emailError,
            captcha_response,
            reCaptchaSuccess,
            geetestCaptchaSuccess,
        } = this.state;
        const { configs } = this.props;

        return (
            <div className="pg-forgot-password-screen" onKeyPress={this.handleEnterPress}>
                <div className="pg-forgot-password-screen__container">
                    <div className="pg-forgot-password___form">
                        <EmailForm
                            OnSubmit={this.handleChangePassword}
                            title={this.props.intl.formatMessage({id: 'page.forgotPassword'})}
                            emailLabel={this.props.intl.formatMessage({id: 'page.forgotPassword.email'})}
                            buttonLabel={this.props.intl.formatMessage({id: 'page.forgotPassword.send'})}
                            email={email}
                            emailFocused={emailFocused}
                            emailError={emailError}
                            message={this.props.intl.formatMessage({id: 'page.forgotPassword.message'})}
                            validateForm={this.validateForm}
                            handleInputEmail={this.handleInputEmail}
                            handleFieldFocus={this.handleFocusEmail}
                            handleReturnBack={this.handleComeBack}
                            captchaType={configs.captcha_type}
                            renderCaptcha={this.renderCaptcha()}
                            reCaptchaSuccess={reCaptchaSuccess}
                            geetestCaptchaSuccess={geetestCaptchaSuccess}
                            captcha_response={captcha_response}
                        />
                    </div>
                </div>
            </div>
        );
    }

    private setShouldGeetestReset = (value: boolean) => this.setState({ shouldGeetestReset: value });

    private handleChangePassword = () => {
        const { email, captcha_response } = this.state;
        const { configs } = this.props;

        switch (configs.captcha_type) {
            case 'recaptcha':
            case 'geetest':
                this.props.forgotPassword({ email, captcha_response });
                break;
            default:
                this.props.forgotPassword({ email });
                break;
        }

        this.setState({
            reCaptchaSuccess: false,
            geetestCaptchaSuccess: false,
            captcha_response: '',
        });
    };

    private handleFocusEmail = () => {
        this.setState({
            emailFocused: !this.state.emailFocused,
        });
    };

    private handleInputEmail = (value: string) => {
        this.setState({
            email: value,
        });
    };

    private validateForm = () => {
        const { email } = this.state;

        const isEmailValid = email ? email.match(EMAIL_REGEX) : true;

        if (!isEmailValid) {
            this.setState({
                emailError: ERROR_INVALID_EMAIL,
            });

            return;
        }
    };

    private handleComeBack = () => {
        this.props.history.goBack();
    };

    private handleEnterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();

            this.handleChangePassword();
        }
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
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    success: selectForgotPasswordSuccess(state),
    error: selectForgotPasswordError(state),
    i18n: selectCurrentLanguage(state),
    configs: selectConfigs(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        forgotPassword: credentials => dispatch(forgotPassword(credentials)),
    });

export const ForgotPasswordScreen = compose(
    injectIntl,
withRouter,
    connect(mapStateToProps, mapDispatchToProps),
)(ForgotPasswordComponent) as React.ComponentClass;
