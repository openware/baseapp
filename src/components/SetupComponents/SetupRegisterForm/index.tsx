import * as React from 'react';
import { SetupFormInput } from '..';
import { Button } from 'react-bootstrap';
import { EMAIL_REGEX, PASSWORD_REGEX } from 'src/helpers';
import { FormattedMessage, injectIntl } from 'react-intl';
import { IntlProps } from '../../../index';
import { compose } from 'redux';

export interface SetupRegisterFormProps {
    handleRegister: (email: string, password: string, confirmPassword: string) => void;
}

interface SetupRegisterFormState {
    email: string;
    password: string;
    confirmPassword: string;
    agreementConfirmed: boolean;
}

type Props = SetupRegisterFormProps & IntlProps;

class SetupRegister extends React.Component<Props, SetupRegisterFormState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            confirmPassword: '',
            agreementConfirmed: false,
        };
    }

    public render() {
        const {
            email,
            password,
            confirmPassword,
            agreementConfirmed,
        } = this.state;
        const isEmailValid = email.match(EMAIL_REGEX);
        const isPasswordValid = password.match(PASSWORD_REGEX);
        const isConfirmPasswordValid = password === confirmPassword;

        return (
            <React.Fragment>
                <form className="setup-register-form" autoComplete="off">
                    <SetupFormInput
                        label="Email"
                        value={email}
                        handleChangeInput={this.handleChangeEmail}
                    />
                    {(email && !isEmailValid) ? (
                        <div className="cr-sign-up-form__error">
                            <FormattedMessage id="page.header.signUp.email.message.error"/>
                        </div>
                    ) : null}
                    <SetupFormInput
                        label="Password"
                        value={password}
                        type="password"
                        handleChangeInput={this.handleChangePassword}
                    />
                    {(password && !isPasswordValid) ? (
                        <div className="cr-sign-up-form__error">
                            <FormattedMessage id="page.header.signUp.password.message.error"/>
                        </div>
                    ) : null}
                    <SetupFormInput
                        label="Confirm Password"
                        value={confirmPassword}
                        type="password"
                        handleChangeInput={this.handleChangeConfirmPassword}
                    />
                    {(confirmPassword && !isConfirmPasswordValid) ? (
                        <div className={'cr-sign-up-form__error'}>
                            <FormattedMessage id="page.header.signUp.confirmPassword.message.error"/>
                        </div>
                     ) : null}
                </form>
                <div className="setup-screen__agreement">
                    <div className="setup-screen__agreement__term">
                        <label className="container">I  agree all statements in <a href="#"> terms of service</a>
                            <input
                                type="checkbox"
                                checked={agreementConfirmed}
                                onClick={e => this.handleToggleConfirmAgreement()}
                            />
                            <span className="checkmark"></span>
                        </label>
                    </div>
                    <Button
                        block={true}
                        type="button"
                        size="lg"
                        variant="primary"
                        onClick={this.handleSubmitForm}
                        disabled={!this.handleValidateForm()}
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
        this.setState(prevState => ({
            agreementConfirmed: !prevState.agreementConfirmed,
        }));
    };

    private handleValidateForm = (): boolean => {
        const {
            email,
            password,
            confirmPassword,
            agreementConfirmed,
        } = this.state;
        const isEmailValid = email.match(EMAIL_REGEX);
        const isPasswordValid = password.match(PASSWORD_REGEX);
        const isConfirmPasswordValid = password === confirmPassword;

        return (
            email &&
            isEmailValid &&
            password &&
            isPasswordValid &&
            confirmPassword &&
            isConfirmPasswordValid &&
            agreementConfirmed
        );
    };

    private handleSubmitForm = () => {
        const { email, password, confirmPassword } = this.state;

        this.props.handleRegister(email, password, confirmPassword);
    };
}

export const SetupRegisterForm = compose(
    injectIntl,
)(SetupRegister) as any;
