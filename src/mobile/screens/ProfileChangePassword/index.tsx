import * as React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { changePasswordFetch } from '../../../modules';
import { ChangePassword, Subheader } from '../../components';

const ChangePasswordScreenComponent: React.FC = () => {
    const dispatch = useDispatch();
    const intl = useIntl();
    const history = useHistory();

    const handleChangePassword = payload => {
        if (payload) {
            dispatch(changePasswordFetch(payload));
            history.push('/profile');
        }
    };

    return (
        <React.Fragment>
            <Subheader
                title={intl.formatMessage({ id: 'page.mobile.profile.changePassword.title' })}
                backTitle={intl.formatMessage({ id: 'page.body.profile.header.account' })}
                onGoBack={() => history.push('/profile')}
            />
            <div className="pg-mobile-profile-change-password-screen">
                <ChangePassword
                    handleChangePassword={handleChangePassword}
                />
            </div>
        </React.Fragment>
    );
};

export const ProfileChangePasswordMobileScreen = React.memo(ChangePasswordScreenComponent);
