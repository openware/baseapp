import * as React from 'react';
import {
    InjectedIntlProps,
    injectIntl,
} from 'react-intl';
import {
    connect,
    MapDispatchToPropsFunction,
    MapStateToProps,
} from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { EmailForm } from '../../components';
import {
    EMAIL_REGEX,
    ERROR_INVALID_EMAIL,
    setDocumentTitle,
} from '../../helpers';
import {
    forgotPassword,
    RootState,
    selectCurrentLanguage,
    selectForgotPasswordSuccess,
} from '../../modules';

interface ReduxProps {
    success: boolean;
}

interface DispatchProps {
    forgotPassword: typeof forgotPassword;
}

interface ForgotPasswordState {
    email: string;
    emailError: string;
    emailFocused: boolean;
}

type Props = RouterProps & ReduxProps & DispatchProps & InjectedIntlProps;

class ForgotPasswordComponent extends React.Component<Props, ForgotPasswordState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            email: '',
            emailError: '',
            emailFocused: false,
        };
    }

    public componentDidMount() {
        setDocumentTitle('Forgot password');
    }

    public render() {
        const {
            email,
            emailFocused,
            emailError,
        } = this.state;

        return (
            <div className="pg-forgot-password-screen">
                <div className="pg-forgot-password-screen__container">
                    <div className="pg-forgot-password___form">
                        <EmailForm
                            OnSubmit={this.handleChangeEmail}
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
                        />
                    </div>
                </div>
            </div>
        );
    }

    private handleChangeEmail = () => {
        const { email } = this.state;
        const { i18n } = this.props;
        this.props.forgotPassword({
            email,
            lang: i18n.toLowerCase(),
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
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    success: selectForgotPasswordSuccess(state),
    i18n: selectCurrentLanguage(state),
});

const mapDispatchProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        forgotPassword: credentials => dispatch(forgotPassword(credentials)),
    });

// tslint:disable-next-line:no-any
export const ForgotPasswordScreen = injectIntl(withRouter(connect(mapStateToProps, mapDispatchProps)(ForgotPasswordComponent) as any));
