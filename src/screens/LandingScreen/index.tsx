import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { Link, withRouter } from 'react-router-dom';
import { MarketsTable } from '../../containers';

const FourthFeaturesIcon1 = require('../../assets/images/landing/features/Icon1.svg');
const FourthFeaturesIcon2 = require('../../assets/images/landing/features/Icon2.svg');
const FourthFeaturesIcon3 = require('../../assets/images/landing/features/Icon3.svg');
const FourthFeaturesIcon4 = require('../../assets/images/landing/features/Icon4.svg');
const FourthFeaturesIcon5 = require('../../assets/images/landing/features/Icon5.svg');
const FourthFeaturesIcon6 = require('../../assets/images/landing/features/Icon6.svg');

type Props = InjectedIntlProps;

class LandingScreenClass extends React.Component<Props> {
    public renderFirstBlock() {
        return (
            <div className="pg-landing-screen__first">
                <div className="pg-landing-screen__first__wrap">
                    <div className="pg-landing-screen__first__wrap__title">
                        <h1>{this.translate('page.body.landing.first.title.text1')}</h1>
                        <h1>{this.translate('page.body.landing.first.title.text2')}</h1>
                        <Link to="/trading" className="landing-button">
                            {this.translate('page.body.landing.first.title.button')}
                        </Link>
                    </div>
                    <MarketsTable />
                </div>
            </div>
        );
    }

    public renderSecondBlock() {
        return (
            <div className="pg-landing-screen__second">
                <div className="pg-landing-screen__second__wrap">
                    <div className="pg-landing-screen__second__wrap__item">
                        <span>{this.translate('page.body.landing.second.item.first.value')}</span>
                        <span>{this.translate('page.body.landing.second.item.first.title')}</span>
                    </div>
                    <div className="pg-landing-screen__second__wrap__item">
                        <span>{this.translate('page.body.landing.second.item.second.value')}</span>
                        <span>{this.translate('page.body.landing.second.item.second.title')}</span>
                    </div>
                    <div className="pg-landing-screen__second__wrap__item">
                        <span>{this.translate('page.body.landing.second.item.third.value')}</span>
                        <span>{this.translate('page.body.landing.second.item.third.title')}</span>
                    </div>
                </div>
            </div>
        );
    }

    public renderThirdBlock() {
        return (
            <div className="pg-landing-screen__third">
                <div className="pg-landing-screen__third__wrap">
                    <div className="pg-landing-screen__third__wrap__item">
                        <h1>{this.translate('page.body.landing.third.item.title')}</h1>
                        <h2>{this.translate('page.body.landing.third.item.text')}</h2>
                        <Link to="/signup" className="landing-button">
                            {this.translate('page.body.landing.third.item.button')}
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    public renderFourthBlock() {
        return (
            <div className="pg-landing-screen__fourth">
                <div className="pg-landing-screen__fourth__wrap">
                    <h1>{this.translate('page.body.landing.fourth.title')}</h1>
                    <div className="pg-landing-screen__fourth__features">
                        <div className="pg-landing-screen__fourth__features__row">
                            <div className="pg-landing-screen__fourth__features__row__item">
                                <img
                                    src={FourthFeaturesIcon1}
                                    alt={this.translate('page.body.landing.fourth.features.item1.title')}
                                />
                                <h2>{this.translate('page.body.landing.fourth.features.item1.title')}</h2>
                                <span>{this.translate('page.body.landing.fourth.features.item1.text')}</span>
                            </div>
                            <div className="pg-landing-screen__fourth__features__row__item">
                                <img
                                    src={FourthFeaturesIcon2}
                                    alt={this.translate('page.body.landing.fourth.features.item2.title')}
                                />
                                <h2>{this.translate('page.body.landing.fourth.features.item2.title')}</h2>
                                <span>{this.translate('page.body.landing.fourth.features.item2.text')}</span>
                            </div>
                        </div>
                        <div className="pg-landing-screen__fourth__features__row">
                            <div className="pg-landing-screen__fourth__features__row__item">
                                <img
                                    src={FourthFeaturesIcon3}
                                    alt={this.translate('page.body.landing.fourth.features.item3.title')}
                                />
                                <h2>{this.translate('page.body.landing.fourth.features.item3.title')}</h2>
                                <span>{this.translate('page.body.landing.fourth.features.item3.text')}</span>
                            </div>
                            <div className="pg-landing-screen__fourth__features__row__item">
                                <img
                                    src={FourthFeaturesIcon4}
                                    alt={this.translate('page.body.landing.fourth.features.item4.title')}
                                />
                                <h2>{this.translate('page.body.landing.fourth.features.item4.title')}</h2>
                                <span>{this.translate('page.body.landing.fourth.features.item4.text')}</span>
                            </div>
                        </div>
                        <div className="pg-landing-screen__fourth__features__row">
                            <div className="pg-landing-screen__fourth__features__row__item">
                                <img
                                    src={FourthFeaturesIcon5}
                                    alt={this.translate('page.body.landing.fourth.features.item5.title')}
                                />
                                <h2>{this.translate('page.body.landing.fourth.features.item5.title')}</h2>
                                <span>{this.translate('page.body.landing.fourth.features.item5.text')}</span>
                            </div>
                            <div className="pg-landing-screen__fourth__features__row__item">
                                <img
                                    src={FourthFeaturesIcon6}
                                    alt={this.translate('page.body.landing.fourth.features.item6.title')}
                                />
                                <h2>{this.translate('page.body.landing.fourth.features.item6.title')}</h2>
                                <span>{this.translate('page.body.landing.fourth.features.item6.text')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    public render() {
        return (
            <div className="pg-landing-screen">
                {this.renderFirstBlock()}
                {this.renderSecondBlock()}
                {this.renderThirdBlock()}
                {this.renderFourthBlock()}
            </div>
        );
    }

    private translate = (key: string) => this.props.intl.formatMessage({id: key});
}

export const LandingScreen = withRouter(injectIntl(LandingScreenClass));
