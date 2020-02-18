import cr from 'classnames';
import * as React from 'react';
import { Button, InputGroup } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { CustomInput } from '../../../components';
import { IntlProps } from '../../../index';
import {
    changeUserLevel,
    resendCode,
    RootState,
    selectVerifyPhoneSuccess,
    sendCode,
    verifyPhone,
} from '../../../modules';

interface ReduxProps {
    verifyPhoneSuccess?: string;
}

interface PhoneState {
    phoneNumber: string;
    phoneNumberFocused: boolean;
    confirmationCode: string;
    confirmationCodeFocused: boolean;
    resendCode: boolean;
}

interface DispatchProps {
    resendCode: typeof resendCode;
    sendCode: typeof sendCode;
    verifyPhone: typeof verifyPhone;
    changeUserLevel: typeof changeUserLevel;
}

type Props = ReduxProps & DispatchProps & RouterProps & IntlProps;

class PhoneComponent extends React.Component<Props, PhoneState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            phoneNumber: '',
            phoneNumberFocused: false,
            confirmationCode: '',
            confirmationCodeFocused: false,
            resendCode: false,
        };
    }

    public componentDidUpdate(prevProps: Props) {
        const { history, verifyPhoneSuccess } = this.props;

        if (verifyPhoneSuccess !== prevProps.verifyPhoneSuccess) {
            history.push('/profile');
        }
    }

    public render() {
        const {
            phoneNumber,
            phoneNumberFocused,
            confirmationCode,
            confirmationCodeFocused,
        } = this.state;

        const phoneNumberFocusedClass = cr('pg-confirm__content-phone-col-content', {
            'pg-confirm__content-phone-col-content--focused': phoneNumberFocused,
        });

        const confirmationCodeFocusedClass = cr('pg-confirm__content-phone-col-content', {
            'pg-confirm__content-phone-col-content--focused': confirmationCodeFocused,
        });

        return (
            <div className="pg-confirm__content-phone">
                <div className="pg-confirm__content-phone-col">
                    <form>
                        <fieldset className={phoneNumberFocusedClass}>
                            <InputGroup>
                                <CustomInput
                                    label={phoneNumber ? this.translate('page.body.kyc.phone.phoneNumber') : ''}
                                    defaultLabel={phoneNumber ? this.translate('page.body.kyc.phone.phoneNumber') : ''}
                                    placeholder={this.translate('page.body.kyc.phone.phoneNumber')}
                                    type="tel"
                                    name="phone"
                                    autoComplete="tel"
                                    inputValue={phoneNumber}
                                    handleClick={this.addPlusSignToPhoneNumber}
                                    handleChangeInput={this.handleChangePhoneNumber}
                                    onKeyPress={this.handleSendEnterPress}
                                    autoFocus={true}
                                    handleFocusInput={this.handleFieldFocus('phoneNumber')}
                                />
                                <InputGroup.Append>
                                    <Button
                                        block={true}
                                        onClick={this.handleSendCode}
                                        size="lg"
                                        variant="primary"
                                        type="submit"
                                        disabled={!phoneNumber}
                                    >
                                        {this.state.resendCode ? this.translate('page.body.kyc.phone.resend') : this.translate('page.body.kyc.phone.send')}
                                    </Button>
                                </InputGroup.Append>
                            </InputGroup>
                        </fieldset>
                    </form>
                </div>
                <div className="pg-confirm__content-phone-col">
                    <fieldset className={confirmationCodeFocusedClass}>
                        <CustomInput
                            type="string"
                            label={confirmationCode ? this.translate('page.body.kyc.phone.code') : ''}
                            defaultLabel={confirmationCode ? this.translate('page.body.kyc.phone.code') : ''}
                            handleChangeInput={this.handleChangeConfirmationCode}
                            onKeyPress={this.handleConfirmEnterPress}
                            inputValue={confirmationCode}
                            placeholder={this.translate('page.body.kyc.phone.code')}
                            handleFocusInput={this.handleFieldFocus('confirmationCode')}
                        />
                    </fieldset>
                </div>
                <div className="pg-confirm__content-deep">
                    <Button
                        block={true}
                        onClick={this.confirmPhone}
                        size="lg"
                        variant="primary"
                        disabled={!confirmationCode}
                    >
                        {this.translate('page.body.kyc.next')}
                    </Button>
                </div>
            </div>
        );
    }

    private handleFieldFocus = (field: string) => {
        return() => {
            switch (field) {
                case 'phoneNumber':
                    this.addPlusSignToPhoneNumber();
                    this.setState(prev => ({
                        phoneNumberFocused: !prev.phoneNumberFocused,
                    }));
                    break;
                case 'confirmationCode':
                    this.setState({
                        confirmationCodeFocused: !this.state.confirmationCodeFocused,
                    });
                    break;
                default:
                    break;
            }
        };
    };

    private handleConfirmEnterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.confirmPhone();
        }
    };

    private handleSendEnterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.handleSendCode(event);
        }
    };

    private confirmPhone = () => {
        const requestProps = {
            phone_number: String(this.state.phoneNumber),
            verification_code: String(this.state.confirmationCode),
        };
        this.props.verifyPhone(requestProps);
    };

    private addPlusSignToPhoneNumber = () => {
        if (this.state.phoneNumber.length === 0) {
            this.setState({
                phoneNumber: '+',
            });
        }
    };

    private handleChangePhoneNumber = (value: string) => {
        if (this.inputPhoneNumber(value)) {
            this.setState({
                phoneNumber: value,
                resendCode: false,
            });
        }
    };

    private handleChangeConfirmationCode = (value: string) => {
        if (this.inputConfirmationCode(value)) {
            this.setState({
                confirmationCode: value,
            });
        }
    };

    private inputPhoneNumber = (value: string) => {
        const convertedText = value.trim();
        const condition = new RegExp('^(\\(?\\+?[0-9]*\\)?)?[0-9_\\- \\(\\)]*$');

        return condition.test(convertedText);
    };

    private inputConfirmationCode = (value: string) => {
        const convertedText = value.trim();
        const condition = new RegExp('^\\d*?$');

        return condition.test(convertedText);
    };

    private handleSendCode = event => {
        event.preventDefault();
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

    private translate = (id: string) => this.props.intl.formatMessage({ id });
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    verifyPhoneSuccess: selectVerifyPhoneSuccess(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        resendCode: phone => dispatch(resendCode(phone)),
        sendCode: phone => dispatch(sendCode(phone)),
        verifyPhone: payload => dispatch(verifyPhone(payload)),
        changeUserLevel: payload => dispatch(changeUserLevel(payload)),
    });

export const Phone = compose(
    injectIntl,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps),
)(PhoneComponent) as any; // tslint:disable-line
