import { History } from 'history';
import * as React from 'react';
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

type Props = ReduxProps & DispatchProps & RouterProps;

class ProfileAuthDetailsComponent extends React.Component<Props> {
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
                        <div className="pg-profile-page__row">
                            <h1>{user.email}</h1>
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
            </div>
        );
    }

    private handleChangePassword = (oldPassword: string, newPassword: string) => {
        this.props.changePassword({
            old_password: oldPassword,
            new_password: newPassword,
        });
    }

    private handleNavigateTo2fa = (enable2fa: boolean) => {
        this.props.history.push('/security/2fa', { enable2fa });
    }
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    user: selectUserInfo(state),
    passwordChangeError: selectChangePasswordError(state),
    passwordChangeSuccess: selectChangePasswordSuccess(state),
});

const mapDispatchToProps = dispatch => ({
    changePassword: ({ old_password, new_password }) =>
        dispatch(changePasswordFetch({ old_password, new_password })),
    clearPasswordChangeError: () => dispatch(changePasswordError(undefined)),
});

const ProfileAuthDetailsConnected = connect(mapStateToProps, mapDispatchToProps)(ProfileAuthDetailsComponent);
// tslint:disable-next-line
const ProfileAuthDetails = withRouter(ProfileAuthDetailsConnected as any);

export {
    ProfileAuthDetails,
};
