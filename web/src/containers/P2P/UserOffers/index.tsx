import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { DEFAULT_CCY_PRECISION, DEFAULT_FIAT_PRECISION, DEFAULT_TABLE_PAGE_LIMIT } from 'src/constants';
import { localeDate, setOfferStatusColor } from 'src/helpers';
import { Decimal, Pagination, Table, TabPanel } from '../../../components';
import { useP2PUserOffersFetch, useWalletsFetch } from '../../../hooks';
import {
    userOffersFetch,
    cancelOffer,
    RootState,
    selectP2POffersCurrentPage,
    selectP2PUserOffers,
    selectP2PUserOffersFirstElemIndex,
    selectP2PUserOffersLastElemIndex,
    selectP2PUserOffersNextPageExists,
    selectP2PUserOffersTotalNumber,
    selectWallets,
} from '../../../modules';
import { EyeIcon } from 'src/assets/images/EyeIcon';

const tabMapping: string[] = ['wait', 'done', 'cancelled'];

const P2PUserOffers: FC = (): ReactElement => {
    const [tab, setTab] = useState<string>('wait');
    const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);

    const { formatMessage } = useIntl();
    const history = useHistory();
    const dispatch = useDispatch();
    const page = useSelector(selectP2POffersCurrentPage);
    const translate = useCallback((id: string, value?: any) => formatMessage({ id: id }, { ...value }), [formatMessage]);
    const list = useSelector(selectP2PUserOffers);
    const total = useSelector(selectP2PUserOffersTotalNumber);
    const firstElemIndex = useSelector((state: RootState) => selectP2PUserOffersFirstElemIndex(state, DEFAULT_TABLE_PAGE_LIMIT));
    const lastElemIndex = useSelector((state: RootState) => selectP2PUserOffersLastElemIndex(state, DEFAULT_TABLE_PAGE_LIMIT));
    const nextPageExists = useSelector((state: RootState) => selectP2PUserOffersNextPageExists(state, DEFAULT_TABLE_PAGE_LIMIT));
    const wallets = useSelector(selectWallets);

    useWalletsFetch();
    useP2PUserOffersFetch({ limit: DEFAULT_TABLE_PAGE_LIMIT, page, state: tab });

    useEffect(() => {
        setTab(tabMapping[0]);
    }, []);

    const headerTitles = useCallback(() => [
        translate('page.body.p2p.my.offers.table.date'),
        translate('page.body.p2p.my.offers.table.side'),
        translate('page.body.p2p.my.offers.table.asset'),
        translate('page.body.p2p.my.offers.table.amount'),
        translate('page.body.p2p.my.offers.table.price'),
        translate('page.body.p2p.my.offers.table.status'),
        tab === 'wait' ? translate('page.body.p2p.my.offers.table.action') : '',
    ], [tab]);

    const onClickPrevPage = useCallback(() => {
        dispatch(userOffersFetch({ page: Number(page) - 1, limit: DEFAULT_TABLE_PAGE_LIMIT, state: tab }));
    }, [userOffersFetch, tab, page, DEFAULT_TABLE_PAGE_LIMIT]);

    const onClickNextPage = useCallback(() => {
        dispatch(userOffersFetch({ page: Number(page) + 1, limit: DEFAULT_TABLE_PAGE_LIMIT, state: tab }));
    }, [userOffersFetch, tab, page, DEFAULT_TABLE_PAGE_LIMIT]);

    const handleCancel = useCallback((id: number) => () => {
        dispatch(cancelOffer({ id }));
    }, [cancelOffer, dispatch]);

    const handleOrders = useCallback((id: number) => () => {
        history.push(`/p2p/offer/${id}`);
    }, [history]);

    const retrieveData = useCallback(() => (
        !list.length ? [[]] : list.map(item => {
            const {
                id,
                side,
                created_at,
                price,
                origin_amount,
                quote,
                base,
                state,
                orders_count,
            } = item;

            const amountPrecision = wallets.find(w => w.currency === base)?.fixed || DEFAULT_CCY_PRECISION;
            const pricePrecision = wallets.find(obj => obj.currency === quote)?.fixed || DEFAULT_FIAT_PRECISION;

            return [
                localeDate(created_at, 'shortDate'),
                <span style={{ color: setOfferStatusColor(side) }} key={id}>{translate(`page.body.p2p.my.offers.table.side.${side}`)}</span>,
                `${base?.toUpperCase()}/${quote?.toUpperCase()}`,
                <span key={id}>{Decimal.format(origin_amount, amountPrecision, ',')} {base?.toUpperCase()}</span>,
                <span key={id}>{Decimal.format(price, pricePrecision, ',')} {quote?.toUpperCase()}</span>,
                <span style={{ color: setOfferStatusColor(state) }} className="text-capitalize" key={id}>{translate(`page.body.p2p.my.offers.${state}`)}</span>,
                <div className="actions">
                    {typeof orders_count === 'undefined' || orders_count > 0 ? (
                        <Button onClick={handleOrders(id)} variant="primary">
                            <span>{translate('page.body.p2p.my.offers.table.orders')}</span>&nbsp;{orders_count}
                            <EyeIcon className="eye-icon"/>
                        </Button>
                    ) : null}
                    {tab === 'wait' && (
                        <Button onClick={handleCancel(id)} variant="outline-danger">
                            {translate('page.body.p2p.my.offers.table.cancel')}
                        </Button>
                    )}
                </div>,
            ];
        })
    ), [list, tab]);

    const onCurrentTabChange = useCallback((index: number) => {
        setCurrentTabIndex(index);
    }, [tabMapping]);

    const onTabChange = useCallback((index: number) => {
        if (tab === tabMapping[index]) {
            return;
        }
        setTab(tabMapping[index]);
        dispatch(userOffersFetch({ page: 0, limit: DEFAULT_TABLE_PAGE_LIMIT, state: tabMapping[index] }));
    }, [tab, tabMapping]);

    const pageContent = useCallback((tabLabel: string) => {
        return (
            <div className={`cr-user-p2p-offers-table ${tabLabel}`}>
                <Table header={headerTitles()} data={retrieveData()}/>
                {list.length > 0 &&
                    <Pagination
                        firstElemIndex={firstElemIndex}
                        lastElemIndex={lastElemIndex}
                        total={total}
                        page={page}
                        nextPageExists={nextPageExists}
                        onClickPrevPage={onClickPrevPage}
                        onClickNextPage={onClickNextPage}
                    />}
            </div>
        );
    }, [retrieveData]);

    const renderTabs = () => tabMapping.map((tabLabel, index) => {
        return {
            content: currentTabIndex === index ? pageContent(tabLabel) : null,
            label: translate(`page.body.p2p.my.offers.${tabLabel}`),
        }
    });

    return (
        <div className="cr-user-p2p-offers">
            <TabPanel
                panels={renderTabs()}
                onTabChange={onTabChange}
                currentTabIndex={currentTabIndex}
                onCurrentTabChange={onCurrentTabChange}
            />
        </div>
    );
};

export {
    P2PUserOffers,
};
