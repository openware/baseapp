import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import { TabPanel } from 'src/components';
import { P2POffers } from 'src/containers/P2P/Offers';
import { P2POffersHeader } from 'src/containers/P2P/Offers/P2POffersHeader';
import { useDocumentTitle, useP2PCurrenciesFetch, useP2PPaymentMethodsFetch, useRangerConnectFetch } from 'src/hooks';
import { selectP2PCurrenciesData, selectP2PPaymentMethodsData } from 'src/modules';

interface ParamType {
    currency?: string;
}

export const P2POffersScreen: FC = (): ReactElement => {
    const [tab, setTab] = useState<string>('');
    const [tabMapping, setTabMapping] = useState<string[]>([]);
    const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);
    const [sideFilter, setSideFilter] = useState<string>('buy');
    const [fiatCurrency, setFiatCurrency] = useState<string>('');
    const [fiatCurList, setFiatCurList] = useState<string[]>([]);
    const [paymentFilter, setPaymentFilter] = useState<string>('');

    const currencies = useSelector(selectP2PCurrenciesData);
    const paymentMethods = useSelector(selectP2PPaymentMethodsData);
    const { formatMessage } = useIntl();
    const history = useHistory();
    const { currency } = useParams<ParamType>();

    useRangerConnectFetch();
    useP2PCurrenciesFetch();
    useP2PPaymentMethodsFetch();
    useDocumentTitle('P2P');

    useEffect(() => {
        if (currencies.length) {
            const fiatCurrencies = currencies.filter(i => i.type === 'fiat').map(i => i.id.toUpperCase());
            setTabMapping(currencies.filter(i => i.type === 'coin').map(i => i.id));
            setFiatCurList(fiatCurrencies);

            if (fiatCurrencies.length) {
                setFiatCurrency(fiatCurrencies[0]);
            }
        }
    }, [currencies]);

    useEffect(() => {
        if (tabMapping.length) {
            if (currency) {
                const index = tabMapping.indexOf(currency);
                if (index !== -1) {
                    setTab(currency);
                    setCurrentTabIndex(index);
                }
            } else {
                history.push(`/p2p/${tabMapping[0]}`);
            }
        }
    }, [currency, tabMapping, history]);

    const translate = useCallback((id: string) => formatMessage({ id: id }), [formatMessage]);
    const onCurrentTabChange = useCallback((index: number) => {
        setCurrentTabIndex(index);
        history.push(`/p2p/${tabMapping[index]}`);
    }, [history, tabMapping]);

    const onTabChange = useCallback((index: number) => {
        renderTabs();
        if (tab === tabMapping[index]) {
            return;
        }
        setTab(tabMapping[index]);
    }, [tabMapping]);

    const pageContent = useCallback((currency: string) => {
        return (
            <React.Fragment>
                <P2POffersHeader
                    setPayment={setPaymentFilter}
                    onClickSideTab={setSideFilter}
                    paymentsList={paymentMethods.map(i => i.name)}
                    paymentMethod={paymentFilter}
                    side={sideFilter}
                    fiatCurrencies={fiatCurList}
                    setFiatCurrency={setFiatCurrency}
                    fiatCurrency={fiatCurrency}
                />
                <P2POffers
                    cryptoCurrency={currency}
                    baseCurrency={fiatCurrency}
                    paymentMethod={paymentFilter}
                    side={sideFilter}
                />
            </React.Fragment>
        )
    }, [sideFilter, fiatCurrency, paymentMethods, paymentFilter, fiatCurList, tab ]);

    const renderTabs = () => tabMapping.map(i => {
        return {
            content: pageContent(i),
            label: i.toUpperCase(),
        }
    });

    const leftHeader = (
        <React.Fragment>
            <Link to="/p2p/faq" className="pg-p2p-tab__left">{translate('page.body.p2p.header.faq')}</Link>
            <Link to="/p2p/offers" className="pg-p2p-tab__left">{translate('page.body.p2p.header.offers')}</Link>
            <Link to="/p2p/history" className="pg-p2p-tab__left">{translate('page.body.p2p.header.trades_history')}</Link>
        </React.Fragment>
    );

    return (
        <div className="pg-p2p-tab pg-container">
            <div className="pg-p2p-tab__tabs-content">
                <TabPanel
                    panels={renderTabs()}
                    onTabChange={onTabChange}
                    optionalHead={leftHeader}
                    currentTabIndex={currentTabIndex}
                    onCurrentTabChange={onCurrentTabChange}
                />
            </div>
        </div>
    );
};
