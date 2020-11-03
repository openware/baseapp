import classnames from 'classnames';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { Link, useLocation } from 'react-router-dom';

import { HomeIcon } from '../../assets/images/footer/HomeIcon';
import { OrderIcon } from '../../assets/images/footer/OrderIcon';
import { ProfileIcon } from '../../assets/images/footer/ProfileIcon';
import { TradeIcon } from '../../assets/images/footer/TradeIcon';
import { WalletIcon } from '../../assets/images/footer/WalletIcon';

const handleGetActiveItemClass = (currentRoute: string, targetRoute: string, absolute?: boolean) => {
    return classnames('pg-mobile-footer__item', {
        'pg-mobile-footer__item--active': absolute ? currentRoute === targetRoute : currentRoute.includes(targetRoute),
    });
};

const FooterComponent: React.FC = () => {
    const { pathname } = useLocation();
    const intl = useIntl();

    return (
        <div className="pg-mobile-footer">
            <Link to="/" className={handleGetActiveItemClass(pathname, '/', true)}>
                <HomeIcon className="pg-mobile-footer__item__icon" />
                <span className="pg-mobile-footer__item__title">
                    {intl.formatMessage({ id: 'page.mobile.footer.home' })}
                </span>
            </Link>
            <Link to="/orders" className={handleGetActiveItemClass(pathname, '/orders')}>
                <OrderIcon className="pg-mobile-footer__item__icon" />
                <span className="pg-mobile-footer__item__title">
                    {intl.formatMessage({ id: 'page.mobile.footer.orders' })}
                </span>
            </Link>
            <Link to="/trading" className={handleGetActiveItemClass(pathname, '/trading')}>
                <TradeIcon className="pg-mobile-footer__item__icon" />
                <span className="pg-mobile-footer__item__title">
                    {intl.formatMessage({ id: 'page.mobile.footer.trading' })}
                </span>
            </Link>
            <Link to="/wallets" className={handleGetActiveItemClass(pathname, '/wallets')}>
                <WalletIcon className="pg-mobile-footer__item__icon" />
                <span className="pg-mobile-footer__item__title">
                    {intl.formatMessage({ id: 'page.mobile.footer.wallets' })}
                </span>
            </Link>
            <Link to="/profile" className={handleGetActiveItemClass(pathname, '/profile')}>
                <ProfileIcon className="pg-mobile-footer__item__icon" />
                <span className="pg-mobile-footer__item__title">
                    {intl.formatMessage({ id: 'page.mobile.footer.profile' })}
                </span>
            </Link>
        </div>
    );
};

export const Footer = React.memo(FooterComponent);
