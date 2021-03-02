import * as React from 'react';
import { SetupFormInput } from '../';
import { PasswordStrengthMeter } from '../../'
import { Button } from 'react-bootstrap';
import {
    EMAIL_REGEX,
    ERROR_INVALID_EMAIL,
    ERROR_PASSWORD_CONFIRMATION,
} from 'src/helpers';
import { injectIntl } from 'react-intl';
import { passwordMinEntropy } from '../../../api/config';
import { IntlProps } from '../../../';
import { compose } from 'redux';
import {
    connect,
    MapDispatchToPropsFunction,
    MapStateToProps,
} from 'react-redux';
import {
    RootState,
    selectCurrentPasswordEntropy,
    entropyPasswordFetch,
} from '../../../modules';
import {
    passwordErrorFirstSolution,
    passwordErrorSecondSolution,
    passwordErrorThirdSolution,
} from '../../../helpers';

export interface SetupRegisterFormProps {
    handleRegister: (email: string, password: string, confirmPassword: string) => void;
}

interface SetupRegisterFormState {
    email: string;
    password: string;
    confirmPassword: string;
    hasConfirmed: boolean;
    emailError: string;
    confirmationError: string;
    passwordErrorFirstSolved: boolean;
    passwordErrorSecondSolved: boolean;
    passwordErrorThirdSolved: boolean;
    passwordPopUp: boolean;
    typingTimeout: any;
}

interface ReduxProps {
    currentPasswordEntropy: number;
}

interface DispatchProps {
    fetchCurrentPasswordEntropy: typeof entropyPasswordFetch;
}

type Props = SetupRegisterFormProps & IntlProps & DispatchProps & ReduxProps;

class SetupRegister extends React.Component<Props, SetupRegisterFormState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            confirmPassword: '',
            hasConfirmed: false,
            emailError: '',
            confirmationError: '',
            passwordErrorFirstSolved: false,
            passwordErrorSecondSolved: false,
            passwordErrorThirdSolved: false,
            passwordPopUp: false,
            typingTimeout: 0,
        };
    }

    public render() {
        const {
            email,
            password,
            confirmPassword,
            hasConfirmed,
            emailError,
            confirmationError,
            passwordErrorFirstSolved,
            passwordErrorSecondSolved,
            passwordErrorThirdSolved,
            passwordPopUp
        } = this.state;
        const { currentPasswordEntropy } = this.props;

        const isDisabled = !(email || password || confirmPassword)
            || emailError !== ''
            || confirmationError !== ''
            || password !== confirmPassword
            || currentPasswordEntropy < passwordMinEntropy()
            || !hasConfirmed;

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
                        handleFocusInput={this.handleFocusPassword}
                        handleFocusOut={this.handleFocusOut}
                    />
                    {password ? (
                        <PasswordStrengthMeter
                            minPasswordEntropy={passwordMinEntropy()}
                            currentPasswordEntropy={currentPasswordEntropy}
                            passwordExist={password !== ''}
                            passwordErrorFirstSolved={passwordErrorFirstSolved}
                            passwordErrorSecondSolved={passwordErrorSecondSolved}
                            passwordErrorThirdSolved={passwordErrorThirdSolved}
                            passwordPopUp={passwordPopUp}
                            translate={this.translate}
                        />
                    ) : null}
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
                            <input type="checkbox" checked={hasConfirmed} onChange={e => this.handleToggleConfirmAgreement()} />
                            <span className="checkmark"></span>
                        </label>
                    </div>
                    <Button
                        block={true}
                        type="button"
                        size="lg"
                        variant="primary"
                        onClick={this.handleValidateForm}
                        disabled={isDisabled ? true : false}
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
        const { passwordErrorFirstSolved, passwordErrorSecondSolved, passwordErrorThirdSolved } = this.state;

        if (passwordErrorFirstSolution(value) && !passwordErrorFirstSolved) {
            this.setState({
                passwordErrorFirstSolved: true,
            });
        } else if (!passwordErrorFirstSolution(value) && passwordErrorFirstSolved) {
            this.setState({
                passwordErrorFirstSolved: false,
            });
        }

        if (passwordErrorSecondSolution(value) && !passwordErrorSecondSolved) {
            this.setState({
                passwordErrorSecondSolved: true,
            });
        } else if (!passwordErrorSecondSolution(value) && passwordErrorSecondSolved) {
            this.setState({
                passwordErrorSecondSolved: false,
            });
        }

        if (passwordErrorThirdSolution(value) && !passwordErrorThirdSolved) {
            this.setState({
                passwordErrorThirdSolved: true,
            });
        } else if (!passwordErrorThirdSolution(value) && passwordErrorThirdSolved) {
            this.setState({
                passwordErrorThirdSolved: false,
            });
        }

        if (this.state.typingTimeout) {
            clearTimeout(this.state.typingTimeout);
         }

        this.setState({
            password: value,
            typingTimeout: setTimeout(() => {
                this.props.fetchCurrentPasswordEntropy({ password: value });
            }, 500),
        });
    };

    private handleFocusPassword = () => {
        this.setState({
            passwordPopUp: true,
        });
    };

    private handleFocusOut = () => {
        this.setState({
            passwordPopUp: false,
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
        const isConfirmPasswordValid = password === confirmPassword;

        const isValidForm = email && isEmailValid && password && confirmPassword && isConfirmPasswordValid;

        if (!isValidForm) {
            if (!isEmailValid) {
                this.setState({
                    confirmationError: '',
                    emailError: this.props.intl.formatMessage({ id: ERROR_INVALID_EMAIL }),
                    hasConfirmed: false,
                });

                return;
            }

            if (!isConfirmPasswordValid) {
                this.setState({
                    confirmationError: this.props.intl.formatMessage({ id: ERROR_PASSWORD_CONFIRMATION }),
                    emailError: '',
                    hasConfirmed: false,
                });

                return;
            }
        } else {
            this.handleRegister();
        }
    };

    private translate = (id: string) =>
        this.props.intl.formatMessage({ id });

    private handleRegister = () => {
        const { email, password, confirmPassword } = this.state;

        this.props.handleRegister(email, password, confirmPassword);
    };
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    currentPasswordEntropy: selectCurrentPasswordEntropy(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    fetchCurrentPasswordEntropy: payload => dispatch(entropyPasswordFetch(payload)),
});

export const SetupRegisterForm = compose(
    injectIntl,
    connect(mapStateToProps, mapDispatchToProps),
)(SetupRegister) as any;
