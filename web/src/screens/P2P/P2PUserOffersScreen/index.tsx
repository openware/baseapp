import React, { FC, ReactElement, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from 'src/assets/images/setup/ArrowLeftIcon';
import { P2PUserOffers } from 'src/containers';
import { useDocumentTitle, useP2PCurrenciesFetch, useRangerConnectFetch } from 'src/hooks';

export const P2PUserOffersScreen: FC = (): ReactElement => {
    const { formatMessage } = useIntl();

    useRangerConnectFetch();
    useP2PCurrenciesFetch();
    useDocumentTitle('My P2P offers');

    const translate = useCallback((id: string) => formatMessage({ id: id }), [formatMessage]);

    return (
        <div className="pg-user-p2p-offers pg-container">
            <div className="pg-user-p2p-offers__content">
                <h1 className="pg-user-p2p-offers--title">{translate('page.body.p2p.my.offers.title')}</h1>
                <Link to="/p2p" className="pg-user-p2p-offers--subtitle">
                    <ArrowLeftIcon className="icon"/><span>{translate('page.body.p2p.my.offers.back')}</span>
                </Link>
                <P2PUserOffers state="wait"/>
            </div>
        </div>
    );
};
