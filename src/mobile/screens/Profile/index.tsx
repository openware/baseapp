import * as React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronIcon } from '../../../assets/images/ChevronIcon';
import { copy, getLanguageName } from '../../../helpers';
import {
    alertPush,
    selectCurrentColorTheme,
    selectCurrentLanguage,
    selectUserInfo,
} from '../../../modules';
import { ProfileLinks, UserInfo } from '../../components';

const ProfileMobileScreenComponent: React.FC = () => {
    const intl = useIntl();
    const dispatch = useDispatch();
    const user = useSelector(selectUserInfo);
    const currentLanguage = useSelector(selectCurrentLanguage);
    const currentTheme = useSelector(selectCurrentColorTheme);

    const handleCopyText = () => {
        copy('referral-link');
        dispatch(alertPush({ message: ['page.mobile.profileLinks.link.referral.success'], type: 'success' }));
    };

    const mainLinks = [
        {
            titleKey: 'page.mobile.profileLinks.main.verification',
            route: '/profile/verification',
            children: (
                <div>
                    <span className="color-accent">{intl.formatMessage({id: 'page.mobile.profileLinks.link.verification'}, {level: user.level})}</span>
                    <ChevronIcon />
                </div>
            ),
        },
        {
            titleKey: 'page.mobile.profileLinks.main.2fa',
            route: '/profile/2fa',
            state: {
                enable2fa: !user.otp,
            },
            children: (
                <div>
                    {user.otp ? (
                        <span className="color-green">{intl.formatMessage({id: 'page.mobile.profileLinks.link.2fa.enabled'})}</span>
                    ) : (
                        <span className="color-red">{intl.formatMessage({id: 'page.mobile.profileLinks.link.2fa.disabled'})}</span>
                    )}
                    <ChevronIcon />
                </div>
            ),
        },
        { titleKey: 'page.mobile.profileLinks.main.changePassword', route: '/profile/change-password' },
        { titleKey: 'page.mobile.profileLinks.main.activity', route: '/profile/account-activity' },
        { titleKey: 'page.mobile.profileLinks.main.apiKeys', route: '/profile/api-keys' },
    ];

    const settingsLinks = [
        {
            titleKey: 'page.mobile.profileLinks.settings.language',
            route: '/profile/language',
            children: (
                <div>
                    <span>{getLanguageName(currentLanguage)}</span>
                    <ChevronIcon />
                </div>
            ),
        },
        {
            titleKey: 'page.mobile.profileLinks.settings.theme',
            route: '/profile/theme',
            children: (
                <div>
                    <span className="text-capitalize">{currentTheme}</span>
                    <ChevronIcon />
                </div>
            ),
        },
    ];

    const additionalLinks = [
        {
            titleKey: 'page.mobile.profileLinks.additional.referral',
            route: '/profile',
            children: (
                <div className="referral-link" onClick={handleCopyText}>
                    <input
                        type="text"
                        id="referral-link"
                        value={`${window.document.location.origin}/signup?refid=${user.uid}`}
                        readOnly={true}
                    />
                    <span>{intl.formatMessage({id: 'page.mobile.profileLinks.link.referral'})}</span>
                </div>
            ),
        },
    ];

    return (
        <div className="pg-mobile-profile-screen">
            <UserInfo />
            <ProfileLinks links={mainLinks} />
            <ProfileLinks links={settingsLinks} />
            <ProfileLinks links={additionalLinks} />
        </div>
    );
};

export const ProfileMobileScreen = React.memo(ProfileMobileScreenComponent);
