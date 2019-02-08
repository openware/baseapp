import {
    Button,
} from '@openware/components';
import * as React from 'react';
import { InjectedIntlProps, injectIntl, intlShape } from 'react-intl';
import {
  connect,
  MapDispatchToPropsFunction,
} from 'react-redux';
import { RootState } from '../../modules';
import {
    resendCode,
    selectVerifyPhoneError,
    selectVerifyPhoneSuccess,
    sendCode,
    verifyPhone,
} from '../../modules/kyc/phone';
import { changeUserLevel } from '../../modules/profile';
import { CommonError } from '../../modules/types';

interface ReduxProps {
    verifyPhoneError?: CommonError;
    verifyPhoneSuccess?: string;
}

interface OnChangeEvent {
    target: {
        value: string;
    };
}

interface PhoneState {
    phoneNumber: string;
    confirmationCode: string;
    resendCode: boolean;
}

interface DispatchProps {
    resendCode: typeof resendCode;
    sendCode: typeof sendCode;
    verifyPhone: typeof verifyPhone;
    changeUserLevel: typeof changeUserLevel;
}

type Props = ReduxProps & DispatchProps & InjectedIntlProps;

class PhoneComponent extends React.Component<Props, PhoneState> {
    //tslint:disable-next-line:no-any
    public static propsTypes: React.ValidationMap<any> = {
        intl: intlShape.isRequired,
    };
    constructor(props: Props) {
        super(props);

        this.state = {
            phoneNumber: '',
            confirmationCode: '',
            resendCode: false,
        };
    }

    public translate = (e: string) => {
        return this.props.intl.formatMessage({id: e});
    };

    public componentDidUpdate(prev: Props) {
        if (!prev.verifyPhoneSuccess && this.props.verifyPhoneSuccess) {
            this.props.changeUserLevel({ level: 2 });
        }
    }

    public render() {
        const { phoneNumber, confirmationCode } = this.state;
        const {
            verifyPhoneError,
            verifyPhoneSuccess,
        } = this.props;
        const showError = verifyPhoneError && !verifyPhoneSuccess;
        return (
            <div className="pg-confirm__content-phone">
                <h2 className="pg-confirm__content-phone-head">{this.translate('page.body.kyc.phone.head')}</h2>
                <div className="pg-confirm__content-phone-col">
                    <p className="pg-confirm__content-phone-col-text">
                        1. {this.translate('page.body.kyc.phone.enterPhone')}
                    </p>
                    <div className="pg-confirm__content-phone-col-content">
                        <input
                            className="pg-confirm__content-phone-col-content-number"
                            type="string"
                            placeholder={this.translate('page.body.kyc.phone.phoneNumber')}
                            value={phoneNumber}
                            onChange={this.handleChangeNumber}
                        />
                        <button
                            className="pg-confirm__content-phone-col-content-send"
                            type="button"
                            onClick={this.handleSendCode}
                        >
                            {this.state.resendCode ? this.translate('page.body.kyc.phone.resend') : this.translate('page.body.kyc.phone.send')}
                        </button>
                    </div>
                </div>
                <div className="pg-confirm__content-phone-col">
                    <p className="pg-confirm__content-phone-col-text">
                        2. {this.translate('page.body.kyc.phone.enterCode')}
                    </p>
                    <div className="pg-confirm__content-phone-col-content">
                        <input
                            className="pg-confirm__content-phone-col-content-number"
                            type="string"
                            placeholder={this.translate('page.body.kyc.phone.code')}
                            value={confirmationCode}
                            onChange={this.handleConfirmNumber}
                        />
                    </div>
                </div>
                {showError && <p className="pg-confirm__error">{(verifyPhoneError || { message: '' }).message}</p>}
                {verifyPhoneSuccess && <p className="pg-confirm__success">{verifyPhoneSuccess}</p>}
                <div className="pg-confirm__content-deep">
                    <Button
                        className="pg-confirm__content-phone-deep-button"
                        label={this.translate('page.body.kyc.next')}
                        onClick={this.confirmPhone}
                    />
                </div>
            </div>
        );
    }

    private confirmPhone = () => {
        const requestProps = {
            phone_number: String(this.state.phoneNumber),
            verification_code: String(this.state.confirmationCode),
        };
        this.props.verifyPhone(requestProps);
    }

    private handleChangeNumber = (e: OnChangeEvent) => {
        if (this.inputNumber(e)) {
            this.setState({
                phoneNumber: e.target.value,
            });
        }
    }

    private inputNumber = (e: OnChangeEvent) => {
        const convertedText = e.target.value.trim();
        const condition = new RegExp('^\\+\\d*?$');
        return condition.test(convertedText);
    }

    private handleConfirmNumber = (e: OnChangeEvent) => {
        if (this.inputNumber(e)) {
            this.setState({
                confirmationCode: e.target.value,
            });
        }
    };

    private handleSendCode = () => {
        const requestProps = {
            phone_number: String(this.state.phoneNumber),
        };
        if (!this.state.resendCode) {
          this.props.sendCode(requestProps);
          this.setState({
              resendCode: true,
          });
        } else {
          this.props.resendCode(requestProps);
        }
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    verifyPhoneError: selectVerifyPhoneError(state),
    verifyPhoneSuccess: selectVerifyPhoneSuccess(state),
});

const mapDispatchProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        resendCode: phone => dispatch(resendCode(phone)),
        sendCode: phone => dispatch(sendCode(phone)),
        verifyPhone: payload => dispatch(verifyPhone(payload)),
        changeUserLevel: payload => dispatch(changeUserLevel(payload)),
    });

// tslint:disable-next-line
export const Phone = injectIntl(connect(mapStateToProps, mapDispatchProps)(PhoneComponent) as any);
