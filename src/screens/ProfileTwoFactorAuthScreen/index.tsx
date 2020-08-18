import { History } from 'history';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { CloseIcon } from '../../assets/images/CloseIcon';
import { CopyableTextField, CustomInput } from '../../components';
import { copy, setDocumentTitle } from '../../helpers';
import { IntlProps } from '../../index';
import { alertPush, RootState, selectMobileDeviceState } from '../../modules';
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
    isMobileDevice: boolean;
}

interface DispatchProps {
    toggle2fa: typeof toggle2faFetch;
    generateQR: typeof generate2faQRFetch;
    toggleUser2fa: typeof toggleUser2fa;
    fetchSuccess: typeof alertPush;
}

type Props = RouterProps & ReduxProps & DispatchProps & IntlProps;

interface State {
    otpCode: string;
}

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
                        <CloseIcon className="close-icon" />
                    </div>
                </div>

                <div className="row m-0 pg-profile-two-factor-auth__body">
                    <div className="col-12 col-lg-8 col-md-9 pr-0 pl-2 pg-profile-two-factor-auth__body--text d-inline-block">
                        <div className="row col-12 pg-profile-two-factor-auth__body--text--group">
                            <div className="d-inline">
                                <span className="cr-item-number">1   </span>
                                <span className="cr-item-text">{this.translate('page.body.profile.header.account.content.twoFactorAuthentication.message.1')}</span>
                                <a target="_blank" rel="noopener noreferrer" href="https://itunes.apple.com/ru/app/google-authenticator/id388497605?mt=8">AppStore </a>
                                <span className="cr-item-text">{this.translate('page.body.profile.header.account.content.twoFactorAuthentication.message.or')}</span>
                                <a target="_blank" rel="noopener noreferrer" href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl">Google play</a>
                            </div>
                        </div>
                        <div className="row col-12 pg-profile-two-factor-auth__body--text--group">
                            <div className="d-inline">
                                <span className="cr-item-number">2    </span>
                                <span className="cr-item-text">{this.translate('page.body.profile.header.account.content.twoFactorAuthentication.message.2')}</span>
                                <br />
                                <span className="cr-item-text">{this.translate('page.body.profile.header.account.content.twoFactorAuthentication.message.3')}</span>
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
                                <span className="cr-item-number">3   </span>
                                <span className="cr-item-text">{this.translate('page.body.profile.header.account.content.twoFactorAuthentication.message.4')}</span>
                            </div>
                            <div className="col-12 col-md-4 col-sm-5">
                                <fieldset className="pg-profile-two-factor-auth__body--input">
                                    <CustomInput
                                        handleChangeInput={this.handleOtpCodeChange}
                                        type="tel"
                                        inputValue={otpCode}
                                        placeholder={this.translate('page.body.profile.header.account.content.twoFactorAuthentication.subHeader')}
                                        onKeyPress={this.handleEnterPress}
                                        label={this.translate('page.body.profile.header.account.content.twoFactorAuthentication.subHeader')}
                                        defaultLabel=""
                                    />
                                </fieldset>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row p-5">
                    <div className="col-12 m-0">
                        <Button
                            onClick={submitHandler}
                            size="lg"
                            variant="primary"
                            type="button"
                            block={true}
                        >
                            {this.translate('page.body.profile.header.account.content.twoFactorAuthentication.enable')}
                        </Button>
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
            <div className="pg-profile-two-factor-auth__copyablefield__container">
                <legend>{this.translate('page.body.profile.header.account.content.twoFactorAuthentication.message.mfa')}</legend>
                <fieldset onClick={this.doCopy}>
                    {secret && <CopyableTextField
                        value={secret}
                        fieldId="secret-2fa"
                        label=""
                    />
                    }
                </fieldset>
            </div>
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
    isMobileDevice: selectMobileDeviceState(state),
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = dispatch => ({
    generateQR: () => dispatch(generate2faQRFetch()),
    toggle2fa: ({ code, enable }) => dispatch(toggle2faFetch({ code, enable })),
    toggleUser2fa: () => dispatch(toggleUser2fa()),
    fetchSuccess: payload => dispatch(alertPush(payload)),
});

export const ProfileTwoFactorAuthScreen = compose(
    injectIntl,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps),
)(ToggleTwoFactorAuthComponent) as React.ComponentClass;
