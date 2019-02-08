import { Button, Input } from '@openware/components';
import * as React from 'react';
import {
    FormattedMessage,
    InjectedIntlProps,
    injectIntl,
    intlShape,
} from 'react-intl';
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

type Props = ChangePasswordProps & InjectedIntlProps;

class ChangePasswordComponent extends React.Component<Props, ChangePasswordState> {
    //tslint:disable-next-line:no-any
    public static propTypes: React.ValidationMap<any> = {
        intl: intlShape.isRequired,
    };

    constructor(props: Props) {
        super(props);

        this.state = {
            showForm: false,
            oldPassword: '',
            newPassword: '',
        };
    }

    public render() {
        const { showForm } = this.state;
        return (
            <React.Fragment>
                <label>
                    <p>
                        <FormattedMessage id="page.body.profile.header.account.content.password" />
                    </p>
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
                <Button
                    className="pg-profile-page__btn-secondary"
                    onClick={this.toggleShowForm}
                    label={this.props.intl.formatMessage({ id: 'page.body.profile.header.account.content.password.button.change'})}
                />
            </React.Fragment>
        );
    }

    private renderForm = () => {
        const { oldPassword, newPassword } = this.state;
        return (
            <div>
                <div className="pg-change-password-form">
                    <div className="pg-change-password-form__group">
                        <label className="pg-change-password-form__label">
                            <FormattedMessage id="page.body.profile.header.account.content.password.old" />
                        </label>
                        <Input type="password" value={oldPassword} onChangeValue={this.handleOldPasswordChange} />
                    </div>
                    <div className="pg-change-password-form__group">
                        <label className="pg-change-password-form__label">
                            <FormattedMessage id="page.body.profile.header.account.content.password.new" />
                        </label>
                        <Input
                            type="password"
                            value={newPassword}
                            onChangeValue={this.handleNewPasswordChange}
                        />
                    </div>
                    <Button
                        className="pg-profile-page__btn-secondary"
                        label={this.props.intl.formatMessage({id: 'page.body.profile.header.account.content.password.button.save'})}
                        onClick={this.handleSubmit}
                    />
                    <Button
                        className="pg-profile-page__btn-secondary"
                        label={this.props.intl.formatMessage({id: 'page.body.profile.header.account.content.password.button.cancel'})}
                        onClick={this.handleCancel}
                    />
                </div>
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
        this.setState({
            showForm: false,
            oldPassword: '',
            newPassword: '',
        });
        this.props.onClearError();
    }
}

export const ChangePassword = injectIntl(ChangePasswordComponent);
