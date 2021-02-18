import * as React from 'react';
import { SetupFormInput } from '..';
import { Button } from 'react-bootstrap';

export interface SetupRegisterFormProps {
    handleRegister: (email: string, password: string, confirmPassword: string) => void;
}

interface SetupRegisterFormState {
    email: string;
    password: string;
    confirmPassword: string;
}

export class SetupRegisterForm extends React.Component<SetupRegisterFormProps, SetupRegisterFormState> {
    constructor(props: SetupRegisterFormProps) {
        super(props);

        this.state = {
            email: '',
            password: '',
            confirmPassword: '',
        };
    }

    public render() {
        const { email, password, confirmPassword } = this.state;

        return (
            <React.Fragment>
                <form className="setup-register-form" autoComplete="off">
                    <SetupFormInput
                        label="Email"
                        value={email}
                        handleChangeInput={this.handleChangeEmail}
                    />
                    <SetupFormInput
                        label="Password"
                        value={password}
                        type="password"
                        handleChangeInput={this.handleChangePassword}
                    />
                    <SetupFormInput
                        label="Confirm Password"
                        value={confirmPassword}
                        type="password"
                        handleChangeInput={this.handleChangeConfirmPassword}
                    />
                </form>
                <div className="setup-screen__agreement">
                    <div className="setup-screen__agreement__term">
                        <label className="container">I  agree all statements in <a href="#"> terms of service</a>
                            <input type="checkbox" />
                            <span className="checkmark"></span>
                        </label>
                    </div>
                    <Button
                        block={true}
                        type="button"
                        size="lg"
                        variant="primary"
                        onClick={this.handleRegister}
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

    private handleRegister = () => {
        const { email, password, confirmPassword } = this.state;

        this.props.handleRegister(email, password, confirmPassword);
    };
}
