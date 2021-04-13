import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { TabPanel } from 'src/components';
import { P2POffers, P2POffersHeader, P2POffersModal } from 'src/containers';
import { useDocumentTitle, useP2PCurrenciesFetch, useP2PPaymentMethodsFetch, useRangerConnectFetch, useUserPaymentMethodsFetch } from 'src/hooks';
import { Offer, P2POrderCreate, p2pOrdersCreateFetch, selectP2PCreatedOrder, selectP2PCreateOrderSuccess, selectP2PCurrenciesData, selectP2PPaymentMethodsData } from 'src/modules';

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
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [selectedOffer, setSelectedOffer] = useState<Offer>(null);

    const dispatch = useDispatch();
    const currencies = useSelector(selectP2PCurrenciesData);
    const paymentMethods = useSelector(selectP2PPaymentMethodsData);
    const createOrderSuccess = useSelector(selectP2PCreateOrderSuccess);
    const createdOrder = useSelector(selectP2PCreatedOrder);
    const { formatMessage } = useIntl();
    const history = useHistory();
    const { currency } = useParams<ParamType>();

    useRangerConnectFetch();
    useP2PCurrenciesFetch();
    useP2PPaymentMethodsFetch();
    useUserPaymentMethodsFetch();
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

    useEffect(() => {
        if (createOrderSuccess && createdOrder) {
            history.push(`/p2p/transfer/${createdOrder.id}`);
        }
    }, [createdOrder, createOrderSuccess, history]);

    const translate = useCallback((id: string) => formatMessage({ id: id }), [formatMessage]);
    const onCurrentTabChange = useCallback((index: number) => {
        setCurrentTabIndex(index);
        history.push(`/p2p/${tabMapping[index]}`);
    }, [history, tabMapping]);

    const onTabChange = useCallback((index: number) => {
        if (tab === tabMapping[index]) {
            return;
        }
        setTab(tabMapping[index]);
    }, [tabMapping]);

    const handleSubmit = useCallback((payload: P2POrderCreate) => {
        dispatch(p2pOrdersCreateFetch(payload));
    }, [selectedOffer, sideFilter]);

    const closeModal = useCallback(() => {
        setOpenModal(false);
    }, []);

    const handleClickTrade = useCallback((offer: Offer) => {
        setOpenModal(true);
        setSelectedOffer(offer);
    }, [selectedOffer]);

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
                    onClickTrade={handleClickTrade}
                />
                {selectedOffer &&
                    <P2POffersModal
                        id={selectedOffer.id}
                        side={sideFilter}
                        currencyCode={selectedOffer.base}
                        fiatCode={fiatCurrency}
                        advertiserName={selectedOffer.user_nickname}
                        price={selectedOffer.price}
                        available={selectedOffer.available_amount}
                        topLimit={selectedOffer.max_order_amount}
                        lowLimit={selectedOffer.min_order_amount}
                        timeLimit={selectedOffer.time_limit}
                        description={selectedOffer.description}
                        show={openModal}
                        handleSubmit={handleSubmit}
                        closeModal={closeModal}
                    />
                }
            </React.Fragment>
        )
    }, [sideFilter, fiatCurrency, paymentMethods, paymentFilter, fiatCurList, tab, openModal, selectedOffer ]);

    const renderTabs = () => tabMapping.map((i, index) => {
        return {
            content: currentTabIndex === index ? pageContent(i) : null,
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
