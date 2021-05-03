import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { ChangeIcon } from 'src/assets/images/ChangeIcon';
import { TabPanel } from 'src/components';
import { CanCan, EstimatedValue, WalletsOverview, WalletsP2P, WalletsSpot, WalletsTransfer } from 'src/containers';
import { useDocumentTitle, useP2PWalletsFetch, useWalletsFetch } from 'src/hooks';
import { selectAbilities, selectCurrencies, selectP2PWallets, selectWallets, Wallet } from 'src/modules';

interface ParamType {
    routeTab?: string;
    currency?: string;
    action?: string;
}

export const WalletsScreen: FC = (): ReactElement => {
    const [tab, setTab] = useState<string>('');
    const [tabMapping, setTabMapping] = useState<string[]>(['overview', 'spot']);
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
            const mergedWallets = currencies.map(cur => {
                const spotWallet = wallets.find(i => i.currency === cur.id);
                const p2pWallet = p2pWallets.find(i => i.currency === cur.id);

                return {
                    ...spotWallet,
                    balance: String(+(spotWallet?.balance || 0) + +(p2pWallet?.balance || 0)),
                    locked: String(+(spotWallet?.locked || 0) + +(p2pWallet?.locked || 0)),
                };
            });

            setMergedWallets(mergedWallets);
        }
    }, [wallets, p2pWallets, currencies]);

    useEffect(() => {
        if (abilities && CanCan.checkAbilityByAction('read', 'P2P', abilities)) {
            setTabMapping(['overview', 'spot', 'p2p', 'transfer']);
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
            history.push('/wallets/overview');
        }
    }, [routeTab, tabMapping]);

    const translate = useCallback((id: string) => formatMessage({ id }), [formatMessage]);
    const onCurrentTabChange = useCallback((index: number) => {
        setCurrentTabIndex(index);
        history.push(`/wallets/${tabMapping[index]}`);
    }, [tabMapping]);

    const onTabChange = useCallback((index: number) => {
        if (tab !== tabMapping[index]) {
            setTab(tabMapping[index]);
        }
    }, [tabMapping]);

    const renderTabs = React.useCallback(() => {
        const isP2PEnabled = CanCan.checkAbilityByAction('read', 'P2P', abilities);
        const p2pTabs = [
            {
                content: currentTabIndex === 2 ? <WalletsP2P /> : null,
                label: translate('page.body.wallets.tab.p2p'),
            },
            {
                content: currentTabIndex === 3 ? <WalletsTransfer currency={currency} /> : null,
                label: <div><ChangeIcon className="icon" />{translate('page.body.wallets.tab.transfer')}</div>,
            },
        ];

        return [
            {
                content: currentTabIndex === 0 ? <WalletsOverview isP2PEnabled={isP2PEnabled} /> : null,
                label: translate('page.body.wallets.tab.overview'),
            },
            {
                content: currentTabIndex === 1 ? <WalletsSpot currency={currency} action={action}/> : null,
                label: translate('page.body.wallets.tab.spot'),
            },
            ...(isP2PEnabled ? p2pTabs : []),
        ];
    }, [currentTabIndex, currency, action, abilities, history, translate]);

    return (
        <React.Fragment>
            <EstimatedValue wallets={mergedWallets} />
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
