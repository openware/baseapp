import * as React from 'react';
import { SetupFormInput } from '..';

export interface SetupRegisterFormProps {
    email: string;
    password: string;
    confirmPassword: string;
}

export class SetupRegisterForm extends React.Component<SetupRegisterFormProps> {
    public render() {
        const { email, password, confirmPassword } = this.props;

        return (
            <form className="setup-register-form" autoComplete="off">
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
                <SetupFormInput
                    label="Confirm Password"
                    value={confirmPassword}
                    type="password"
                    handleChangeInput={this.onChangeConfirmPassword}
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

    private onChangeConfirmPassword = val => {
        console.log('confirm password: ', val);
    };
}
