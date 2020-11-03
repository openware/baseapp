import * as React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { ChangePassword } from '../../../components';
import {
    changePasswordFetch,
    entropyPasswordFetch,
    selectConfigs,
    selectCurrentPasswordEntropy,
} from '../../../modules';
import { Subheader } from '../../components';

const ChangePasswordScreenComponent: React.FC = () => {
    const dispatch = useDispatch();
    const intl = useIntl();
    const history = useHistory();

    const handleChangePassword = (payload) => {
        if (payload) {
            dispatch(changePasswordFetch(payload));
            history.push('/profile');
        }
    };

    const fetchCurrentPasswordEntropy = (payload) => {
        if (payload) {
            dispatch(entropyPasswordFetch(payload));
        }
    };

    const configs = useSelector(selectConfigs);
    const currentPasswordEntropy = useSelector(selectCurrentPasswordEntropy);

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
                    configs={configs}
                    currentPasswordEntropy={currentPasswordEntropy}
                    fetchCurrentPasswordEntropy={fetchCurrentPasswordEntropy}
                />
            </div>
        </React.Fragment>
    );
};

export const ProfileChangePasswordMobileScreen = React.memo(ChangePasswordScreenComponent);
