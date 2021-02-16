import * as React from 'react';
import { SetupFormInput } from '..';

export interface SetupLoginFormProps {
    email: string;
    password: string;
    confirmPassword: string;
}

export class SetupLoginForm extends React.Component<SetupLoginFormProps> {
    public render() {
        const { email, password, confirmPassword } = this.props;

        return (
            <form className="setup-login-form" autoComplete="off">
                <SetupFormInput
                    label="Email"
                    value={email}
                    handleChangeInput={this.onChangeEmail}
                />
                <SetupFormInput
                    label="Password"
                    value={password}
                    type="password"
                    handleChangeInput={this.onChangePassword}
                />
            </form>
        );
    }

    private onChangeEmail = val => {
        console.log('email: ', val);
    };

    private onChangePassword = val => {
        console.log('password: ', val);
    };
}
