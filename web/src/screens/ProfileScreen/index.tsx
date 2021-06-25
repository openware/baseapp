import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { organizationEnabled } from 'src/api';
import { CompanyAccount, TabPanel } from 'src/components';
import {
    CanCan,
    ReferralProgram,
    ProfileSecurity,
    ProfilePayment,
    ProfileAuthDetails,
    ProfileAccountActivity,
    ProfileApiKeys,
    ProfileVerification,
} from 'src/containers';
import { useDocumentTitle } from 'src/hooks';
import { selectAbilities, selectUserInfo } from 'src/modules';

interface ParamType {
    routeTab?: string;
    currency?: string;
    action?: string;
}

export const ProfileScreen: FC = (): ReactElement => {
    const [tab, setTab] = useState<string>('security');
    const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);
    const [tabMapping, setTabMapping] = useState<string[]>(['security', 'api_keys', 'referral']);

    const history = useHistory();
    const { formatMessage } = useIntl();
    const { routeTab } = useParams<ParamType>();
    const abilities = useSelector(selectAbilities);
    const user = useSelector(selectUserInfo);

    const isCompanyAccount = useCallback(() => {
        return !!user.organization && organizationEnabled();
    }, [user]);

    useDocumentTitle('Profile');

    useEffect(() => {
        if (abilities && CanCan.checkAbilityByAction('read', 'P2P', abilities)) {
            setTabMapping(['security', 'api_keys', 'payment', 'referral']);
        }
    }, [abilities]);

    useEffect(() => {
        if (routeTab) {
            const index = tabMapping.indexOf(routeTab);
            if (index !== -1) {
                setTab(routeTab);
                setCurrentTabIndex(index);
            }
        } else {
            isCompanyAccount() ? history.push('/profile/company') : history.push('/profile/security');
        }
    }, [routeTab, tabMapping]);

    const translate = useCallback((id: string) => formatMessage({ id }), [formatMessage]);
    const onCurrentTabChange = useCallback((index: number) => {
        setCurrentTabIndex(index);
        history.push(`/profile/${tabMapping[index]}`);
    }, [tabMapping]);

    const onTabChange = useCallback((index: number) => {
        if (tab !== tabMapping[index]) {
            setTab(tabMapping[index]);
        }
    }, [tabMapping]);

    const renderTabs = useCallback(() => {
        const isP2PEnabled = CanCan.checkAbilityByAction('read', 'P2P', abilities);
        const p2pTabs = [
            {
                content: tab === 'payment' ? <ProfilePayment/> : null,
                label: translate('page.body.profile.tabs.payment'),
            }
        ];

        return [
            {
                content: tab === 'security' ? <ProfileSecurity/> : null,
                label: translate('page.body.profile.tabs.security'),
            },
            {
                content: tab === 'api_keys' ? <ProfileApiKeys/> : null,
                label: translate('page.body.profile.tabs.api_keys'),
            },
            ...(isP2PEnabled ? p2pTabs : []),
            {
                content: tab === 'referral' ? <ReferralProgram/> : null,
                label: translate('page.body.profile.tabs.referral'),
            },
        ];
    }, [tab, abilities]);

    return (
        <div className="container pg-profile-page">
            {isCompanyAccount() ?
                <React.Fragment>
                    <CompanyAccount />
                </React.Fragment>
                : <div className="pg-profile-page__details">
                    <div className="pg-profile-top">
                        <div className="row">
                            <div className="col-12 col-md-6 mx-0">
                                <div className="row col-12 mx-0">
                                    <ProfileAuthDetails/>
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <ProfileVerification/>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <TabPanel
                                panels={renderTabs()}
                                onTabChange={onTabChange}
                                currentTabIndex={currentTabIndex}
                                onCurrentTabChange={onCurrentTabChange}
                            />
                        </div>
                    </div>
                </div>
            }
            {(isCompanyAccount() || tab === 'security') && (
                <div className="row">
                    <div className="col-12">
                        <ProfileAccountActivity/>
                    </div>
                </div>
            )}
        </div>
    );
};
