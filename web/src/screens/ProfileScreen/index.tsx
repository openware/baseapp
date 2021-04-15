import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { TabPanel } from 'src/components';
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
import { selectAbilities } from 'src/modules';

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
            history.push('/profile/security');
        }
    }, [routeTab, tabMapping, history]);

    const goBack = useCallback(() => {
        history.goBack();
    }, [history]);

    const translate = useCallback((id: string) => formatMessage({ id: id }), [formatMessage]);
    const onCurrentTabChange = useCallback((index: number) => {
        setCurrentTabIndex(index);
        history.push(`/profile/${tabMapping[index]}`);
    }, [history, tabMapping]);

    const onTabChange = useCallback((index: number) => {
        if (tab === tabMapping[index]) {
            return;
        }
        setTab(tabMapping[index]);
    }, [tabMapping]);

    const renderTabs = React.useCallback(() => {
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
    }, [currentTabIndex, abilities, history, translate]);

    return (
        <div className="container pg-profile-page">
            <div className="pg-profile-page__details">
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
            
            {
                tab === 'security' ? (
                    <div className="row">
                        <div className="col-12">
                            <ProfileAccountActivity/>
                        </div>
                    </div>
                ) : null
            }
        </div>
    );
};
