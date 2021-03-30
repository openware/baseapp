import * as React from 'react';
import { SetupFormInput } from '../';
import { PasswordStrengthMeter } from '../../'
import { Button } from 'react-bootstrap';
import { EMAIL_REGEX } from 'src/helpers';
import { FormattedMessage, injectIntl } from 'react-intl';
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
    handleRegister: (email: string, password: string) => void;
}

interface SetupRegisterFormState {
    email: string;
    password: string;
    confirmPassword: string;
    agreementConfirmed: boolean;
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
            agreementConfirmed: false,
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
            agreementConfirmed,
            passwordErrorFirstSolved,
            passwordErrorSecondSolved,
            passwordErrorThirdSolved,
            passwordPopUp
        } = this.state;
        const { currentPasswordEntropy } = this.props;
        const isEmailValid = email.match(EMAIL_REGEX);
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
                        handleFocus={this.handlePasswordFocus}
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
                    {(confirmPassword && !isConfirmPasswordValid) ? (
                        <div className={'cr-sign-up-form__error'}>
                            <FormattedMessage id="page.header.signUp.confirmPassword.message.error"/>
                        </div>
                     ) : null}
                </form>
                <div className="setup-screen__agreement">
                    <div className="setup-screen__agreement-term">
                        <label className="checkbox-container">I  agree all statements in <a href="#"> terms of service</a>
                            <input type="checkbox" checked={agreementConfirmed} onChange={() => this.handleToggleConfirmAgreement()} />
                            <span className="checkmark"></span>
                        </label>
                    </div>
                </div>
                <div className="setup-screen__button">
                    <Button
                        block={true}
                        type="button"
                        size="lg"
                        variant="primary"
                        onClick={this.handleRegister}
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

    private handleChangeConfirmPassword = (value: string) => {
        this.setState({
            confirmPassword: value,
        });
    };

    private handlePasswordFocus = (type: string) => {
        this.setState({
            passwordPopUp: type === 'in',
        });
    };

    private handleToggleConfirmAgreement = () => {
        this.setState(prevState => ({
          agreementConfirmed: !prevState.agreementConfirmed,
        }));
    };

    private handleValidateForm = () => {
        const {
            email,
            password,
            confirmPassword,
            agreementConfirmed,
        } = this.state;
        const { currentPasswordEntropy } = this.props;
        const isEmailValid = email.match(EMAIL_REGEX);
        const isPasswordValid = currentPasswordEntropy >= passwordMinEntropy();
        const isConfirmPasswordValid = password === confirmPassword;

        return isEmailValid && isPasswordValid && isConfirmPasswordValid && agreementConfirmed;
    };

    private handleRegister = () => {
        const { email, password, confirmPassword } = this.state;

        this.props.handleRegister(email, password);
    };

    private translate = (id: string) =>
        this.props.intl.formatMessage({ id });
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
