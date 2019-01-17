import {
    Button,
} from '@openware/components';
import * as React from 'react';
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
}

interface DispatchProps {
    resendCode: typeof resendCode;
    sendCode: typeof sendCode;
    verifyPhone: typeof verifyPhone;
}

type Props = ReduxProps & DispatchProps;

class PhoneComponent extends React.Component<Props, PhoneState> {
    constructor(props: Props) {
        super(props);

        this.state = {
          phoneNumber: '',
          confirmationCode: '',
        };
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
                <div className="pg-confirm__content-phone-row">
                    <div className="pg-confirm__content-phone-row-text">
                        Phone Number
                    </div>
                    <div className="pg-confirm__content-phone-row-content">
                        <input
                            className="pg-confirm__content-phone-row-content-number"
                            type="string"
                            placeholder="+"
                            value={phoneNumber}
                            onChange={this.handleChangeNumber}
                        />
                        <button
                            className="pg-confirm__content-phone-row-content-send"
                            type="button"
                            onClick={this.handleSendCode}
                        >
                            Send code
                        </button>
                    </div>
                </div>
                <div className="pg-confirm__content-phone-row">
                    <div className="pg-confirm__content-phone-row-text">
                        SMS Confirmation Code
                    </div>
                    <div className="pg-confirm__content-phone-row-content">
                        <input
                            className="pg-confirm__content-phone-row-content-number"
                            type="string"
                            placeholder="Code"
                            value={confirmationCode}
                            onChange={this.handleConfirmNumber}
                        />
                        <button
                            className="pg-confirm__content-phone-row-content-send"
                            type="button"
                            onClick={this.handleResendCode}
                        >
                            Resend code
                        </button>
                    </div>
                </div>
                {showError && <p className="pg-confirm__error">{(verifyPhoneError || { message: '' }).message}</p>}
                {verifyPhoneSuccess && <p className="pg-confirm__success">{verifyPhoneSuccess}</p>}
                <div className="pg-confirm__content-deep">
                    <Button
                        className="pg-confirm__content-phone-deep-button"
                        label="Next"
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
        this.setState({
            phoneNumber: e.target.value,
        });
    };

    private handleConfirmNumber = (e: OnChangeEvent) => {
        this.setState({
            confirmationCode: e.target.value,
        });
    };

    private handleSendCode = () => {
        const requestProps = {
            phone_number: String(this.state.phoneNumber),
        };
        this.props.sendCode(requestProps);
    };

    private handleResendCode = () => {
        const requestProps = {
            phone_number: String(this.state.phoneNumber),
        };
        this.props.resendCode(requestProps);
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
    });

// tslint:disable-next-line
export const Phone = connect(mapStateToProps, mapDispatchProps)(PhoneComponent) as any;
