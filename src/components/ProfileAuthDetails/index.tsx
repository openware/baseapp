import {
    Button,
    Modal,
} from '@openware/components';
import { History } from 'history';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  RootState,
  selectUserInfo,
  User,
} from '../../modules';
import {
    changePasswordError,
    changePasswordFetch,
    selectChangePasswordError,
    selectChangePasswordSuccess,
} from '../../modules/profile';
import {
    CommonError,
} from '../../modules/types';
import { ChangePassword } from '../ChangePassword';
import { ProfileTwoFactorAuth } from '../ProfileTwoFactorAuth';

interface ReduxProps {
    user: User;
    passwordChangeError: CommonError | undefined;
    passwordChangeSuccess?: boolean;
}

interface RouterProps {
    history: History;
}

interface DispatchProps {
    changePassword: typeof changePasswordFetch;
    clearPasswordChangeError: () => void;
}

interface ProfileProps {
    showModal: boolean;
}


type Props = ReduxProps & DispatchProps & RouterProps & ProfileProps;

class ProfileAuthDetailsComponent extends React.Component<Props> {
    public state = {
        showModal: false,
    };
    public render() {
        const {
            passwordChangeError,
            passwordChangeSuccess,
            user,
        } = this.props;
        return (
            <div className="pg-profile-page__box pg-profile-page__left-col__basic">
                <div className="pg-profile-page__box-header pg-profile-page__left-col__basic__info-row">
                    <div className="pg-profile-page__left-col__basic__info-row__block">
                        <div className="pg-profile-page__row pg-profile-page__details-user">
                            <p>{user.email}</p>
                        </div>
                        <div className="pg-profile-page__row">
                            <h2 className="pg-profile-page__text-muted">UID: {user.uid}</h2>
                        </div>
                    </div>
                </div>
                <div className="pg-profile-page__row">
                    <ChangePassword
                        error={passwordChangeError}
                        onClearError={this.props.clearPasswordChangeError}
                        onSubmit={this.handleChangePassword}
                        success={passwordChangeSuccess}
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

    private handleChangePassword = (oldPassword: string, newPassword: string, confirmPassword: string) => {
        this.props.changePassword({
            old_password: oldPassword,
            new_password: newPassword,
            confirm_password: confirmPassword,
        });
    }

    private closeModal = () => {
        this.setState({
            showModal: false,
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
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    user: selectUserInfo(state),
    passwordChangeError: selectChangePasswordError(state),
    passwordChangeSuccess: selectChangePasswordSuccess(state),
});

const mapDispatchToProps = dispatch => ({
    changePassword: ({ old_password, new_password, confirm_password }) =>
        dispatch(changePasswordFetch({ old_password, new_password, confirm_password })),
    clearPasswordChangeError: () => dispatch(changePasswordError(undefined)),
});

const ProfileAuthDetailsConnected = connect(mapStateToProps, mapDispatchToProps)(ProfileAuthDetailsComponent);
// tslint:disable-next-line
const ProfileAuthDetails = withRouter(ProfileAuthDetailsConnected as any);

export {
    ProfileAuthDetails,
};
