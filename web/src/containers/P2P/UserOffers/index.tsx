import React, { FC, ReactElement, useCallback } from 'react';
import { Button } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { DEFAULT_CCY_PRECISION, DEFAULT_FIAT_PRECISION } from 'src/constants';
import { localeDate, setOfferStatusColor, setTradeColor } from 'src/helpers';
import { Decimal, Pagination, Table } from '../../../components';
import { useCurrenciesFetch, useP2PUserOffersFetch, useWalletsFetch } from '../../../hooks';
import {
    activeOffersFetch,
    cancelledOffersFetch,
    cancelOffer,
    RootState,
    selectP2PCancelOfferLoading,
    selectP2POffersCurrentPage,
    selectP2PUserOffers,
    selectP2PUserOffersFirstElemIndex,
    selectP2PUserOffersLastElemIndex,
    selectP2PUserOffersNextPageExists,
    selectP2PUserOffersTotalNumber,
    selectWallets,
} from '../../../modules';

interface ParentProps {
    status: string;
}

type Props = ParentProps;

const P2PUserOffers: FC<Props> = (props: Props): ReactElement => {
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const page = useSelector(selectP2POffersCurrentPage);
    const { status } = props;
    const translate = useCallback((id: string, value?: any) => formatMessage({ id: id }, { ...value }), [formatMessage]);
    const list = useSelector((state: RootState) => selectP2PUserOffers(state, status));
    const total = useSelector((state: RootState) => selectP2PUserOffersTotalNumber(state, status));
    const firstElemIndex = useSelector((state: RootState) => selectP2PUserOffersFirstElemIndex(state, status, 3));
    const lastElemIndex = useSelector((state: RootState) => selectP2PUserOffersLastElemIndex(state, status, 3));
    const nextPageExists = useSelector((state: RootState) => selectP2PUserOffersNextPageExists(state, status, 3));
    const cancelFetching = useSelector(selectP2PCancelOfferLoading);
    const wallets = useSelector(selectWallets);

    useWalletsFetch();
    useCurrenciesFetch();
    useP2PUserOffersFetch({ limit: 3, page, status });

    const headerTitles = useCallback(() => [
        translate('page.body.p2p.my.offers.table.date'),
        translate('page.body.p2p.my.offers.table.side'),
        translate('page.body.p2p.my.offers.table.asset'),
        translate('page.body.p2p.my.offers.table.amount'),
        translate('page.body.p2p.my.offers.table.price'),
        translate('page.body.p2p.my.offers.table.status'),
        status === 'activeOffers' ? translate('page.body.p2p.my.offers.table.action') : '',
    ], [status]);

    const onClickPrevPage = useCallback(() => {
        if (status === 'activeOffers') {
            activeOffersFetch({ page: Number(page) - 1, limit: 3 });
        } else if (status === 'cancelledOffers') {
            cancelledOffersFetch({ page: Number(page) - 1, limit: 3 });
        }
    }, [activeOffersFetch, cancelledOffersFetch, status, page, 3]);

    const onClickNextPage = useCallback(() => {
        if (status === 'activeOffers') {
            activeOffersFetch({ page: Number(page) + 1, limit: 3 });
        } else if (status === 'cancelledOffers') {
            cancelledOffersFetch({ page: Number(page) + 1, limit: 3 });
        }
    }, [activeOffersFetch, cancelledOffersFetch, status, page, 3]);

    const handleCancel = React.useCallback((id: number) => () => {
        if (cancelFetching) {
            return;
        }
        dispatch(cancelOffer({ id, list }));
    }, [cancelFetching, list, cancelOffer, dispatch]);

    const retrieveData = () => (
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
            } = item;

            const amountPrecision = wallets.find(w => w.currency === base)?.fixed || DEFAULT_CCY_PRECISION;
            const pricePrecision = wallets.find(obj => obj.currency === quote)?.fixed || DEFAULT_FIAT_PRECISION;    

            return [
                localeDate(created_at, 'shortDate'),
                <span style={{ color: setTradeColor(side).color }} key={id}>{translate(`page.body.p2p.my.offers.table.side.${side}`)}</span>,
                `${base?.toUpperCase()}/${quote?.toUpperCase()}`,
                <span key={id}>{Decimal.format(origin_amount, amountPrecision, ',')} {base?.toUpperCase()}</span>,
                <span key={id}>{Decimal.format(price, pricePrecision, ',')} {quote?.toUpperCase()}</span>,
                <span style={{ color: setOfferStatusColor(item.state) }} className="text-capitalize" key={id}>{state}</span>,
                state === 'active' && (
                    <Button key={id} onClick={handleCancel(id)} variant="secondary">
                        {translate('page.body.p2p.my.offers.table.cancel')}
                    </Button>
                ),
            ];
        })
    );

    return (
        <div className="cr-user-p2p-offers">
            <h3 className="cr-user-p2p-offers__title">{translate(`page.body.p2p.my.offers.${status}`)}</h3>
            <div className={`cr-user-p2p-offers-table ${status}`}>
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
        </div>
    );
};

export {
    P2PUserOffers,
};
