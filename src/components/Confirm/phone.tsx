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
    currentAction: string;
}

interface DispatchProps {
    resendCode: typeof resendCode;
    sendCode: typeof sendCode;
    verifyPhone: typeof verifyPhone;
    changeUserLevel: typeof changeUserLevel;
}

type Props = ReduxProps & DispatchProps;

class PhoneComponent extends React.Component<Props, PhoneState> {
    constructor(props: Props) {
        super(props);

        this.state = {
          phoneNumber: '',
          confirmationCode: '',
          currentAction: 'SEND CODE',
        };
    }

    public componentDidUpdate(prev: Props) {
        if (!prev.verifyPhoneSuccess && this.props.verifyPhoneSuccess) {
            this.props.changeUserLevel({ level: 2 });
        }
    }

    public render() {
        const { phoneNumber, confirmationCode, currentAction } = this.state;
        const {
            verifyPhoneError,
            verifyPhoneSuccess,
        } = this.props;
        const showError = verifyPhoneError && !verifyPhoneSuccess;
        return (
            <div className="pg-confirm__content-phone">
                <h2 className="pg-confirm__content-phone-head">Lets Verify your phone</h2>
                <div className="pg-confirm__content-phone-col">
                    <p className="pg-confirm__content-phone-col-text">
                        1. Enter your Phone number
                    </p>
                    <div className="pg-confirm__content-phone-col-content">
                        <input
                            className="pg-confirm__content-phone-col-content-number"
                            type="string"
                            placeholder="Phone Number"
                            value={phoneNumber}
                            onChange={this.handleChangeNumber}
                        />
                        <button
                            className="pg-confirm__content-phone-col-content-send"
                            type="button"
                            onClick={this.handleSendCode}
                        >
                            {currentAction}
                        </button>
                    </div>
                </div>
                <div className="pg-confirm__content-phone-col">
                    <p className="pg-confirm__content-phone-col-text">
                        2. Enter Code that you received
                    </p>
                    <div className="pg-confirm__content-phone-col-content">
                        <input
                            className="pg-confirm__content-phone-col-content-number"
                            type="string"
                            placeholder="SMS Code"
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
        if (this.state.currentAction === 'SEND CODE') {
          this.props.sendCode(requestProps);
          this.setState({
              currentAction: 'RESEND CODE',
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
export const Phone = connect(mapStateToProps, mapDispatchProps)(PhoneComponent) as any;
