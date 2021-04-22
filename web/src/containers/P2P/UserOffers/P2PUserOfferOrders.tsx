import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Table } from '../../../components';
import {
    cancelOffer,
    Offer,
    userOfferOrdersFetch,
    RootState,
    selectP2PUserOfferOrders,
    selectP2PUserOffers,
} from '../../../modules';

interface ParentProps {
    offerId: number;
}

type Props = ParentProps;

const P2PUserOfferOrders: FC<Props> = (props: Props): ReactElement => {
    const [currentOffer, setCurrentOffer] = useState<Offer>(null);
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const list = useSelector(selectP2PUserOfferOrders);
    const offers = useSelector(selectP2PUserOffers);
    const translate = useCallback((id: string) => formatMessage({ id }), [formatMessage]);

    useEffect(() => {
        dispatch(userOfferOrdersFetch({ offer_id: props.offerId }));
    }, []);

    useEffect(() => {
        const offer = offers.find(o => o.id === props.offerId);
        if (offer) {
            setCurrentOffer(offer);
        } else {
            list.length ? setCurrentOffer(list[0].offer) : null;
        }
    }, [offers, list]);

    const handleCancel = useCallback((id: number) => () => {
        dispatch(cancelOffer({ id, list: [] }));
    }, [cancelOffer, dispatch]);

    const headerTitles = () => [
        translate('page.body.p2p.my.offer_orders.table.date'),
        translate('page.body.p2p.my.offer_orders.table.side'),
        translate('page.body.p2p.my.offer_orders.table.price'),
        translate('page.body.p2p.my.offer_orders.table.quantity'),
        translate('page.body.p2p.my.offer_orders.table.counterparty'),
        translate('page.body.p2p.my.offer_orders.table.status'),
    ];

    const retrieveData = useCallback(() => (
        list && list.length ? list.map(item => {
            return [
                <span key={item.id}>{item.created_at}</span>,
                <span key={item.id}>{item.side}</span>,
                <span key={item.id}>{`${item.offer.price} ${item.offer.base}/${item.offer.quote}`}</span>,
                <span key={item.id}>{`${item.amount} ${item.offer.quote}`}</span>,
                <span key={item.id}>{item.offer.user.user_nickname}</span>,
                <span key={item.id}>{item.state}</span>,
            ];
        }) : []
    ), [list]);

    const p2pOfferInfo = useCallback(() => {
        return currentOffer ? (
            <div className="cr-user-p2p-offer-info">
                <div>
                    <span>{currentOffer.created_at}</span>
                    <label>{translate('page.body.p2p.my.offer_orders.table.date')}</label>
                </div>
                <div>
                    <span>{currentOffer.side}</span>
                    <label>{translate('page.body.p2p.my.offer_orders.table.side')}</label>
                </div>
                <div>
                    <span>{`${currentOffer.base.toUpperCase()}/${currentOffer.quote.toUpperCase()}`}</span>
                    <label></label>
                </div>
                <div>
                    <span>{`${currentOffer.available_amount} ${currentOffer.base.toUpperCase()}`}</span>
                    <label>{translate('page.body.p2p.my.offer_orders.table.available')}</label>
                </div>
                <div>
                    <span>{`${currentOffer.price} ${currentOffer.quote.toUpperCase()}`}</span>
                    <label>{translate('page.body.p2p.my.offer_orders.table.price')}</label>
                </div>
                <div>
                    <span>{currentOffer.state}</span>
                    <label>{translate('page.body.p2p.my.offer_orders.table.status')}</label>
                </div>
                <div>
                    <Button onClick={handleCancel(currentOffer.id)} variant="secondary">
                        {translate('page.body.p2p.my.offers.table.cancel')}
                    </Button>
                </div>
            </div>
        ) : (
            <div className="cr-user-p2p-offer-info"></div>
        )
    }, [currentOffer]);

    return (
        <div className="cr-user-p2p-offer-orders">
            {p2pOfferInfo()}
            <div className="cr-user-p2p-offer-orders-table">
                <Table header={headerTitles()} data={retrieveData()}/>
            </div>
        </div>
    );
};

export {
    P2PUserOfferOrders,
}
