import React, { FC, ReactElement, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { useSelector, useDispatch } from 'react-redux';
import { AvatarIcon } from 'src/assets/images/NavBarIcons';
import { DEFAULT_CCY_PRECISION, DEFAULT_TABLE_PAGE_LIMIT, DEFAULT_FIAT_PRECISION } from 'src/constants';
import { Decimal, Pagination, Table } from '../../../components';
import { useCurrenciesFetch, useP2POffersFetch, useWalletsFetch } from '../../../hooks';
import {
    offersFetch,
    RootState,
    selectP2POffers,
    selectP2POffersCurrentPage,
    selectP2POffersFirstElemIndex,
    selectP2POffersLastElemIndex,
    selectP2POffersNextPageExists,
    selectP2POffersTotalNumber,
    selectWallets,
} from '../../../modules';

interface ParentProps {
    cryptoCurrency: string;
    baseCurrency: string;
    paymentMethod: string;
    side: string;
}

type Props = ParentProps;

const P2POffers: FC<Props> = (props: Props): ReactElement => {
    const intl = useIntl();
    const page = useSelector(selectP2POffersCurrentPage);
    const list = useSelector(selectP2POffers);
    const total = useSelector(selectP2POffersTotalNumber);
    const firstElemIndex = useSelector((state: RootState) => selectP2POffersFirstElemIndex(state, DEFAULT_TABLE_PAGE_LIMIT));
    const lastElemIndex = useSelector((state: RootState) => selectP2POffersLastElemIndex(state, DEFAULT_TABLE_PAGE_LIMIT));
    const nextPageExists = useSelector((state: RootState) => selectP2POffersNextPageExists(state, DEFAULT_TABLE_PAGE_LIMIT));
    const wallets = useSelector(selectWallets);
    const dispatch = useDispatch();

    useWalletsFetch();
    useCurrenciesFetch();
    useP2POffersFetch({ limit: DEFAULT_TABLE_PAGE_LIMIT, page });

    const headerTitles = [
        intl.formatMessage({ id: 'page.body.p2p.table.header.advertisers' }),
        intl.formatMessage({ id: 'page.body.p2p.table.header.price' }),
        intl.formatMessage({ id: 'page.body.p2p.table.header.limit_available' }),
        intl.formatMessage({ id: 'page.body.p2p.table.header.payment' }),
        intl.formatMessage({ id: 'page.body.p2p.table.header.trade' }),
    ];

    const onClickPrevPage = useCallback(() => {
        dispatch(offersFetch({ page: Number(page) - 1, limit: DEFAULT_TABLE_PAGE_LIMIT }));
    }, [offersFetch, page, DEFAULT_TABLE_PAGE_LIMIT]);

    const onClickNextPage = useCallback(() => {
        dispatch(offersFetch({ page: Number(page) + 1, limit: DEFAULT_TABLE_PAGE_LIMIT }));
    }, [offersFetch, page, DEFAULT_TABLE_PAGE_LIMIT]);

    const retrieveData = (amountPrecision: number, pricePrecision: number) => (
        list.map(item => {
            const {
                price,
                user_nickname,
                offers_count,
                success_rate,
                available_amount,
                quote,
                min_order_amount,
                max_order_amount,
                base,
            } = item;

            return [
                <div className="advertisers">
                    <AvatarIcon fillColor="var(--icons)"/>
                    <div className="font-small ml-small">
                        {user_nickname}
                        <div className="sec-row">
                            <span className="font-small secondary">{offers_count}</span>
                            <span className="font-small secondary ml-24">{+success_rate * 100}% {intl.formatMessage({ id: 'page.body.p2p.table.completion' })}</span>
                        </div>
                    </div>
                </div>,
                <div className="price">
                    {Decimal.format(price, pricePrecision, ',')}&nbsp;
                    <span className="font-big secondary">{quote?.toUpperCase()}</span>
                </div>,
                <div className="limit">
                    <div className="limit-col">
                        <span className="font-small secondary">{intl.formatMessage({ id: 'page.body.p2p.table.available' })}</span>
                        <span className="font-small secondary sec-row">{intl.formatMessage({ id: 'page.body.p2p.table.limit' })}</span>
                    </div>
                    <div className="limit-col">
                        <span className="font-big ml-small">{Decimal.format(available_amount, amountPrecision, ',')} {base?.toUpperCase()}</span>
                        <span className="font-big ml-small sec-row">{Decimal.format(min_order_amount, pricePrecision, ',')} - {Decimal.format(max_order_amount, pricePrecision, ',')}</span>
                    </div>
                </div>,
                <div className="payment">
                    <span className="font-small secondary">Yellow bank</span>
                    <span className="font-small secondary sec-row">Green bank</span>
                </div>
            ];
        })
    );

    const tableData = () => {
        const { cryptoCurrency } = props;

        if (list.length === 0) {
            return [[]];
        }

        const amountPrecision = wallets.find(w => w.currency === cryptoCurrency.toLowerCase())?.fixed || DEFAULT_CCY_PRECISION;
        const pricePrecision = wallets.find(obj => obj.currency === list[0].quote)?.fixed || DEFAULT_FIAT_PRECISION;

        return retrieveData(amountPrecision, pricePrecision);
    }

    return (
        <div className="cr-p2p-offers-table">
            <Table header={headerTitles} data={tableData()}/>
            <Pagination
                firstElemIndex={firstElemIndex}
                lastElemIndex={lastElemIndex}
                total={total}
                page={page}
                nextPageExists={nextPageExists}
                onClickPrevPage={onClickPrevPage}
                onClickNextPage={onClickNextPage}
            />
        </div>
    );
};

export {
    P2POffers,
};
