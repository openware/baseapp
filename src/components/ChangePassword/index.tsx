import { Button, Input } from '@openware/components';
import * as React from 'react';
import { CommonError } from '../../modules/types';

type OnClearError = () => void;
type OnSubmitChangePassword = (oldPassword: string, newPassword: string, confirmPassword: string) => void;

interface ChangePasswordProps {
    onClearError: OnClearError;
    onSubmit: OnSubmitChangePassword;
    success?: boolean;
    error?: CommonError;
}

interface ChangePasswordState {
    showForm: boolean;
    oldPassword: string;
    newPassword: string;
}

const defaultState: ChangePasswordState = {
    showForm: false,
    oldPassword: '',
    newPassword: '',
};

class ChangePassword extends React.Component<ChangePasswordProps, ChangePasswordState> {
    public state = defaultState;

    public render() {
        const { showForm } = this.state;
        return (
            <React.Fragment>
                <label>
                  <p>Password</p>
                  <span>***********</span>
                </label>
                {showForm ? this.renderForm() : this.renderPasswordView()}
            </React.Fragment>
        );
    }

    public componentWillReceiveProps(next: ChangePasswordProps) {
        if (!this.props.success && next.success) {
            this.handleCancel();
        }
    }

    private renderPasswordView = () => {
        return (
            <React.Fragment>
                <Button className="pg-profile-page__btn-secondary" onClick={this.toggleShowForm} label="Change"/>
            </React.Fragment>
        );
    }

    private renderForm = () => {
        const { oldPassword, newPassword } = this.state;
        const { error } = this.props;
        return (
            <div>
                <div className="pg-change-password-form">
                    <div className="pg-change-password-form__group">
                        <label className="pg-change-password-form__label">Old password</label>
                        <Input type="password" value={oldPassword} onChangeValue={this.handleOldPasswordChange} />
                    </div>
                    <div className="pg-change-password-form__group">
                        <label className="pg-change-password-form__label">New password</label>
                        <Input type="password" value={newPassword} onChangeValue={this.handleNewPasswordChange} />
                    </div>
                    <Button
                        className="pg-profile-page__btn-secondary"
                        label="Save"
                        onClick={this.handleSubmit}
                    />
                    <Button
                        className="pg-profile-page__btn-secondary"
                        label="Cancel"
                        onClick={this.handleCancel}
                    />
                </div>
                {error && <p className="pg-change-password-form__error">{error.message}</p>}
            </div>
        );
    }

    private toggleShowForm = () => {
        this.setState((state: ChangePasswordState) => ({
            showForm: !state.showForm,
        }));
    }

    private handleOldPasswordChange = (value: string) => {
        this.setState({
            oldPassword: value,
        });
    }

    private handleNewPasswordChange = (value: string) => {
        this.setState({
            newPassword: value,
        });
    }

    private handleSubmit = () => {
        this.props.onSubmit(this.state.oldPassword, this.state.newPassword, this.state.newPassword);
    }

    private handleCancel = () => {
        this.setState(defaultState);
        this.props.onClearError();
    }
}

export {
    ChangePassword,
};
