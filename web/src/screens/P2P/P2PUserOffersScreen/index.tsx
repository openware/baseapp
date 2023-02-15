import React, { FC, ReactElement, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from 'src/assets/images/setup/ArrowLeftIcon';
import { P2PUserOfferOrders, P2PUserOffers } from 'src/containers';
import { useDocumentTitle, useP2PCurrenciesFetch } from 'src/hooks';

export const P2PUserOffersScreen: FC = (): ReactElement => {
    const { id } = useParams<{ id?: string }>();
    const { formatMessage } = useIntl();

    useP2PCurrenciesFetch();
    useDocumentTitle('My P2P offers');

    const translate = useCallback((key: string) => formatMessage({ id: key }), [formatMessage]);

    const backButton = React.useMemo(
        () =>
            id ? (
                <React.Fragment>
                    <Link to="/p2p/offers" className="pg-user-p2p-offers--subtitle">
                        <ArrowLeftIcon className="icon" />
                        <span>{translate('page.body.p2p.my.offers.back.offers')}</span>
                    </Link>
                    <P2PUserOfferOrders offerId={+id} />
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <Link to="/p2p" className="pg-user-p2p-offers--subtitle">
                        <ArrowLeftIcon className="icon" />
                        <span>{translate('page.body.p2p.my.offers.back')}</span>
                    </Link>
                    <P2PUserOffers />
                </React.Fragment>
            ),
        [id],
    );

    return (
        <div className="pg-user-p2p-offers pg-container">
            <div className="pg-user-p2p-offers__content">
                <h1 className="pg-user-p2p-offers--title">{translate('page.body.p2p.my.offers.title')}</h1>
                {backButton}
            </div>
        </div>
    );
};
