import * as React from 'react';
import { SetupFormInput } from '..';
import { Button } from 'react-bootstrap';
import { EMAIL_REGEX, ERROR_INVALID_EMAIL, ERROR_INVALID_PASSWORD, ERROR_PASSWORD_CONFIRMATION, PASSWORD_REGEX } from 'src/helpers';
import {
    injectIntl,
} from 'react-intl';
import { IntlProps } from '../../../index';
import { compose } from 'redux';

export interface SetupRegisterFormProps {
    handleRegister: (email: string, password: string, confirmPassword: string) => void;
}

interface SetupRegisterFormState {
    email: string;
    password: string;
    confirmPassword: string;
    hasConfirmed: boolean;
    emailError: string;
    passwordError: string;
    confirmationError: string;
}

type Props = SetupRegisterFormProps & IntlProps;

class SetupRegister extends React.Component<Props, SetupRegisterFormState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            confirmPassword: '',
            hasConfirmed: false,
            emailError: '',
            passwordError: '',
            confirmationError: '',
        };
    }

    public render() {
        const { email, password, confirmPassword, hasConfirmed, emailError, passwordError, confirmationError } = this.state;

        return (
            <React.Fragment>
                <form className="setup-register-form" autoComplete="off">
                    <SetupFormInput
                        label="Email"
                        value={email}
                        handleChangeInput={this.handleChangeEmail}
                    />
                    {emailError && <div className="cr-sign-up-form__error">{emailError}</div>}
                    <SetupFormInput
                        label="Password"
                        value={password}
                        type="password"
                        handleChangeInput={this.handleChangePassword}
                    />
                    {passwordError && <div className="cr-sign-up-form__error">{passwordError}</div>}
                    <SetupFormInput
                        label="Confirm Password"
                        value={confirmPassword}
                        type="password"
                        handleChangeInput={this.handleChangeConfirmPassword}
                    />
                    {confirmationError && <div className={'cr-sign-up-form__error'}>{confirmationError}</div>}
                </form>
                <div className="setup-screen__agreement">
                    <div className="setup-screen__agreement__term">
                        <label className="container">I  agree all statements in <a href="#"> terms of service</a>
                            <input type="checkbox" checked={hasConfirmed} onClick={e => this.handleToggleConfirmAgreement()} />
                            <span className="checkmark"></span>
                        </label>
                    </div>
                    <Button
                        block={true}
                        type="button"
                        size="lg"
                        variant="primary"
                        onClick={this.handleValidateForm}
                    >
                        Next
                    </Button>
                </div>
            </React.Fragment>
        );
    }

    private handleChangeEmail = (value: string) => {
        this.setState({
            email: value,
        });
    };

    private handleChangePassword = (value: string) => {
        this.setState({
            password: value,
        });
    };

    private handleChangeConfirmPassword = (value: string) => {
        this.setState({
            confirmPassword: value,
        });
    };

    private handleToggleConfirmAgreement = () => {
        this.setState(prevState => {
            return {
                hasConfirmed: !prevState.hasConfirmed,
            }
        });
    };

    private handleValidateForm = () => {
        const {email, password, confirmPassword} = this.state;
        const isEmailValid = email.match(EMAIL_REGEX);
        const isPasswordValid = password.match(PASSWORD_REGEX);
        const isConfirmPasswordValid = password === confirmPassword;

        const isValidForm = email && isEmailValid && password && isPasswordValid && confirmPassword && isConfirmPasswordValid;

        if (!isValidForm) {
            if (!isEmailValid && !isPasswordValid) {
                this.setState({
                    confirmationError: '',
                    emailError: this.props.intl.formatMessage({ id: ERROR_INVALID_EMAIL }),
                    passwordError: this.props.intl.formatMessage({ id: ERROR_INVALID_PASSWORD }),
                    hasConfirmed: false,
                });

                return;
            }

            if (!isEmailValid) {
                this.setState({
                    confirmationError: '',
                    emailError: this.props.intl.formatMessage({ id: ERROR_INVALID_EMAIL }),
                    passwordError: '',
                    hasConfirmed: false,
                });

                return;
            }

            if (!isPasswordValid) {
                this.setState({
                    confirmationError: '',
                    emailError: '',
                    passwordError: this.props.intl.formatMessage({ id: ERROR_INVALID_PASSWORD }),
                    hasConfirmed: false,
                });

                return;
            }

            if (!isConfirmPasswordValid) {
                this.setState({
                    confirmationError: this.props.intl.formatMessage({ id: ERROR_PASSWORD_CONFIRMATION }),
                    emailError: '',
                    passwordError: '',
                    hasConfirmed: false,
                });

                return;
            }
        } else {
            this.handleRegister();
        }
    };

    private handleRegister = () => {
        const { email, password, confirmPassword } = this.state;

        this.props.handleRegister(email, password, confirmPassword);
    };
}

export const SetupRegisterForm = compose(
    injectIntl,
)(SetupRegister) as any;