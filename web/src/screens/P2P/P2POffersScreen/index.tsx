import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { TabPanel } from 'src/components';
import { P2POffers, P2POffersHeader, P2POffersModal } from 'src/containers';
import {
    useDocumentTitle,
    useP2PCurrenciesFetch,
    useP2PPaymentMethodsFetch,
    useUserPaymentMethodsFetch,
} from 'src/hooks';
import {
    Offer,
    P2POrderCreate,
    p2pOrdersCreateFetch,
    selectP2PCreatedOrder,
    selectP2PCreateOrderSuccess,
    selectP2PCurrenciesData,
    selectP2PPaymentMethodsData,
} from 'src/modules';

interface ParamType {
    currency?: string;
}

export const P2POffersScreen: FC = (): ReactElement => {
    const [tab, setTab] = useState<string>('');
    const [tabMapping, setTabMapping] = useState<string[]>([]);
    const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);
    const [sideFilter, setSideFilter] = useState<string>('buy');
    const [sortParam, setSortParam] = useState<string>('price asc');
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
            history.push(`/p2p/order/${createdOrder.id}`);
        }
    }, [createdOrder, createOrderSuccess, history]);

    const translate = useCallback((key: string) => formatMessage({ id: key }), [formatMessage]);
    const onCurrentTabChange = useCallback((index: number) => {
        setCurrentTabIndex(index);
        history.push(`/p2p/${tabMapping[index]}`);
    }, [tabMapping]);

    const onTabChange = useCallback((index: number) => {
        if (tab !== tabMapping[index]) {
            setTab(tabMapping[index]);
        }
    }, [tabMapping]);

    const handleSubmit = useCallback((payload: P2POrderCreate) => {
        dispatch(p2pOrdersCreateFetch(payload));
    }, []);

    const closeModal = useCallback(() => {
        setOpenModal(false);
        setSelectedOffer(null);
    }, []);

    const handleClickTrade = useCallback((offer: Offer) => {
        setOpenModal(true);
        setSelectedOffer(offer);
    }, []);

    const handleSideFilter = useCallback((side: string) => {
        setSideFilter(side);
        side === 'sell' ? setSortParam('price desc') : setSortParam('price asc');
    }, []);

    const pageContent = useCallback((pageCurrency: string) => {
        return (
            <React.Fragment>
                <P2POffersHeader
                    setPayment={setPaymentFilter}
                    onClickSideTab={handleSideFilter}
                    paymentsList={[formatMessage({ id: 'page.body.p2p.dropdown.all' }), ...paymentMethods.map(i => i.name)]}
                    paymentMethod={paymentFilter}
                    side={sideFilter}
                    fiatCurrencies={fiatCurList}
                    setFiatCurrency={setFiatCurrency}
                    fiatCurrency={fiatCurrency}
                />
                <P2POffers
                    base={pageCurrency}
                    quote={fiatCurrency}
                    paymentMethod={paymentFilter}
                    side={sideFilter}
                    sort={sortParam}
                    onClickTrade={handleClickTrade}
                />
                {selectedOffer &&
                    <P2POffersModal
                        id={selectedOffer.id}
                        side={sideFilter}
                        currencyCode={selectedOffer.base}
                        fiatCode={fiatCurrency}
                        advertiserName={selectedOffer.user.user_nickname || selectedOffer.user.user_uid}
                        price={selectedOffer.price}
                        available={selectedOffer.available_amount}
                        topLimit={selectedOffer.max_order_amount}
                        lowLimit={selectedOffer.min_order_amount}
                        timeLimit={selectedOffer.time_limit}
                        description={selectedOffer.description}
                        paymentMethods={selectedOffer.payment_methods}
                        show={openModal}
                        handleSubmit={handleSubmit}
                        closeModal={closeModal}
                    />
                }
            </React.Fragment>
        )
    }, [sideFilter, fiatCurrency, paymentMethods, paymentFilter, fiatCurList, openModal, selectedOffer]);

    const renderTabs = React.useMemo(() => tabMapping.map((i, index) => {
        return {
            content: currentTabIndex === index ? pageContent(i) : null,
            label: i.toUpperCase(),
        }
    }), [currentTabIndex, tabMapping, pageContent]);

    const leftHeader = React.useMemo(() => (
        <React.Fragment>
            <Link to="/p2p/faq" className="pg-p2p-tab__left">{translate('page.body.p2p.header.faq')}</Link>
            <Link to="/p2p/offers" className="pg-p2p-tab__left">{translate('page.body.p2p.header.offers')}</Link>
            <Link to="/p2p/history" className="pg-p2p-tab__left">{translate('page.body.p2p.header.trades_history')}</Link>
        </React.Fragment>
    ), []);

    return (
        <div className="pg-p2p-tab pg-container">
            <div className="pg-p2p-tab__tabs-content">
                <TabPanel
                    panels={renderTabs}
                    onTabChange={onTabChange}
                    optionalHead={leftHeader}
                    currentTabIndex={currentTabIndex}
                    onCurrentTabChange={onCurrentTabChange}
                />
            </div>
        </div>
    );
};
