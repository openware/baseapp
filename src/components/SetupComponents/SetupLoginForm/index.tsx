import * as React from 'react';
import { SetupFormInput } from '..';
import { Button } from 'react-bootstrap';
import { EMAIL_REGEX } from '../../../helpers';

export interface SetupLoginFormProps {
    handleLogin: (email: string, password: string) => void;
}

interface SetupLoginFormState {
    email: string;
    password: string;
}

export class SetupLoginForm extends React.Component<SetupLoginFormProps, SetupLoginFormState> {
    constructor(props: SetupLoginFormProps) {
        super(props);

        this.state = {
            email: '',
            password: '',
        };
    }

    public render() {
        const { email, password } = this.state;
        const isEmailValid = email.match(EMAIL_REGEX) && password.length;

        return (
            <React.Fragment>
                <form className="setup-login-form" autoComplete="off">
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
                </form>
                <div className="setup-screen__button">
                    <Button
                        block={true}
                        type="button"
                        size="lg"
                        variant="primary"
                        onClick={this.handleLogin}
                        disabled={!isEmailValid}
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

    private handleLogin = () => {
        const { email, password } = this.state;

        this.props.handleLogin(email, password);
    };
}
