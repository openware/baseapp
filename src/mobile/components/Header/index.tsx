import * as React from 'react';
import { Button } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { LogoIcon } from '../../../assets/images/LogoIcon';
import { ProfileIcon } from '../../../assets/images/sidebar/ProfileIcon';
import { selectUserLoggedIn } from '../../../modules';

const HeaderComponent = () => {
    const userLoggedIn = useSelector(selectUserLoggedIn);
    const intl = useIntl();

    return (
        <div className="pg-mobile-header">
            <Link to="/" className="pg-mobile-header__logo">
                <LogoIcon className="pg-mobile-header__logo__icon" />
            </Link>
            <div className="pg-mobile-header__account">
                {userLoggedIn ? (
                    <Link to="/profile" className="pg-mobile-header__account__profile">
                        <ProfileIcon className="pg-mobile-header__account__profile__icon" />
                    </Link>
                ) : (
                    <Link to="/signin" className="pg-mobile-header__account__log-in">
                        <Button
                            block={true}
                            type="button"
                            size="lg"
                            variant="primary"
                        >
                            {intl.formatMessage({id: 'page.mobile.header.signIn'})}
                        </Button>
                    </Link>
                )}
            </div>
        </div>
    );
};

export const Header = React.memo(HeaderComponent);
