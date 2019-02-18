import {
    Button,
    Modal,
} from '@openware/components';
import cr from 'classnames';
import { History } from 'history';
import * as React from 'react';
import {
    FormattedMessage,
    InjectedIntlProps,
    injectIntl,
    intlShape,
} from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
    PASSWORD_REGEX,
} from '../../helpers';
import {
  RootState,
  selectUserInfo,
  User,
} from '../../modules';
import {
    changePasswordFetch,
    selectChangePasswordSuccess,
} from '../../modules/user/profile';
import { ProfileTwoFactorAuth } from '../ProfileTwoFactorAuth';

interface ReduxProps {
    user: User;
    passwordChangeSuccess?: boolean;
}

interface RouterProps {
    history: History;
}

interface OnChangeEvent {
    target: {
        value: string;
    };
}

interface DispatchProps {
    changePassword: typeof changePasswordFetch;
    clearPasswordChangeError: () => void;
}

interface ProfileProps {
    showModal: boolean;
}

interface State {
    showChangeModal: boolean;
    showModal: boolean;
    oldPassword: string;
    newPassword: string;
    confirmationPassword: string;
    oldPasswordFocus: boolean;
    newPasswordFocus: boolean;
    confirmPasswordFocus: boolean;
}

type Props = ReduxProps & DispatchProps & RouterProps & ProfileProps & InjectedIntlProps & OnChangeEvent;

class ProfileAuthDetailsComponent extends React.Component<Props, State> {
    //tslint:disable-next-line:no-any
    public static propTypes: React.ValidationMap<any> = {
        intl: intlShape.isRequired,
    };
    constructor(props: Props) {
        super(props);

        this.state = {
            showChangeModal: false,
            showModal: false,
            oldPassword: '',
            newPassword: '',
            confirmationPassword: '',
            oldPasswordFocus: false,
            newPasswordFocus: false,
            confirmPasswordFocus: false,
        };
    }
    private changeSuccess = this.props.intl.formatMessage({id: 'page.body.profile.header.account.content.password.change.success'});

    public render() {
        const {
            user,
            passwordChangeSuccess,
        } = this.props;
        const {
            oldPasswordFocus,
            newPasswordFocus,
            confirmationPassword,
            oldPassword,
            newPassword,
            confirmPasswordFocus,
        } = this.state;

        const oldPasswordClass = cr('group-content', {
            'group-content--focused': oldPasswordFocus,
        });

        const newPasswordClass = cr('group-content', {
            'group-content--focused': newPasswordFocus,
        });

        const confirmPasswordClass = cr('group-content', {
            'group-content--focused': confirmPasswordFocus,
        });

        const changeModalBody = (
            <div className="column">
                <div className="group">
                    <fieldset className={oldPasswordClass}>
                        {oldPassword && <legend>{this.props.intl.formatMessage({id: 'page.body.profile.header.account.content.password.old'})}</legend>}
                        <input
                            className="group-content-input"
                            value={oldPassword}
                            placeholder={this.props.intl.formatMessage({id: 'page.body.profile.header.account.content.password.old'})}
                            onChange={this.handleOldPassword}
                            type="password"
                            onFocus={this.handleFieldFocus('oldPassword')}
                            onBlur={this.handleFieldFocus('oldPassword')}
                        />
                    </fieldset>
                </div>
                <div className="group">
                    <fieldset className={newPasswordClass}>
                        {newPassword && <legend>{this.props.intl.formatMessage({id: 'page.body.profile.header.account.content.password.new'})}</legend>}
                        <input
                            className="group-content-input"
                            value={newPassword}
                            placeholder={this.props.intl.formatMessage({id: 'page.body.profile.header.account.content.password.new'})}
                            onChange={this.handleNewPassword}
                            type="password"
                            onFocus={this.handleFieldFocus('newPassword')}
                            onBlur={this.handleFieldFocus('newPassword')}
                        />
                    </fieldset>
                </div>
                <div className="group">
                    <fieldset className={confirmPasswordClass}>
                        {confirmationPassword && <legend>{this.props.intl.formatMessage({id: 'page.body.profile.header.account.content.password.conf'})}</legend>}
                        <input
                            className="group-content-input"
                            value={confirmationPassword}
                            placeholder={this.props.intl.formatMessage({id: 'page.body.profile.header.account.content.password.conf'})}
                            onChange={this.handleConfPassword}
                            type="password"
                            onFocus={this.handleFieldFocus('confirmationPassword')}
                            onBlur={this.handleFieldFocus('confirmationPassword')}
                        />
                    </fieldset>
                </div>
                {passwordChangeSuccess && this.changeSuccess}
            </div>
        );

        return (
            <div className="pg-profile-page__box pg-profile-page__left-col__basic">
                <div className="pg-profile-page__box-header pg-profile-page__left-col__basic__info-row">
                    <div className="pg-profile-page__left-col__basic__info-row__block">
                        <div className="pg-profile-page__row pg-profile-page__details-user">
                            <p>{user.email}</p>
                        </div>
                        <div className="pg-profile-page__row">
                            <h2>UID: {user.uid}</h2>
                        </div>
                    </div>
                </div>
                <div className="pg-profile-page__row">
                    <div>
                        <div className="pg-profile-page__label">
                            {this.props.intl.formatMessage({ id: 'page.body.profile.header.account.content.password'})}
                        </div>
                        <div>
                            ************
                        </div>
                    </div>
                    <Button
                        className="pg-profile-page__btn-secondary-change"
                        onClick={this.showChangeModal}
                        label={this.props.intl.formatMessage({ id: 'page.body.profile.header.account.content.password.button.change'})}
                    />
                    <Modal
                        show={this.state.showChangeModal}
                        header={this.renderChangeModalHeader()}
                        content={changeModalBody}
                        footer={this.renderChangeModalFooter()}
                    />
                </div>
                <div className="pg-profile-page__row">
                    <ProfileTwoFactorAuth
                        is2faEnabled={user.otp}
                        navigateTo2fa={this.handleNavigateTo2fa}
                    />
                </div>
                <Modal
                    show={this.state.showModal}
                    header={this.renderModalHeader()}
                    content={this.renderModalBody()}
                    footer={this.renderModalFooter()}
                />
            </div>
        );
    }

