import * as React from 'react';
import { Button } from 'react-bootstrap';
import {
    FormattedMessage,
    injectIntl,
} from 'react-intl';
import { IntlProps } from '../../';
import { CustomInput } from '../../components';

type OnClearError = () => void;
type OnSubmitChangePassword = (oldPassword: string, newPassword: string, confirmPassword: string) => void;

interface ChangePasswordProps {
    onClearError: OnClearError;
    onSubmit: OnSubmitChangePassword;
    success?: boolean;
}

interface ChangePasswordState {
    showForm: boolean;
    oldPassword: string;
    newPassword: string;
}

type Props = ChangePasswordProps & IntlProps;

class ChangePasswordComponent extends React.Component<Props, ChangePasswordState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            showForm: false,
            oldPassword: '',
            newPassword: '',
        };
    }

    public componentWillReceiveProps(next: ChangePasswordProps) {
        if (!this.props.success && next.success) {
            this.handleCancel();
        }
    }

    public render() {
        const { showForm } = this.state;

        return (
            <React.Fragment>
                <label className="pg-profile-page__label">
                    <div>
                        <FormattedMessage id="page.body.profile.header.account.content.password" />
                    </div>
                    <span className="pg-profile-page__label-value">***********</span>
                </label>
                {showForm ? this.renderForm() : this.renderPasswordView()}
            </React.Fragment>
        );
    }

    private renderPasswordView = () => {
        return (
            <React.Fragment>
                <Button
                    className="pg-profile-page__btn-secondary"
                    onClick={this.toggleShowForm}
                    size="lg"
                    variant="primary"
                >
                    {this.props.intl.formatMessage({ id: 'page.body.profile.header.account.content.password.button.change'})}
                </Button>
            </React.Fragment>
        );
    };

    private renderForm = () => {
        const { oldPassword, newPassword } = this.state;

        return (
            <div>
                <div className="pg-change-password-form">
                    <div className="pg-change-password-form__group">
                        <label className="pg-change-password-form__label">
                        </label>
                        <CustomInput
                            label={this.props.intl.formatMessage({ id: 'page.body.profile.header.account.content.password.old'})}
                            defaultLabel={this.props.intl.formatMessage({ id: 'page.body.profile.header.account.content.password.old' })}
                            placeholder={this.props.intl.formatMessage({ id: 'page.body.profile.header.account.content.password.old' })}
                            type="password"
                            inputValue={oldPassword}
                            handleChangeInput={this.handleOldPasswordChange}
                        />
                    </div>
                    <div className="pg-change-password-form__group">
                        <label className="pg-change-password-form__label">
                            <FormattedMessage id="page.body.profile.header.account.content.password.new" />
                        </label>
                        <CustomInput
                            label={this.props.intl.formatMessage({ id: 'page.body.profile.header.account.content.password.new'})}
                            defaultLabel={this.props.intl.formatMessage({ id: 'page.body.profile.header.account.content.password.new' })}
                            placeholder={this.props.intl.formatMessage({ id: 'page.body.profile.header.account.content.password.new' })}
                            type="password"
                            inputValue={newPassword}
                            handleChangeInput={this.handleNewPasswordChange}
                        />
                    </div>
                    <Button
                        onClick={this.handleSubmit}
                        size="lg"
                        variant="primary"
                    >
                        {this.props.intl.formatMessage({id: 'page.body.profile.header.account.content.password.button.save'})}
                    </Button>
                    <Button
                        onClick={this.handleCancel}
                        size="lg"
                        variant="primary"
                    >
                        {this.props.intl.formatMessage({id: 'page.body.profile.header.account.content.password.button.cancel'})}
                    </Button>
                </div>
            </div>
        );
    };

    private toggleShowForm = () => {
        this.setState((state: ChangePasswordState) => ({
            showForm: !state.showForm,
        }));
    };

    private handleOldPasswordChange = (value: string) => {
        this.setState({
            oldPassword: value,
        });
    };

    private handleNewPasswordChange = (value: string) => {
        this.setState({
            newPassword: value,
        });
    };

    private handleSubmit = () => {
        this.props.onSubmit(this.state.oldPassword, this.state.newPassword, this.state.newPassword);
    };

    private handleCancel = () => {
        this.setState({
            showForm: false,
            oldPassword: '',
            newPassword: '',
        });
        this.props.onClearError();
    };
}

export const ChangePassword = injectIntl(ChangePasswordComponent) as any;
