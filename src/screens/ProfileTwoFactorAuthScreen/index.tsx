import { Button, Input } from '@openware/components';
import { History } from 'history';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { connect, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { CopyableTextField } from '../../components';
import { setDocumentTitle } from '../../helpers';
import { alertPush, RootState } from '../../modules';
import {
    generate2faQRFetch,
    selectTwoFactorAuthBarcode,
    selectTwoFactorAuthQR,
    selectTwoFactorAuthSuccess,
    toggle2faFetch,
    toggleUser2fa,
} from '../../modules/user/profile';

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
    toggleUser2fa: typeof toggleUser2fa;
    fetchSuccess: typeof alertPush;
}

type Props = RouterProps & ReduxProps & DispatchProps & InjectedIntlProps;

interface State {
    otpCode: string;
}

type CopyTypes = HTMLInputElement | null;

const copy = (id: string) => {
    const copyText: CopyTypes = document.querySelector(`#${id}`);

    if (copyText) {
        copyText.select();

        document.execCommand('copy');
        (window.getSelection() as any).removeAllRanges(); // tslint:disable-line
    }
};

class ToggleTwoFactorAuthComponent extends React.Component<Props, State> {
    public state = {
        otpCode: '',
    };

    public componentDidMount() {
        setDocumentTitle('Two factor authentication');
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

    public componentDidUpdate(prev: Props) {
        if (!prev.success && this.props.success) {
            this.props.toggleUser2fa();
        }
    }

    public translate = (e: string) => {
        return this.props.intl.formatMessage({ id: e });
    };

    public doCopy = () => {
        copy('referral-id');
        this.props.fetchSuccess({message: ['page.body.wallets.tabs.deposit.ccy.message.success'], type: 'success'});
    };

    public render() {
        const enable2fa = this.get2faAction();
        return (
            <div className="pg-profile-two-factor-auth">
                {this.renderToggle2fa(enable2fa)}
            </div>
        );
    }

    private renderToggle2fa = (enable2fa: boolean) => {
        const {
            barcode,
            qrUrl,
        } = this.props;
        const { otpCode } = this.state;

        const secretRegex = /secret=(\w+)/;
        const secretMatch = qrUrl.match(secretRegex);
        const secret = secretMatch ? secretMatch[1] : null;
        const submitHandler = enable2fa ? this.handleEnable2fa : this.handleDisable2fa;

        return (
            <div className="container mt-5 pg-profile-two-factor-auth__form p-0">
                <div className="row m-0 pg-profile-two-factor-auth__header">
                    <div className="col-11 col-lg-7 offset-lg-4 mt-0 p-0 pl-3">
                        {this.translate('page.body.profile.header.account.content.twoFactorAuthentication.header')}
                    </div>
                    <div className="col-1 mx-0 p-0 px-1" onClick={this.goBack}>
                        <img alt="" src={require('./close.svg')} />
                    </div>
                </div>

                <div className="row m-0 pg-profile-two-factor-auth__body">
                    <div className="col-12 col-lg-8 col-md-9 pr-0 pl-2 pg-profile-two-factor-auth__body--text d-inline-block">
                        <div className="row col-12 pg-profile-two-factor-auth__body--text--group">
                            <div className="d-inline">
                                <span>1   </span>
                                {this.translate('page.body.profile.header.account.content.twoFactorAuthentication.message.1')}
                                <a target="_blank" rel="noopener noreferrer" href="https://itunes.apple.com/ru/app/google-authenticator/id388497605?mt=8">AppStore </a>
                                {this.translate('page.body.profile.header.account.content.twoFactorAuthentication.message.or')}
                                <a target="_blank" rel="noopener noreferrer" href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl">Google play</a>
                            </div>
                        </div>
                        <div className="row col-12 pg-profile-two-factor-auth__body--text--group">
                            <div className="d-inline">
                                <span>2    </span>
                                {this.translate('page.body.profile.header.account.content.twoFactorAuthentication.message.2')}
                                <br />
                                {this.translate('page.body.profile.header.account.content.twoFactorAuthentication.message.3')}
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-4 col-md-3 pt-4 pg-profile-two-factor-auth__body--barcode">
                        {enable2fa && this.renderTwoFactorAuthQR(barcode)}
                    </div>
                </div>
                <div className="row m-0 p-5 pg-profile-two-factor-auth__copyablefield">
                    {enable2fa && secret && this.renderSecret(secret)}
                </div>
                <div className="row m-0 pg-profile-two-factor-auth__body">
                    <div className="col-12 pl-2 pg-profile-two-factor-auth__body--text d-inline-block">
                        <div className="row col-12 pg-profile-two-factor-auth__body--text--group">
                            <div className="col-12 col-md-8 col-sm-7">
                                <span>3   </span>
                                {this.translate('page.body.profile.header.account.content.twoFactorAuthentication.message.4')}
                            </div>
                            <div className="col-12 col-md-4 col-sm-5">
                                <fieldset className="pg-profile-two-factor-auth__body--input">
                                    <Input
                                        onChangeValue={this.handleOtpCodeChange}
                                        type="tel"
                                        value={otpCode}
                                        placeholder={this.translate('page.body.profile.header.account.content.twoFactorAuthentication.subHeader')}
                                        onKeyPress={this.handleEnterPress}
                                    />
                                </fieldset>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row p-5">
                    <div className="col-12 m-0">
                        <Button
                            className="p-3 m-0"
                            label={this.translate('page.body.profile.header.account.content.twoFactorAuthentication.enable')}
                            onClick={submitHandler}
                        />
                    </div>
                </div>
            </div>
        );
    };

    private renderTwoFactorAuthQR = (barcode: string) => {
        const src = `data:image/png;base64,${barcode}`;
        return barcode.length > 0 && <img alt="" className="pg-profile-two-factor-auth__qr" src={src} />;
    };

    private renderSecret = (secret: string) => {
        return (
            <fieldset onClick={this.doCopy}>
                <legend>
                    {this.translate('page.body.profile.header.account.content.twoFactorAuthentication.message.mfa')}
                </legend>
                {secret && <CopyableTextField value={secret} fieldId="secret-2fa" />}
            </fieldset>
        );
    };

    private handleOtpCodeChange = (value: string) => {
        this.setState({
            otpCode: value,
        });
    };

    private handleEnterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const enable2fa = this.get2faAction();
        const submitHandler = enable2fa ? this.handleEnable2fa : this.handleDisable2fa;
        if (event.key === 'Enter') {
            event.preventDefault();
            submitHandler();
        }
    };

