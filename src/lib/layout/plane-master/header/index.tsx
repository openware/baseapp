import React from 'react';
import { Button } from 'react-bootstrap';

import './index.scss';

import { AppUrls } from 'lib/url';
import { useLocalization } from 'lib/hooks';
import { NLogoIcon } from 'lib/icons';

export const PlaneHeader: React.FC = () => {
    const localization = useLocalization();
    return (
        <div className="plane-header">
            <div className="plane-header__content">
                <NLogoIcon />
                <Button href={AppUrls.profile.path}>{localization.page.header.navbar.signIn}</Button>
            </div>
        </div>
    );
};
