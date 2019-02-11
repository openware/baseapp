import {
    Button,
    CopyableTextField,
    Input,
} from '@openware/components';
import { History } from 'history';
import * as React from 'react';
import { InjectedIntlProps, injectIntl, intlShape } from 'react-intl';
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
    selectTwoFactorAuthQR,
    selectTwoFactorAuthSuccess,
    toggle2faFetch,
} from '../../modules/profile';

interface RouterProps {
    history: History;
}

interface ReduxProps {
    barcode: string;
    qrUrl: string;
    success?: boolean;
}

interface DispatchProps {
    toggle2fa: typeof toggle2faFetch;
    generateQR: typeof generate2faQRFetch;
    enableUser2fa: typeof enableUser2fa;
}

type Props = RouterProps & ReduxProps & DispatchProps & InjectedIntlProps;

interface State {
    otpCode: string;
}

class ToggleTwoFactorAuthComponent extends React.Component<Props, State> {
    //tslint:disable-next-line:no-any
    public static propsTypes: React.ValidationMap<any> = {
        intl: intlShape.isRequired,
    };
    public state = {
        otpCode: '',
    };

    public componentDidMount() {
        const enable2fa = this.get2faAction();
        if (enable2fa) {
            this.props.generateQR();
        }
    }
    public translate = (e: string) => {
        return this.props.intl.formatMessage({id: e});
    };

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
        const { barcode, qrUrl } = this.props;
        const { otpCode } = this.state;

        const secretRegex = /secret=(\w+)/;
        const secretMatch = qrUrl.match(secretRegex);
        const secret = secretMatch ? secretMatch[1] : null;
        const submitHandler = enable2fa ? this.handleEnable2fa : this.handleDisable2fa;

        return (
            <div className="pg-profile-two-factor-auth__form">
                <div className="pg-profile-two-factor-auth__header">
                    <h1 className="pg-profile-two-factor-auth__title">
                        {this.translate('page.body.profile.header.account.content.twoFactorAuthentication.header')}
                    </h1>
                    {enable2fa && this.renderTwoFactorAuthQR(barcode)}
                </div>
                <div className="pg-profile-two-factor-auth__form-group">
                    <label className="pg-profile-two-factor-auth-form-group__label">
                      {this.translate('page.body.profile.header.account.content.twoFactorAuthentication.subHeader')}
                    </label>
                    <Input
                        onChangeValue={this.handleOtpCodeChange}
                        type="tel"
                        value={otpCode}
                    />
                </div>
                <Button label={this.translate('page.body.profile.header.account.content.twoFactorAuthentication.enable')} onClick={submitHandler} />
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
                    {this.translate('page.body.profile.header.account.content.twoFactorAuthentication.info')}
                </p>
                {secret && <CopyableTextField value={secret} fieldId="secret-2fa" />}
            </React.Fragment>
        );
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
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = dispatch => ({
    generateQR: () => dispatch(generate2faQRFetch()),
    toggle2fa: ({ code, enable }) => dispatch(toggle2faFetch({ code, enable })),
    enableUser2fa: () => dispatch(enableUser2fa()),
});

const connected = injectIntl(connect(mapStateToProps, mapDispatchToProps)(ToggleTwoFactorAuthComponent));
// tslint:disable-next-line
const ToggleTwoFactorAuth = withRouter(connected as any);

export {
    ToggleTwoFactorAuth,
};
