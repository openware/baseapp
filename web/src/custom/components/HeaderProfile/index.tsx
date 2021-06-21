import React, { useCallback, useEffect, useMemo } from 'react';
import classnames from 'classnames';
import { useHistory, useLocation } from 'react-router';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { ProfileIcon } from 'src/assets/images/sidebar/ProfileIcon';
import { ChevronIcon } from 'src/assets/images/ChevronIcon';
import { useSelector } from 'react-redux';
import { selectUserInfo } from 'src/modules';
import { isUsernameEnabled } from 'src/api';

const HeaderProfileComponent: React.FC = () => {
    const [profileOpen, setProfileOpen] = React.useState<boolean>(false);
    
    const { formatMessage } = useIntl();
    const translate = useCallback((id: string, value?: any) => formatMessage({ id: id }, { ...value }), [formatMessage]);
    const user = useSelector(selectUserInfo);
    const location = useLocation();

    useEffect(() => {
        if (profileOpen) {
            document.addEventListener('click', closeProfileMenu);
        } else {
            document.removeEventListener('click', closeProfileMenu);
        }
    }, [profileOpen]); 

    const toggleProfileMenu = useCallback(() => {
        setProfileOpen(!profileOpen);
    }, [profileOpen]);

    const closeProfileMenu = useCallback(() => {
        setProfileOpen(false);
    }, []);

    const accountSwitch = useMemo(() => {
        if (location.pathname.includes('/trading')) {
            return null;
        }

        return (
            <div className="account-switch">
                <div className="account-switch__icon">
                    <ProfileIcon />
                </div>
                <div className="account-switch__user">
                    <div className="account-switch__user__name">{isUsernameEnabled() ? user.username : user.email}</div>
                    <div className="account-switch__user__uid">{user.uid}</div>
                </div>
                <div className="account-switch__button">
                    <div className="account-switch__button__icon"><ChevronIcon /></div>
                </div>
            </div>
        );
    }, [user, location]);

    return (
        <div className="cr-header-profile">
            {accountSwitch}
        </div>
    );
};

export const HeaderProfile = React.memo(HeaderProfileComponent);
