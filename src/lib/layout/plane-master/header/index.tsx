import React from 'react';
import { Button } from 'react-bootstrap';

import './index.scss';

import { AppUrls } from 'lib/url';
import { useLocalization } from 'lib/hooks';
import { NLogoIcon } from 'lib/icons';
import { AppIcon } from 'lib/app-icon';

export const PlaneHeader: React.FC = () => {
    const localization = useLocalization();
    return (
        <div className="plane-header">
            <div className="plane-header__fixed">
                <div className="plane-header__content">
                    <NLogoIcon />
                    <div className="plane-header__action">
                        <Button href={AppUrls.signIn.path}>{localization.page.header.signIn.title}</Button>
                        <Button href={AppUrls.signUp.path}>{localization.page.header.signUp.title}</Button>
                        <AppIcon name="moon" />
                    </div>
                </div>
            </div>
        </div>
    );
};
