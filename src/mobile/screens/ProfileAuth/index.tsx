import * as React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { ProfileTwoFactorAuth } from '../../../containers/ProfileTwoFactorAuth';
import { selectUserInfo, toggle2faFetch } from '../../../modules/user/profile';
import { ProfileTwoFactorAuthScreen } from '../../../screens/ProfileTwoFactorAuthScreen';
import { TwoFactorModal } from '../../components';
import { Subheader } from '../../components/Subheader';

export const ProfileAuthMobileScreen: React.FC = React.memo(() => {
    const [showModal, setShowModal] = React.useState(false);
    const dispatch = useDispatch();
    const history = useHistory();
    const intl = useIntl();
    const user = useSelector(selectUserInfo);

    const handleToggle2FA = (code2FA, shouldFetch) => {
        if (shouldFetch) {
            dispatch(toggle2faFetch({
                code: code2FA,
                enable: false,
            }));
            history.push('/profile');
        }
        setShowModal(false);
    };

    const handleNavigateTo2fa = React.useCallback((enable2fa: boolean) => {
        if (!enable2fa) {
            setShowModal(state => !state);
        }
    }, []);

    return (
        <React.Fragment>
            <Subheader
                title={intl.formatMessage({ id: 'page.profile.kyc.title' })}
                backTitle={intl.formatMessage({ id: 'page.body.profile.header.account' })}
                onGoBack={() => history.push('/profile')}
            />
            <div className="cr-mobile-profile-auth">
                <div className="cr-mobile-profile-auth__enable">
                    <div className="cr-mobile-profile-auth__enable-label">
                        <ProfileTwoFactorAuth
                            is2faEnabled={user.otp}
                            navigateTo2fa={handleNavigateTo2fa}
                        />
                    </div>
                    {!user.otp ? <ProfileTwoFactorAuthScreen/> : null}
                </div>
                <TwoFactorModal
                    showModal={showModal}
                    handleToggle2FA={handleToggle2FA}
                />
            </div>
        </React.Fragment>
    );
});
