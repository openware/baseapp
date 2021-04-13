import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { ChangeIcon } from 'src/assets/images/ChangeIcon';
import { TabPanel } from 'src/components';
import { CanCan, EstimatedValue, WalletsOverview, WalletsP2P, WalletsSpot, WalletsTransfer } from 'src/containers';
import { useDocumentTitle, useWalletsFetch } from 'src/hooks';
import { RootState, selectAbilities, selectWallets } from 'src/modules';

interface ParamType {
    routeTab?: string;
    currency?: string;
    action?: string;
}

export const WalletsScreen: FC = (): ReactElement => {
    const [tab, setTab] = useState<string>('');
    const [tabMapping, setTabMapping] = useState<string[]>(['overview', 'spot']);
    const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);

    const history = useHistory();
    const { formatMessage } = useIntl();
    const { routeTab, currency, action } = useParams<ParamType>();
    const wallets = useSelector((state: RootState) => selectWallets(state, 'spot')) || [];
    const abilities = useSelector(selectAbilities);

    useDocumentTitle('Wallets');
    useWalletsFetch();

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
    }, [routeTab, tabMapping, history]);

    const translate = useCallback((id: string) => formatMessage({ id: id }), [formatMessage]);
    const onCurrentTabChange = useCallback((index: number) => {
        setCurrentTabIndex(index);
        history.push(`/wallets/${tabMapping[index]}`);
    }, [history, tabMapping]);

    const onTabChange = useCallback((index: number) => {
        if (tab === tabMapping[index]) {
            return;
        }
        setTab(tabMapping[index]);
    }, [tabMapping]);

    const renderTabs = React.useCallback(() => {
        const p2pTabs = CanCan.checkAbilityByAction('read', 'P2P', abilities) ? [
            {
                content: currentTabIndex === 2 ? <WalletsP2P /> : null,
                label: translate('page.body.wallets.tab.p2p'),
            },
            {
                content: currentTabIndex === 3 ? <WalletsTransfer currency={currency} /> : null,
                label: <div><ChangeIcon className="icon" />{translate('page.body.wallets.tab.transfer')}</div>,
            },
        ] : [];

        return [
            {
                content: currentTabIndex === 0 ? <WalletsOverview /> : null,
                label: translate('page.body.wallets.tab.overview'),
            },
            {
                content: currentTabIndex === 1 ? <WalletsSpot currency={currency} action={action}/> : null,
                label: translate('page.body.wallets.tab.spot'),
            },
            ...p2pTabs,
        ];
    }, [currentTabIndex, currency, action, abilities, history, translate]);

    return (
        <React.Fragment>
            {wallets.length && <EstimatedValue wallets={wallets} />}
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
