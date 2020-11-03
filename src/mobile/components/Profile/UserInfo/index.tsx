import * as React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import { logoutFetch, selectUserInfo } from '../../../../modules';

const UserInfoComponent = (props) => {
    const intl = useIntl();
    const user = useSelector(selectUserInfo);
    const dispatch = useDispatch();

    const handleLogoutUser = () => {
        dispatch(logoutFetch());
    };

    return (
        <div className="pg-mobile-user-info">
            <div className="pg-mobile-user-info__details">
                <span>{user.email}</span>
                <span>{intl.formatMessage({ id: 'page.mobile.userInfo.details.uid' }, { uid: user.uid })}</span>
            </div>
            <div className="pg-mobile-user-info__logout-button" onClick={handleLogoutUser}>
                {intl.formatMessage({ id: 'page.mobile.userInfo.logout.button' })}
            </div>
        </div>
    );
};

export const UserInfo = React.memo(UserInfoComponent);
