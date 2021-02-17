import * as React from 'react';
import { SetupFormInput } from '..';

export interface SetupRegisterFormProps {
    email: string;
    password: string;
    confirmPassword?: string;
    showConfirmPassword?: boolean;
    handleChangeEmail: (value: string) => void;
    handleChangePassword: (value: string) => void;
    handleChangeConfirmPassword?: (value: string) => void;
}

export class SetupRegisterForm extends React.Component<SetupRegisterFormProps> {
    public render() {
        const {
            email,
            password,
            confirmPassword,
            showConfirmPassword,
            handleChangeEmail,
            handleChangePassword,
            handleChangeConfirmPassword,
        } = this.props;

        return (
            <form className="setup-register-form" autoComplete="off">
                <SetupFormInput
                    label="Email"
                    value={email}
                    handleChangeInput={handleChangeEmail}
                />
                <SetupFormInput
                    label="Password"
                    value={password}
                    type="password"
                    handleChangeInput={handleChangePassword}
                />
                {showConfirmPassword ?
                    <SetupFormInput
                        label="Confirm Password"
                        value={confirmPassword}
                        type="password"
                        handleChangeInput={handleChangeConfirmPassword}
                    />
                    : null 
                }
            </form>
        );
    }
}
