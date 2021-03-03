import * as React from 'react';
import { Button } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { LogoIcon } from '../../../assets/images/LogoIcon';
import { ProfileIcon } from '../../../assets/images/sidebar/ProfileIcon';
import { selectUserLoggedIn } from '../../../modules';
import {
    CustomizationSettingsInterface,
    LogoInterface,
} from '../../../themes';

const noHeaderRoutes = ['/setup'];

const HeaderComponent: React.FC = () => {
    const userLoggedIn = useSelector(selectUserLoggedIn);
    const intl = useIntl();
    const shouldRenderHeader =
        !noHeaderRoutes.some((r) => location.pathname.includes(r)) && location.pathname !== '/';

    if (!shouldRenderHeader) {
        return <React.Fragment />;
    }

    const handleGetImageFromConfig = (): LogoInterface | undefined => {
        const settingsFromConfig: CustomizationSettingsInterface | undefined =
            window.env?.palette ? JSON.parse(window.env.palette) : undefined;

        return settingsFromConfig?.['header_logo'];
    };

    const image = handleGetImageFromConfig();

    return (
        <div className="pg-mobile-header">
            <Link to="/" className="pg-mobile-header__logo">
                {image?.url ? (
                    <img
                        src={image.url}
                        alt="Header logo"
                        className="pg-mobile-header__logo__icon"
                        style={{ width: image?.width ? `${image.width}px` : 'auto'}}
                    />
                ) : (
                    <LogoIcon
                        className="pg-mobile-header__logo__icon"
                        styles={{ width: image?.width ? `${image.width}px` : 'auto'}}
                    />
                )}
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
