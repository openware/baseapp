import {
    Button,
    CopyableTextField,
    Input,
} from '@openware/components';
import { History } from 'history';
import * as React from 'react';
import {
    connect,
    MapDispatchToProps,
    MapStateToProps,
} from 'react-redux';
import { withRouter } from 'react-router-dom';
import { RootState } from '../../modules';
import {
    enableUser2fa,
    generate2faQRFetch,
    selectTwoFactorAuthBarcode,
    selectTwoFactorAuthError,
    selectTwoFactorAuthQR,
    selectTwoFactorAuthSuccess,
    toggle2faFetch,
} from '../../modules/profile';
import { CommonError } from '../../modules/types';

interface RouterProps {
    history: History;
}

// tslint:disable
interface ReduxProps {
    barcode: string;
    qrUrl: string;
    success?: boolean;
    error?: CommonError;
}

interface DispatchProps {
    toggle2fa: typeof toggle2faFetch;
    generateQR: typeof generate2faQRFetch;
    enableUser2fa: typeof enableUser2fa;
}

type Props = RouterProps & ReduxProps & DispatchProps;

interface State {
    otpCode: string;
}

class ToggleTwoFactorAuthComponent extends React.Component<Props, State> {
    public state = {
        otpCode: '',
    };

    public componentDidMount() {
        const enable2fa = this.get2faAction();
        if (enable2fa) {
            this.props.generateQR();
        }
    }

    public componentWillReceiveProps(next: Props) {
        if (!this.props.success && next.success) {
            this.handleNavigateToProfile();
        }
    }

    public render() {
        const enable2fa = this.get2faAction();
        return (
            <div className="pg-profile-two-factor-auth">
                {this.renderToggle2fa(enable2fa)}
            </div>
        );
    }

    public componentDidUpdate(prev: Props) {
        if (!prev.success && this.props.success) {
            this.props.enableUser2fa();
        }
    }

    private renderToggle2fa = (enable2fa: boolean) => {
        const { barcode, qrUrl, error } = this.props;
        const { otpCode } = this.state;

        const secretRegex = /secret=(\w+)/;
        const secretMatch = qrUrl.match(secretRegex);
        const secret = secretMatch ? secretMatch[1] : null;
        const actionLabel = enable2fa ? 'Enable' : 'Disable';
        const submitHandler = enable2fa ? this.handleEnable2fa : this.handleDisable2fa;

        return (
            <div className="pg-profile-two-factor-auth__form">
                <div className="pg-profile-two-factor-auth__header">
                    <h1 className="pg-profile-two-factor-auth__title">
                        {`${actionLabel} two factor authentication`}
                    </h1>
                    {enable2fa && this.renderTwoFactorAuthQR(barcode)}
                </div>
                <div className="pg-profile-two-factor-auth__form-group">
                    <label className="pg-profile-two-factor-auth-form-group__label">6-digit Google Authenticator code</label>
                    <Input
                        onChangeValue={this.handleOtpCodeChange}
                        type="tel"
                        value={otpCode}
                    />
                </div>
                <Button label={`${actionLabel} 2FA`} onClick={submitHandler} />
                <p className="pg-profile-two-factor-auth__error">{error && error.message}</p>
                {enable2fa && secret && this.renderSecret(secret)}
            </div>
        );
    }

    private renderTwoFactorAuthQR(barcode: string) {
        const src = `data:image/png;base64,${barcode}`;
        return barcode.length > 0 && <img className="pg-profile-two-factor-auth__qr" src={src} />;
    }

    private renderSecret(secret: string) {
        return (
            <React.Fragment>
                <p className="pg-profile-two-factor-auth__info">
                    This is your secret code that can be used to get access to your
                    2fa code from different devices and to restore access if your device was lost.
                    Be sure to save the code
                </p>
                {secret && <CopyableTextField value={secret} fieldId="secret-2fa" />}
            </React.Fragment>
        )
    }

    private handleOtpCodeChange = (value: string) => {
        this.setState({
            otpCode: value,
        });
    }

    private handleEnable2fa = () => {
        this.props.toggle2fa({
            code: this.state.otpCode,
            enable: true,
        });
    }

    private handleDisable2fa = () => {
        this.props.toggle2fa({
            code: this.state.otpCode,
            enable: false,
        });
    }

    private handleNavigateToProfile = () => {
        this.props.history.push('/profile');
    }

    private get2faAction = () => {
        const routingState = this.props.history.location.state;
        return routingState ? routingState.enable2fa : false;
    }
}

const mapStateToProps: MapStateToProps<ReduxProps, Props, RootState> = state => ({
    qrUrl: selectTwoFactorAuthQR(state),
    barcode: selectTwoFactorAuthBarcode(state),
    success: selectTwoFactorAuthSuccess(state),
    error: selectTwoFactorAuthError(state),
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = dispatch => ({
    generateQR: () => dispatch(generate2faQRFetch()),
    toggle2fa: ({ code, enable }) => dispatch(toggle2faFetch({ code, enable })),
    enableUser2fa: () => dispatch(enableUser2fa()),
});

const connected = connect(mapStateToProps, mapDispatchToProps)(ToggleTwoFactorAuthComponent);
// tslint:disable-next-line
const ToggleTwoFactorAuth = withRouter(connected as any);

export {
    ToggleTwoFactorAuth,
}
