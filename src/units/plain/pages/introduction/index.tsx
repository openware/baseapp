import React from 'react';

import './index.scss';

import { MasterPage } from '../../../../lib/layout/plane-master';
import { useLocalization } from 'lib/hooks';
import { Button } from 'react-bootstrap';
import { AppUrls } from 'lib/url';

export const IntroductionPage: React.FC = () => {
    const localization = useLocalization();
    return (
        <MasterPage>
            <div className="introduction">
                <div className="introduction__wellcome">
                    <div>{localization.page.body.landing.marketInfo.title.text1}</div>
                    <div>{localization.page.body.landing.marketInfo.title.text2}</div>
                    <div>
                        <Button href={AppUrls.trading.url({})}>
                            {localization.page.body.landing.marketInfo.title.button}
                        </Button>
                    </div>
                </div>
                <div className="introduction__statistics">
                    <div className="introduction__stat-item">
                        <div className="introduction__stat-value">
                            {localization.page.body.landing.platformInfo.item.first.value}
                        </div>
                        <div>{localization.page.body.landing.platformInfo.item.first.title}</div>
                    </div>
                    <div className="introduction__stat-item">
                        <div className="introduction__stat-value">
                            {localization.page.body.landing.platformInfo.item.second.value}
                        </div>
                        <div>{localization.page.body.landing.platformInfo.item.second.title}</div>
                    </div>
                    <div className="introduction__stat-item">
                        <div className="introduction__stat-value">
                            {localization.page.body.landing.platformInfo.item.third.value}
                        </div>
                        <div>{localization.page.body.landing.platformInfo.item.third.title}</div>
                    </div>
                </div>
            </div>
        </MasterPage>
    );
};
