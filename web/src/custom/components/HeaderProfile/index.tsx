import React, { useCallback, useEffect, useMemo } from 'react';
import classnames from 'classnames';
import { useHistory, useLocation } from 'react-router';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { ProfileIcon } from 'src/assets/images/sidebar/ProfileIcon';
import { ChevronIcon } from 'src/assets/images/ChevronIcon';
import { useSelector } from 'react-redux';
import { selectOrganizationSwitchSessionAbility, selectUserInfo, selectUserProfile, selectUserOrganization } from 'src/modules';

const HeaderProfileComponent: React.FC = () => {
    const [profileOpen, setProfileOpen] = React.useState<boolean>(false);
    
    const { formatMessage } = useIntl();
    const translate = useCallback((id: string, value?: any) => formatMessage({ id: id }, { ...value }), [formatMessage]);
    const user = useSelector(selectUserInfo);
    const userProfile = useSelector(selectUserProfile);
    const userOrg = useSelector(selectUserOrganization);
    const orgSwitchSessionAbility = useSelector(selectOrganizationSwitchSessionAbility);
    const location = useLocation();
    const history = useHistory();

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

    const getDisplayName = () => {
        if (userOrg) {
            return userOrg.name
        }
        if (userProfile) {
            return `${userProfile.first_name} ${userProfile.last_name}`
        }
        return user.email
    }

    const getDisplayID = () => {
        if (userOrg) {
            return userOrg.oid
        }
        return user.uid
    }

    const accountSwitch = useMemo(() => {
        if (location.pathname.includes('/trading') || !window.env?.organization_enabled || !orgSwitchSessionAbility.ability) {
            return null;
        }

        return (
            <div className="account-switch">
                <div className="account-switch__icon">
                    <ProfileIcon />
                </div>
                <div className="account-switch__user">
                    <div className="account-switch__user__name">{getDisplayName()}</div>
                    <div className="account-switch__user__uid">{getDisplayID()}</div>
                </div>
                {orgSwitchSessionAbility.switch ? 
                    <div className="account-switch__button" onClick={() => history.push('/accounts/switch')}>
                        <div className="account-switch__button__icon"><ChevronIcon /></div>
                    </div>
                    : null
                }
            </div>
        );
    }, [user, location, orgSwitchSessionAbility]);

    return (
        <div className="cr-header-profile">
            {accountSwitch}
        </div>
    );
};

export const HeaderProfile = React.memo(HeaderProfileComponent);
