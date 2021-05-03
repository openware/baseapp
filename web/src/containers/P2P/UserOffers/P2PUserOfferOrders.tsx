import React, { FC, ReactElement, useCallback } from 'react';
import { Button } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { ArrowRightIcon } from 'src/assets/images/setup/ArrowRightIcon';
import { DEFAULT_CCY_PRECISION, DEFAULT_FIAT_PRECISION } from 'src/constants';
import { localeDate, setOfferStatusColor, setStateType, setTradesType } from 'src/helpers';
import { Decimal, Table } from '../../../components';
import { useCurrenciesFetch, useP2PUserOfferOrdersFetch } from '../../../hooks';
import {
    selectP2PUserOfferOrders,
    P2POrder,
    selectCurrencies,
    cancelOffer,
} from '../../../modules';

interface ParentProps {
    offerId: number;
}

type Props = ParentProps;

const P2PUserOfferOrders: FC<Props> = (props: Props): ReactElement => {
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const offer = useSelector(selectP2PUserOfferOrders);
    const currencies = useSelector(selectCurrencies);
    const history = useHistory();
    const { id } = useParams<{id?: string}>();
    const translate = useCallback((id: string) => formatMessage({ id }), [formatMessage]);

    useP2PUserOfferOrdersFetch({ offer_id: Number(id) });
    useCurrenciesFetch();

    const handleCancel = useCallback((id: number) => () => {
        dispatch(cancelOffer({ id }));
    }, [cancelOffer, dispatch]);

    const headerTitles = () => [
        translate('page.body.p2p.my.offer_orders.table.date'),
        translate('page.body.p2p.my.offer_orders.table.side'),
        translate('page.body.p2p.my.offer_orders.table.price'),
        translate('page.body.p2p.my.offer_orders.table.quantity'),
        translate('page.body.p2p.my.offer_orders.table.counterparty'),
        translate('page.body.p2p.my.offer_orders.table.status'),
        '',
    ];

    const getPrecision = (id: string, currencies) => {
        return currencies.find(i => i.id === id)?.precision || DEFAULT_CCY_PRECISION;
    };

    const retrieveData = useCallback(() => {
        if (!offer?.orders?.length) {
            return [[]];
        }

        const { price, base, quote } = offer;
        const priceItem = `${Decimal.format(price, getPrecision(quote, currencies) || DEFAULT_FIAT_PRECISION, ',')} ${base.toUpperCase()}/${quote.toUpperCase()}`;
        const amountPrecision = getPrecision(base, currencies);

        return offer.orders.map((item: P2POrder) => {
            const { id, created_at, side, amount, user_uid, state } = item;
            const sideColored = setTradesType(side);
            const stateColored = setStateType(state);

            return [
                localeDate(created_at, 'shortDate'),
                <span style={{ color: sideColored.color }}>{sideColored.text}</span>,
                priceItem,
                `${Decimal.format(amount, amountPrecision || DEFAULT_CCY_PRECISION, ',')} ${base.toUpperCase()}`,
                <span>{user_uid}</span>,
                <span style={{ color: stateColored.color }}>{stateColored.text}</span>,
                ['prepared', 'wait'].includes(state) ? <div onClick={() => history.push(`/p2p/order/${id}`)}><ArrowRightIcon className="icon-right" /></div> : null,
            ];
        })
    }, [offer, currencies]);

    const p2pOfferInfo = useCallback(() => {
        const sideColored = setTradesType(offer?.side);
        const amountPrecision = getPrecision(offer?.base, currencies);
        const priceItem = `${Decimal.format(offer?.price, getPrecision(offer?.quote, currencies) || DEFAULT_FIAT_PRECISION, ',')} ${offer?.quote.toUpperCase()}`;

        return offer ? (
            <div className="cr-user-p2p-offer-info">
                <div>
                    <span>{localeDate(offer.created_at, 'fullDate')}</span>
                    <label>{translate('page.body.p2p.my.offer_orders.table.date')}</label>
                </div>
                <div>
                    <span style={{ color: sideColored.color }}>{sideColored.text}</span>
                    <label>{translate('page.body.p2p.my.offer_orders.table.side')}</label>
                </div>
                <div>
                    <span>{`${offer.base.toUpperCase()}/${offer.quote.toUpperCase()}`}</span>
                    <label></label>
                </div>
                <div>
                    <span>{`${Decimal.format(offer.available_amount, amountPrecision || DEFAULT_CCY_PRECISION, ',')} ${offer.base.toUpperCase()}`}</span>
                    <label>{translate('page.body.p2p.my.offer_orders.table.available')}</label>
                </div>
                <div>
                    <span>{priceItem}</span>
                    <label>{translate('page.body.p2p.my.offer_orders.table.price')}</label>
                </div>
                <div>
                    <span style={{ color: setOfferStatusColor(offer.state) }}>{translate(`page.body.p2p.my.offers.${offer.state}`)}</span>
                    <label>{translate('page.body.p2p.my.offer_orders.table.status')}</label>
                </div>
                {offer.state === 'wait' ? (
                    <div>
                        <Button onClick={handleCancel(offer.id)} variant="secondary">
                            {translate('page.body.p2p.my.offers.table.cancel')}
                        </Button>
                    </div>
                ) : null}
            </div>
        ) : (
            <div className="cr-user-p2p-offer-info"></div>
        )
    }, [offer]);

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
