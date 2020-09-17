import { History } from 'history';
import * as React from 'react';
import {Button, Spinner} from 'react-bootstrap';
import {
    injectIntl,
} from 'react-intl';
import { connect, MapStateToProps } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { Captcha } from '../../components';
import { EMAIL_REGEX, setDocumentTitle } from '../../helpers';
import { IntlProps } from '../../index';
import {
    Configs,
    emailVerificationFetch,
    RootState,
    selectConfigs,
    selectCurrentLanguage, selectMobileDeviceState,
    selectSendEmailVerificationError,
    selectSendEmailVerificationLoading,
    selectSendEmailVerificationSuccess,
} from '../../modules';
import { CommonError } from '../../modules/types';

interface OwnProps {
    history: History;
    location: {
        state: {
            email: string;
        };
    };
    success: boolean;
    error?: CommonError;
}

interface VerificationState {
    captcha_response: string;
    reCaptchaSuccess: boolean;
    geetestCaptchaSuccess: boolean;
    shouldGeetestReset: boolean;
}

interface DispatchProps {
    emailVerificationFetch: typeof emailVerificationFetch;
}

interface ReduxProps {
    emailVerificationLoading: boolean;
    isMobileDevice: boolean;
    configs: Configs;
}

type Props = DispatchProps & ReduxProps & OwnProps & IntlProps;

class EmailVerificationComponent extends React.Component<Props, VerificationState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            captcha_response: '',
            reCaptchaSuccess: false,
            geetestCaptchaSuccess: false,
            shouldGeetestReset: false,
        };
    }

    public componentDidMount() {
        setDocumentTitle('Email verification');
        if (!this.props.location.state || !this.props.location.state.email) {
            this.props.history.push('/signin');
        }
    }

    public translate = (id: string) => this.props.intl.formatMessage({ id });

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
        const { emailVerificationLoading, isMobileDevice } = this.props;

        const title = this.props.intl.formatMessage({ id: 'page.header.signUp.modal.header' });
        const text = this.props.intl.formatMessage({ id: 'page.header.signUp.modal.body' });
        const button = this.props.intl.formatMessage({ id: 'page.resendConfirmation' });

        return (
            <div className="pg-emailverification-container">
                <div className="pg-emailverification">
                    {!isMobileDevice && <div className="pg-emailverification-title">{title}</div>}
                    <div className="pg-emailverification-body">
                        <div className="pg-emailverification-body-text">{text}</div>
                        {this.renderCaptcha()}
                        {
                            !isMobileDevice && (
                                <div className="pg-emailverification-body-container">
                                    {emailVerificationLoading ? <Spinner animation="border" variant="primary"/> :
                                        <button className="pg-emailverification-body-container-button"
                                                onClick={this.handleClick}
                                                disabled={this.disableButton()}>{button}</button>}
                                </div>)
                        }
                        {isMobileDevice &&
                            (<div className="pg-emailverification-body-container">
                              <Button
                                block={true}
                                type="button"
                                onClick={this.handleClick}
                                size="lg"
                                variant="primary"
                              >
                                  {this.props.intl.formatMessage({ id:  'page.mobile.reset.header' })}
                              </Button>
                            </div>)
                        }
                    </div>
                </div>
            </div>
        );
    }

    private handleClick = () => {
        const { captcha_response } = this.state;
        const { configs } = this.props;

        switch (configs.captcha_type) {
            case 'recaptcha':
            case 'geetest':
                this.props.emailVerificationFetch({
                    email: this.props.location.state.email,
                    captcha_response,
                });
                break;
            default:
                this.props.emailVerificationFetch({
                    email: this.props.location.state.email,
                });
                break;
        }

        this.setState({
            reCaptchaSuccess: false,
            geetestCaptchaSuccess: false,
            captcha_response: '',
        });
    };

    private disableButton = (): boolean => {
        const { configs, location } = this.props;
        const { geetestCaptchaSuccess, reCaptchaSuccess } = this.state;

        if (location.state.email && !location.state.email.match(EMAIL_REGEX)) {
            return true;
        }

        if (configs.captcha_type === 'recaptcha' && !reCaptchaSuccess) {
            return true;
        }

        if (configs.captcha_type === 'geetest' && !geetestCaptchaSuccess) {
            return true;
        }

        return false;
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

    private setShouldGeetestReset = (value: boolean) => this.setState({ shouldGeetestReset: value });
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    emailVerificationLoading: selectSendEmailVerificationLoading(state),
    i18n: selectCurrentLanguage(state),
    isMobileDevice: selectMobileDeviceState(state),
    configs: selectConfigs(state),
    error: selectSendEmailVerificationError(state),
    success: selectSendEmailVerificationSuccess(state),
});

const mapDispatchToProps = {
    emailVerificationFetch,
};

export const EmailVerificationScreen = compose(
    injectIntl,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps),
)(EmailVerificationComponent) as React.ComponentClass;
