import * as React from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router';
import { ChevronIcon } from '../../../assets/images/ChevronIcon';

const ProfileLinksComponent = props => {
    const intl = useIntl();
    const history = useHistory();
    const links = props.links || [];

    const handleRedirect = route => {
        if (history.location.pathname !== route) {
            history.push(route);
        }
    };

    const renderLinkChildren = link => {
        if (link.children) {
            return (
                <div className="pg-mobile-profile-links__item__right">
                    {link.children}
                </div>
            );
        }

        return (
            <div className="pg-mobile-profile-links__item__right">
                <ChevronIcon />
            </div>
        );
    };

    const renderLinksItem = (link, index) => {
        return (
            <div
                key={index}
                className="pg-mobile-profile-links__item"
                onClick={() => handleRedirect(link.route)}
            >
                <span className="pg-mobile-profile-links__item__left">
                    {intl.formatMessage({id: link.titleKey})}
                </span>
                {renderLinkChildren(link)}
            </div>
        );
    };

    return (
        <div className="pg-mobile-profile-links">
            {links.length ? links.map(renderLinksItem) : null}
        </div>
    );
};

export const ProfileLinks = React.memo(ProfileLinksComponent);
