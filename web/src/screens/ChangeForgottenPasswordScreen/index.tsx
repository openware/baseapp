import * as React from 'react';
import { injectIntl } from 'react-intl';
import {
  connect,
  MapDispatchToPropsFunction,
  MapStateToProps,
} from 'react-redux';
import { RouterProps, withRouter } from 'react-router';
import { compose } from 'redux';
import { IntlProps } from '../../';
import { ChangePassword } from '../../components';
import { setDocumentTitle } from '../../helpers';
import {
    changeForgotPasswordFetch,
    changeLanguage,
    entropyPasswordFetch,
    RootState, selectChangeForgotPasswordSuccess,
    selectCurrentPasswordEntropy,
    selectMobileDeviceState,
} from '../../modules';

interface ChangeForgottenPasswordState {
    confirmToken: string;
}

interface ReduxProps {
    changeForgotPassword?: boolean;
    isMobileDevice: boolean;
    currentPasswordEntropy: number;
}

interface DispatchProps {
    changeForgotPasswordFetch: typeof changeForgotPasswordFetch;
    changeLanguage: typeof changeLanguage;
    fetchCurrentPasswordEntropy: typeof entropyPasswordFetch;
}

interface HistoryProps {
    history: {
        location: {
            search: string;
        };
    };
}

type Props = RouterProps & DispatchProps & HistoryProps & ReduxProps & IntlProps;

class ChangeForgottenPasswordComponent extends React.Component<Props, ChangeForgottenPasswordState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            confirmToken: '',
        };
    }

    public componentDidMount() {
        setDocumentTitle('Change forgotten password');
        const { history } = this.props;
        const token = new URLSearchParams(history.location.search).get('reset_token');
        const lang = new URLSearchParams(history.location.search).get('lang');
        if (token) {
            this.setState({
                confirmToken: token,
            });
        }
        if (lang) {
            this.props.changeLanguage(lang.toLowerCase());
        }
    }

    public componentWillReceiveProps(next: Props) {
        if (next.changeForgotPassword && (!this.props.changeForgotPassword)) {
            this.props.history.push('/signin');
        }
    }

    public render() {
        const { isMobileDevice, currentPasswordEntropy } = this.props;

        return (
            <div className="pg-change-forgotten-password-screen">
                <div className="pg-change-forgotten-password-screen__container">
                    <ChangePassword
                        handleChangePassword={this.handleSendNewPassword}
                        title={!isMobileDevice && this.props.intl.formatMessage({id: 'page.header.signIn.resetPassword.title'})}
                        currentPasswordEntropy={currentPasswordEntropy}
                        fetchCurrentPasswordEntropy={this.props.fetchCurrentPasswordEntropy}
                        hideOldPassword={true}
                    />
                </div>
            </div>
        );
    }

    private handleSendNewPassword = payload => {
        const { confirmToken } = this.state;
        this.props.changeForgotPasswordFetch({
            ...payload,
            reset_password_token: confirmToken,
        });
    };
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    changeForgotPassword: selectChangeForgotPasswordSuccess(state),
    isMobileDevice: selectMobileDeviceState(state),
    currentPasswordEntropy: selectCurrentPasswordEntropy(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        changeForgotPasswordFetch: credentials => dispatch(changeForgotPasswordFetch(credentials)),
        changeLanguage: lang => dispatch(changeLanguage(lang)),
        fetchCurrentPasswordEntropy: payload => dispatch(entropyPasswordFetch(payload)),
    });

export const ChangeForgottenPasswordScreen = compose(
    injectIntl,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps),
)(ChangeForgottenPasswordComponent) as React.ComponentClass;
