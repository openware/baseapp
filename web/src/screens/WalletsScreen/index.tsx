import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { TabPanel } from 'src/components';
import { WalletsTable } from 'src/containers';
import { EstimatedValue } from 'src/containers/Wallets/EstimatedValue';
import { WalletsSpot } from 'src/containers/Wallets/WalletsSpot';
import { useDocumentTitle, useWalletsFetch } from 'src/hooks';
import { selectWallets } from 'src/modules';

interface ParamType {
    routeTab?: string;
    currency?: string;
    action?: string;
}

export const WalletsScreen: FC = (): ReactElement => {
    const [tab, setTab] = useState<string>('');
    const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);

    const tabMapping = ['overview', 'spot', 'p2p', 'transfer'];
    const history = useHistory();
    const { formatMessage } = useIntl();
    const { routeTab, currency, action } = useParams<ParamType>();
    const wallets = useSelector(selectWallets);

    useDocumentTitle('Wallets');
    useWalletsFetch();

    useEffect(() => {
        if (routeTab) {
            const index = tabMapping.indexOf(routeTab);
            if (index) {
                setTab(routeTab);
                setCurrentTabIndex(index);
            }
        } else {
            history.push('/wallets/overview');
        }
    }, [routeTab, history]);

    const translate = useCallback((id: string) => formatMessage({ id: id }), [formatMessage]);
    const onCurrentTabChange = useCallback((index: number) => {
        setCurrentTabIndex(index);
        history.push(`/wallets/${tabMapping[index]}`);
    }, [history]);

    const onTabChange = useCallback((index: number) => {
        renderTabs();
        if (tab === tabMapping[index]) {
            return;
        }
        setTab(tabMapping[index]);
    }, [tabMapping]);

    const renderTabs = React.useCallback(() => {
        return [
            {
                content: currentTabIndex === 0 ? (
                    <WalletsTable
                        type="overview"
                        handleClickDeposit={currency => history.push(`/wallets/spot/${currency}/deposit`)}
                        handleClickWithdraw={currency => history.push(`/wallets/spot/${currency}/withdraw`)}
                        handleClickTransfer={currency => history.push(`/wallets/transfer/${currency}`)}
                    />
                ) : null,
                label: translate('page.body.wallets.tab.overview'),
            },
            {
                content: currentTabIndex === 1 ? <WalletsSpot currency={currency} action={action}/> : null,
                label: translate('page.body.wallets.tab.spot'),
            },
            {
                content: currentTabIndex === 2 ? (
                    <WalletsTable
                        type="p2p"
                        handleClickP2P={currency => window.console.log('p2p', currency)}
                        handleClickTransfer={currency => history.push(`/wallets/transfer/${currency}`)}
                    />
                ) : null,
                label: translate('page.body.wallets.tab.p2p'),
            },
            {
                content: currentTabIndex === 0 ? <div>Transfer</div> : null,
                label: translate('page.body.wallets.tab.transfer'),
            },
        ];
    }, [currentTabIndex, currency, action, history, translate]);

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
