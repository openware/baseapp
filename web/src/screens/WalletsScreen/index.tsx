import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { ChangeIcon } from 'src/assets/images/ChangeIcon';
import { TabPanel } from 'src/components';
import { CanCan, EstimatedValue, OrganizationHeader, OrganizationOverview, WalletsOverview, WalletsP2P, WalletsSpot, WalletsTransfer } from 'src/containers';
import { useDocumentTitle, useP2PWalletsFetch, useWalletsFetch } from 'src/hooks';
import { selectAbilities, selectCurrencies, selectP2PWallets, selectWallets, Wallet } from 'src/modules';

interface ParamType {
    routeTab?: string;
    currency?: string;
    action?: string;
}

export const WalletsScreen: FC = (): ReactElement => {
    const [tab, setTab] = useState<any>({id: '', label: ''});
    const [tabMapping, setTabMapping] = useState<any[]>([{id: 'overview', label: 'overview'}, {id: 'spot', label: 'spot'}]);
    const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);
    const [mergedWallets, setMergedWallets] = useState<Wallet[]>([]);

    const history = useHistory();
    const { formatMessage } = useIntl();
    const { routeTab, currency, action } = useParams<ParamType>();
    const wallets = useSelector(selectWallets) || [];
    const p2pWallets = useSelector(selectP2PWallets) || [];
    const currencies = useSelector(selectCurrencies);
    const abilities = useSelector(selectAbilities);

    useDocumentTitle('Wallets');
    useWalletsFetch();
    useP2PWalletsFetch();

    useEffect(() => {
        if (wallets.length && currencies.length && p2pWallets.length) {
            const merged = currencies.map(cur => {
                const spotWallet = wallets.find(i => i.currency === cur.id);
                const p2pWallet = p2pWallets.find(i => i.currency === cur.id);

                return {
                    ...spotWallet,
                    balance: String(+(spotWallet?.balance || 0) + +(p2pWallet?.balance || 0)),
                    locked: String(+(spotWallet?.locked || 0) + +(p2pWallet?.locked || 0)),
                };
            });

            setMergedWallets(merged);
        }
    }, [wallets, p2pWallets, currencies]);

    useEffect(() => {
        if (window.env?.wallet_navs) {
            const tabs = [
                ...(window.env.wallet_navs.organization?.enabled && window.env?.organization_enabled ? [{id: window.env.wallet_navs.organization?.id, label: window.env.wallet_navs.organization?.label}] : []),
                ...(window.env.wallet_navs.overview?.enabled ? [{id: window.env.wallet_navs.overview?.id, label: window.env.wallet_navs.overview?.label}] : []),
                ...(window.env.wallet_navs.spot.enabled ? [{id: window.env.wallet_navs.spot?.id, label: window.env.wallet_navs.spot?.label}] : []),
                ...(window.env.wallet_navs.p2p?.enabled && abilities && CanCan.checkAbilityByAction('read', 'P2P', abilities) ? [{id: window.env.wallet_navs.p2p?.id, label:window.env.wallet_navs.p2p?.label}] : []),
                ...(window.env.wallet_navs.transfer?.enabled && abilities && CanCan.checkAbilityByAction('read', 'P2P', abilities) ? [{id: window.env.wallet_navs.transfer?.id, label:window.env.wallet_navs.transfer?.label}] : []),
            ]
            setTabMapping(tabs);
        } else {
            if (abilities && CanCan.checkAbilityByAction('read', 'P2P', abilities)) {
                setTabMapping([
                    {id: 'overview', label: 'Overview'},
                    {id: 'spot', label: 'Spot'},
                    {id: 'p2p', label: 'P2P'},
                    {id: 'transfer', label: 'Transfer'},
                ]);
            }
        }
    }, [abilities]);

    useEffect(() => {
        if (routeTab) {
            const index = tabMapping.findIndex(t => t.id === routeTab);
            if (index !== -1) {
                setTab(routeTab);
                setCurrentTabIndex(index);
            }
        } else {
            history.push('/wallets/overview');
        }
    }, [routeTab, tabMapping]);

    const translate = useCallback((id: string) => formatMessage({ id }), [formatMessage]);
    const onCurrentTabChange = useCallback((index: number) => {
        setCurrentTabIndex(index);
        history.push(`/wallets/${tabMapping[index].id}`);
    }, [tabMapping]);

    const onTabChange = useCallback((index: number) => {
        if (tab.id !== tabMapping[index].id) {
            setTab(tabMapping[index]);
        }
    }, [tabMapping]);

    const renderTabs = React.useCallback(() => {
        const isP2PEnabled = CanCan.checkAbilityByAction('read', 'P2P', abilities);

        const availableTabs = tabMapping.reduce((acc, val) => {
            switch (val.id) {
                case 'overview':
                    return [ ...acc, {
                            content: tabMapping[currentTabIndex].id === val.id ? <WalletsOverview isP2PEnabled={isP2PEnabled} /> : null,
                            label: window.env?.wallet_navs?.overview?.label || translate('page.body.wallets.tab.overview')
                        }];
                case 'spot':
                    return [ ...acc, {
                            content: tabMapping[currentTabIndex].id === val.id ?  <WalletsSpot currency={currency} action={action}/> : null,
                            label: window.env?.wallet_navs?.spot?.label || translate('page.body.wallets.tab.spot')
                        }];
                case 'p2p':
                    return [ ...acc, {
                            content: tabMapping[currentTabIndex].id === val.id ?  <WalletsP2P /> : null,
                            label: window.env?.wallet_navs?.p2p?.label || translate('page.body.wallets.tab.p2p')
                        }];
                case 'transfer':
                    return [ ...acc, {
                            content: tabMapping[currentTabIndex].id === val.id ?  <WalletsTransfer currency={currency} /> : null,
                            label: window.env?.wallet_navs?.transfer?.label || translate('page.body.wallets.tab.transfer')
                        }];
                case 'organization':
                    return [ ...acc, {
                            content: tabMapping[currentTabIndex].id === val.id ?  <OrganizationOverview isP2PEnabled={isP2PEnabled} /> : null,
                            label: window.env?.wallet_navs?.organization?.label || translate('page.body.wallets.tab.organization')
                        }];
                default:
                    return [...acc];
            }
        }, []);

        return availableTabs;
    }, [currentTabIndex, currency, action, abilities, history, tabMapping, translate]);

    //TODO: Get calculated values from new Peatio Api.
    return (
        <React.Fragment>
            {history.location.pathname.includes('/wallets/organization') ? <OrganizationHeader /> : <EstimatedValue wallets={mergedWallets} />}
            <div className="pg-wallets-tab pg-container">
                <div className="pg-wallets-tab__tabs-content">
                    <TabPanel
                        panels={renderTabs()}
                        onTabChange={onTabChange}
                        currentTabIndex={currentTabIndex}
                        onCurrentTabChange={onCurrentTabChange}
                    />
                </div>
            </div>
        </React.Fragment>
    );
};
