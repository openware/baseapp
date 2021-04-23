import React, { FC, ReactElement, useCallback } from 'react';
import { Button } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useSelector, useDispatch } from 'react-redux';
import { isUsernameEnabled } from 'src/api';
import { AvatarIcon } from 'src/assets/images/NavBarIcons';
import { DEFAULT_CCY_PRECISION, DEFAULT_TABLE_PAGE_LIMIT, DEFAULT_FIAT_PRECISION, HOST_URL } from 'src/constants';
import { Decimal, Pagination, Table } from '../../../components';
import { useCurrenciesFetch, useP2POffersFetch, useWalletsFetch } from '../../../hooks';
import {
    Offer,
    offersFetch,
    RootState,
    selectP2POffers,
    selectP2POffersCurrentPage,
    selectP2POffersFirstElemIndex,
    selectP2POffersLastElemIndex,
    selectP2POffersNextPageExists,
    selectP2POffersTotalNumber,
    selectP2PPaymentMethodsData,
    selectWallets,
} from '../../../modules';

interface ParentProps {
    base: string;
    quote: string;
    paymentMethod: string;
    side: string;
    sort?: string;
    onClickTrade: (offer: Offer) => void;
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
    const paymentMethods = useSelector(selectP2PPaymentMethodsData);
    useWalletsFetch();
    useCurrenciesFetch();

    const { side, sort, paymentMethod, base, quote } = props;

    useP2POffersFetch({
        limit: DEFAULT_TABLE_PAGE_LIMIT,
        page,
        quote,
        base,
        side,
        sort,
        payment_method: paymentMethod,
    });

    const headerTitles = [
        intl.formatMessage({ id: 'page.body.p2p.table.header.advertisers' }),
        intl.formatMessage({ id: 'page.body.p2p.table.header.price' }),
        intl.formatMessage({ id: 'page.body.p2p.table.header.limit_available' }),
        intl.formatMessage({ id: 'page.body.p2p.table.header.payment' }),
        intl.formatMessage({ id: 'page.body.p2p.table.header.trade' }),
    ];

    const onClickPrevPage = useCallback(() => {
        const paymentMethodId = paymentMethods.find(i => i.name === paymentMethod);

        dispatch(
            offersFetch({
                page: Number(page) - 1,
                limit: DEFAULT_TABLE_PAGE_LIMIT,
                quote,
                base,
                payment_method: paymentMethodId?.id,
                side,
            }),
        );
    }, [offersFetch, side, paymentMethod, base, quote, page, DEFAULT_TABLE_PAGE_LIMIT, paymentMethods]);

    const onClickNextPage = useCallback(() => {
        const paymentMethodId = paymentMethods.find(i => i.name === paymentMethod);

        dispatch(
            offersFetch({
                page: Number(page) + 1,
                limit: DEFAULT_TABLE_PAGE_LIMIT,
                quote,
                base,
                payment_method: paymentMethodId?.id,
                side,
            }),
        );
    }, [offersFetch, page, DEFAULT_TABLE_PAGE_LIMIT, side, paymentMethod, base, quote, paymentMethods]);

    const retrieveData = useCallback((amountPrecision: number, pricePrecision: number) => (
        list.map(item => {
            const {
                id,
                price,
                user,
                available_amount,
                quote,
                min_order_amount,
                max_order_amount,
                base,
                payment_methods,
            } = item;

            return [
                <div className="advertisers" key={id}>
                    <AvatarIcon fillColor="var(--icons)"/>
                    <div className="font-small ml-small">
                        {user?.user_nickname || user?.user_uid}
                        <div className='sec-row'>
                            <span className="font-small secondary">{user?.offers_count}&nbsp;{intl.formatMessage({ id: 'page.body.p2p.table.offers' })}</span>
                            {user?.success_rate ? <span className="font-small secondary ml-24">{+user?.success_rate * 100}% {intl.formatMessage({ id: 'page.body.p2p.table.completion' })}</span> : null}
                        </div>
                    </div>
                </div>,
                <div className="price" key={id}>
                    {Decimal.format(price, pricePrecision, ',')}&nbsp;
                    <span className="font-big secondary">{quote?.toUpperCase()}</span>
                </div>,
                <div className="limit" key={id}>
                    <div className="limit-col">
                        <span className="font-small secondary">{intl.formatMessage({ id: 'page.body.p2p.table.available' })}</span>
                        <span className="font-small secondary sec-row">{intl.formatMessage({ id: 'page.body.p2p.table.limit' })}</span>
                    </div>
                    <div className="limit-col">
                        <span className="font-big ml-small">{Decimal.format(+available_amount, amountPrecision, ',')} {base?.toUpperCase()}</span>
                        <span className="font-big ml-small sec-row">{Decimal.format(+min_order_amount * +price, pricePrecision, ',')} - {Decimal.format(+max_order_amount * +price, pricePrecision, ',')} {quote?.toUpperCase()}</span>
                    </div>
                </div>,
                <div className="payment" key={id}>
                    {payment_methods.map(i => (
                        <div className="payment-item" key={i.id}>
                            <img className="payment-method-logo ml-2 mr-3 mb-1" src={`${HOST_URL}/api/v2/p2p/public/payment_methods/${i?.payment_method?.id}/logo`} alt=""/>
                            <span className="font-small secondary">{i.payment_method.name}</span>
                        </div>
                    ))}
                </div>,
                <div className="trade" key={id}>
                    <Button
                        onClick={() => props.onClickTrade(item)}
                        size="lg"
                        variant={side}
                    >
                        {intl.formatMessage({ id: `page.body.p2p.tabs.${side}` })} {base.toUpperCase()}
                    </Button>
                </div>
            ];
        })
    ), [list]);

    const tableData = useCallback(() => {
        if (list.length === 0) {
            return [[]];
        }

        const amountPrecision = wallets.find(w => w.currency === base.toLowerCase())?.fixed || DEFAULT_CCY_PRECISION;
        const pricePrecision = wallets.find(obj => obj.currency === list[0].quote)?.fixed || DEFAULT_FIAT_PRECISION;

        return retrieveData(amountPrecision, pricePrecision);
    }, [list, wallets, base]);

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