    private renderModalHeader = () => {
        return (
            <div className="pg-exchange-modal-submit-header">
                <FormattedMessage id="page.body.profile.header.account.content.twoFactorAuthentication.modalHeader"/>
            </div>
        );
    };

    private renderModalBody = () => {
        return (
            <div className="pg-exchange-modal-submit-body">
                <h2>
                    <FormattedMessage id="page.body.profile.header.account.content.twoFactorAuthentication.modalBody"/>
                </h2>
            </div>
        );
    };

    private renderModalFooter = () => {
        return (
            <div className="pg-exchange-modal-submit-footer">
                <Button
                    className="pg-exchange-modal-submit-footer__button-inverse"
                    label="OK"
                    onClick={this.closeModal}
                />
            </div>
        );
    };

    private renderChangeModalHeader = () => (
        <div className="pg-modal-change-password__header">
            <div/>
            <div>
                <FormattedMessage id="page.body.profile.header.account.content.password.change"/>
            </div>
            <div onClick={this.handleCancel}>
                <img src={require('./close.svg')}/>
            </div>
        </div>
    );

    private renderChangeModalFooter = () => (
        <Button
            label={this.props.intl.formatMessage({id: 'page.body.profile.header.account.content.password.button.change'})}
            onClick={this.handleChangePassword}
            disabled={!this.isValidForm()}
        />
    );

    private handleChangePassword = () => {
        this.props.changePassword({
            old_password: this.state.oldPassword,
            new_password: this.state.newPassword,
            confirm_password: this.state.confirmationPassword,
        });
    };

    private closeModal = () => {
        this.setState({
            showModal: false,
        });
      };

    private showChangeModal = () => {
        this.setState({
            showChangeModal: true,
        });
    }

    private handleNavigateTo2fa = (enable2fa: boolean) => {
        if (enable2fa) {
          this.props.history.push('/security/2fa', { enable2fa });
        } else {
          this.setState({
              showModal: !this.state.showModal,
          });
        }
    }

    private handleOldPassword = (e: OnChangeEvent) => {
        this.setState({
            oldPassword: e.target.value,
        });
    }

    private handleConfPassword = (e: OnChangeEvent) => {
        this.setState({
            confirmationPassword: e.target.value,
        });
    }

    private handleNewPassword = (e: OnChangeEvent) => {
        this.setState({
            newPassword: e.target.value,
        });
    }

    private handleCancel = () => {
        this.setState({
            showChangeModal: false,
            oldPassword: '',
            newPassword: '',
            confirmationPassword: '',
        });
    }

    private handleFieldFocus = (field: string) => {
        return () => {
            switch (field) {
                case 'oldPassword':
                    this.setState({
                        oldPasswordFocus: !this.state.oldPasswordFocus,
                    });
                    break;
                case 'newPassword':
                    this.setState({
                        newPasswordFocus: !this.state.newPasswordFocus,
                    });
                    break;
                case 'confirmationPassword':
                    this.setState({
                        confirmPasswordFocus: !this.state.confirmPasswordFocus,
                    });
                    break;
                default:
                    break;
            }
        };
    }

    private isValidForm() {
        const {
            confirmationPassword,
            oldPassword,
            newPassword,
        } = this.state;
        const isOldPasswordValid = oldPassword.match(PASSWORD_REGEX);
        const isNewPasswordValid = newPassword.match(PASSWORD_REGEX);
        const isConfirmPasswordValid = newPassword === confirmationPassword;

        return (oldPassword && isOldPasswordValid) &&
            (newPassword && isNewPasswordValid) &&
            (confirmationPassword && isConfirmPasswordValid);
    }
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    user: selectUserInfo(state),
    passwordChangeSuccess: selectChangePasswordSuccess(state),
});

const mapDispatchToProps = dispatch => ({
    changePassword: ({ old_password, new_password, confirm_password }) =>
        dispatch(changePasswordFetch({ old_password, new_password, confirm_password })),
});

const ProfileAuthDetailsConnected = injectIntl(connect(mapStateToProps, mapDispatchToProps)(ProfileAuthDetailsComponent));
// tslint:disable-next-line
const ProfileAuthDetails = withRouter(ProfileAuthDetailsConnected as any);

export {
    ProfileAuthDetails,
};