    private handleEnable2fa = () => {
        this.props.toggle2fa({
            code: this.state.otpCode,
            enable: true,
        });
    };

    private handleDisable2fa = () => {
        this.props.toggle2fa({
            code: this.state.otpCode,
            enable: false,
        });
    };

    private handleNavigateToProfile = () => {
        this.props.history.push('/profile');
    };

    private get2faAction = () => {
        const routingState = this.props.history.location.state;
        return routingState ? routingState.enable2fa : false;
    };

    private goBack = () => {
        window.history.back();
    };
}

const mapStateToProps: MapStateToProps<ReduxProps, Props, RootState> = state => ({
    qrUrl: selectTwoFactorAuthQR(state),
    barcode: selectTwoFactorAuthBarcode(state),
    success: selectTwoFactorAuthSuccess(state),
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = dispatch => ({
    generateQR: () => dispatch(generate2faQRFetch()),
    toggle2fa: ({ code, enable }) => dispatch(toggle2faFetch({ code, enable })),
    toggleUser2fa: () => dispatch(toggleUser2fa()),
    fetchSuccess: payload => dispatch(alertPush(payload)),
});

const ProfileTwoFactorAuthScreen = injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(ToggleTwoFactorAuthComponent) as any));

export {
    ProfileTwoFactorAuthScreen,
};
