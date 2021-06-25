import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import classnames from 'classnames';
import { useHistory, useLocation } from 'react-router';
import { useIntl } from 'react-intl';
import { ProfileIcon } from 'src/assets/images/sidebar/ProfileIcon';
import { ChevronIcon } from 'src/assets/images/ChevronIcon';
import { useDispatch, useSelector } from 'react-redux';
import { selectOrganizationSwitchSessionAbility, selectUserInfo, selectUserProfile, selectUserOrganization, logoutFetch } from 'src/modules';
import { organizationEnabled } from 'src/api';
import { LogoutIcon } from 'src/assets/images/sidebar/LogoutIcon';
import { Button } from 'react-bootstrap';

const HeaderProfileComponent: React.FC = () => {
    const [showMenu, setShowMenu] = React.useState<boolean>(false);
    
    const { formatMessage } = useIntl();
    const translate = useCallback((id: string, value?: any) => formatMessage({ id: id }, { ...value }), [formatMessage]);
    const user = useSelector(selectUserInfo);
    const userProfile = useSelector(selectUserProfile);
    const userOrg = useSelector(selectUserOrganization);
    const orgSwitchSessionAbility = useSelector(selectOrganizationSwitchSessionAbility);
    const location = useLocation();
    const history = useHistory();
    const dispatch = useDispatch();

    const toggleShowMenu = useCallback(() => {
        setShowMenu(!showMenu);
    }, [showMenu]);

    const handleOpenProfile = useCallback(() => {
        history.push('/profile');
    }, [showMenu]);

    const handleLogout = useCallback(() => {
        toggleShowMenu();
        dispatch(logoutFetch());
    }, [toggleShowMenu]);

    const getDisplayName = useMemo(() => {
        if (userOrg) {
            return userOrg.subunit?.name || userOrg.name
        }

        if (userProfile) {
            return `${userProfile.first_name} ${userProfile.last_name}`
        }

        return user.email
    }, [userOrg, userProfile, user]);

    const getDisplayID = useMemo(() => {
        if (userOrg) {
            return userOrg.subunit?.oid || userOrg.oid
        }

        return user.uid
    }, [userOrg, user]);

    const profileDropdown = useMemo(() => {
        return (
            <div className="profile-dropdown">
                <div className="profile-dropdown__container">
                    <div className="profile-dropdown__container__user">
                        <div className="profile-dropdown__container__user__info">
                            <span className="profile-dropdown__container__user__info__name">{getDisplayName}</span>
                            <span>{getDisplayID}</span>
                        </div>
                        <div className="profile-dropdown__container__user__button" onClick={handleLogout}>
                            <LogoutIcon />
                        </div>
                    </div>
                    <Button variant="secondary" onClick={() => history.push('/accounts/switch')}>{translate('page.body.profile.account.switch.title')}</Button>
                </div>
                <div className="profile-dropdown__menu" onClick={handleOpenProfile}>
                    <ProfileIcon /><span className="profile-dropdown__menu__name">{translate('page.body.profile.account.switch.dropdown.profile')}</span>
                </div>
                <div className="profile-dropdown__menu" onClick={handleLogout}>
                    <LogoutIcon /><span className="profile-dropdown__menu__name">{translate('page.body.profile.account.switch.dropdown.logout')}</span>
                </div>
            </div>
        );
    }, [getDisplayID, getDisplayName]);

    const accountSwitch = useMemo(() => {
        if (location.pathname.includes('/trading') || !organizationEnabled() || !orgSwitchSessionAbility.ability) {
            return null;
        }

        return (
            <div className="account-switch" onClick={toggleShowMenu}>
                <div className="account-switch__icon">
                    <ProfileIcon />
                </div>
                <div className="account-switch__user">
                    <div className="account-switch__user__name">{getDisplayName}</div>
                    <div className="account-switch__user__uid">{getDisplayID}</div>
                </div>
                {orgSwitchSessionAbility.switch ? 
                    <div className="account-switch__button">
                        <div className="account-switch__button__icon"><ChevronIcon /></div>
                    </div>
                    : null
                }
            </div>
        );
    }, [user, location, orgSwitchSessionAbility, getDisplayID, getDisplayName, toggleShowMenu]);

    return (
        <div className="cr-header-profile">
            {accountSwitch}
            {showMenu ? profileDropdown : null}
        </div>
    );
};

export const HeaderProfile = React.memo(HeaderProfileComponent);
