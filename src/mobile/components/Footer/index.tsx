import classnames from 'classnames';
import * as React from 'react';
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

const FooterComponent = () => {
    const currentRoute =  useLocation().pathname;

    return (
        <div className="pg-mobile-footer">
            <Link to="/" className={handleGetActiveItemClass(currentRoute, '/', true)}>
                <HomeIcon className="pg-mobile-footer__item__icon" />
                <span className="pg-mobile-footer__item__title">Home</span>
            </Link>
            <Link to="/orders" className={handleGetActiveItemClass(currentRoute, '/orders')}>
                <OrderIcon className="pg-mobile-footer__item__icon" />
                <span className="pg-mobile-footer__item__title">Orders</span>
            </Link>
            <Link to="/trading" className={handleGetActiveItemClass(currentRoute, '/trading')}>
                <TradeIcon className="pg-mobile-footer__item__icon" />
                <span className="pg-mobile-footer__item__title">Trade</span>
            </Link>
            <Link to="/wallets" className={handleGetActiveItemClass(currentRoute, '/wallets')}>
                <WalletIcon className="pg-mobile-footer__item__icon" />
                <span className="pg-mobile-footer__item__title">Wallets</span>
            </Link>
            <Link to="/profile" className={handleGetActiveItemClass(currentRoute, '/profile')}>
                <ProfileIcon className="pg-mobile-footer__item__icon" />
                <span className="pg-mobile-footer__item__title">Profile</span>
            </Link>
        </div>
    );
};

export const Footer = React.memo(FooterComponent);
