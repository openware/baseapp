import * as React from 'react';
import { connect } from 'react-redux';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { Link, RouteProps, withRouter } from 'react-router-dom';
import { MarketsTable } from '../../containers';
import {
    RootState,
    selectUserLoggedIn,
} from '../../modules';

const LogoImage = require('../../assets/images/logo.svg');
const FourthFeaturesIcon1 = require('../../assets/images/landing/features/Icon1.svg');
const FourthFeaturesIcon2 = require('../../assets/images/landing/features/Icon2.svg');
const FourthFeaturesIcon3 = require('../../assets/images/landing/features/Icon3.svg');
const FourthFeaturesIcon4 = require('../../assets/images/landing/features/Icon4.svg');
const FourthFeaturesIcon5 = require('../../assets/images/landing/features/Icon5.svg');
const FourthFeaturesIcon6 = require('../../assets/images/landing/features/Icon6.svg');

const SocialIcon1 = require('../../assets/images/landing/social/Icon1.svg');
const SocialIcon2 = require('../../assets/images/landing/social/Icon2.svg');
const SocialIcon3 = require('../../assets/images/landing/social/Icon3.svg');
const SocialIcon4 = require('../../assets/images/landing/social/Icon4.svg');
const SocialIcon5 = require('../../assets/images/landing/social/Icon5.svg');
const SocialIcon6 = require('../../assets/images/landing/social/Icon6.svg');
const SocialIcon7 = require('../../assets/images/landing/social/Icon7.svg');
const SocialIcon8 = require('../../assets/images/landing/social/Icon8.svg');


interface ReduxProps {
    isLoggedIn: boolean;
}

type Props = ReduxProps & RouteProps & InjectedIntlProps;

class Landing extends React.Component<Props> {
    public renderHeader() {
        if (this.props.isLoggedIn) {
            return (
                <div className="pg-landing-screen__header">
                    <div className="pg-landing-screen__header__wrap">
                        <div className="pg-landing-screen__header__wrap__left" onClick={e => this.handleScrollTop()}>
                            <img src={LogoImage} alt="BaseApp Logo"/>
                        </div>
                        <div className="pg-landing-screen__header__wrap__right">
                            <Link to="/profile" className="landing-button">
                                {this.translate('page.body.landing.header.button1')}
                            </Link>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="pg-landing-screen__header">
                <div className="pg-landing-screen__header__wrap">
                    <div className="pg-landing-screen__header__wrap__left" onClick={e => this.handleScrollTop()}>
                        <img src={LogoImage} alt="BaseApp Logo"/>
                    </div>
                    <div className="pg-landing-screen__header__wrap__right">
                        <Link to="/signin" className="landing-button landing-button--simple">
                            {this.translate('page.body.landing.header.button2')}
                        </Link>
                        <Link to="/signup" className="landing-button">
                            {this.translate('page.body.landing.header.button3')}
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

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

    public renderFifthBlock() {
        return (
            <div className="pg-landing-screen__fifth">
                <div className="pg-landing-screen__fifth__wrap">
                    <div className="pg-landing-screen__fifth__wrap__image"/>
                    <div className="pg-landing-screen__fifth__wrap__content">
                        <h1>{this.translate('page.body.landing.fifth.item.title')}</h1>
                        <h2>{this.translate('page.body.landing.fifth.item.text1')}</h2>
                        <h2>{this.translate('page.body.landing.fifth.item.text2')}</h2>
                        <h2>{this.translate('page.body.landing.fifth.item.text3')}</h2>
                        <Link to="/trading/" className="landing-button">
                            {this.translate('page.body.landing.fifth.item.button')}
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    public renderSixthBlock() {
        return (
            <div className="pg-landing-screen__sixth">
                <div className="pg-landing-screen__sixth__wrap">
                    <h1>{this.translate('page.body.landing.sixth.title')}</h1>
                    <div className="pg-landing-screen__sixth__wrap__content">
                        <Link to="/signup" className="landing-button">
                            {this.translate('page.body.landing.sixth.button1')}
                        </Link>
                        <Link to="/trading/" className="landing-button landing-button--secondary">
                            {this.translate('page.body.landing.sixth.button2')}
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    public renderFooter() {
        return (
            <div className="pg-landing-screen__footer">
                <div className="pg-landing-screen__footer__wrap">
                    <div className="pg-landing-screen__footer__wrap__left" onClick={e => this.handleScrollTop()}>
                        <img src={LogoImage} alt="BaseApp Logo"/>
                    </div>
                    <div className="pg-landing-screen__footer__wrap__navigation">
                        <div className="pg-landing-screen__footer__wrap__navigation__col">
                            <Link to="/trading/">{this.translate('page.body.landing.footer.link1')}</Link>
                            <Link to="/wallets">{this.translate('page.body.landing.footer.link2')}</Link>
                            <Link to="/">{this.translate('page.body.landing.footer.link3')}</Link>
                        </div>
                        <div className="pg-landing-screen__footer__wrap__navigation__col">
                            <Link to="/">{this.translate('page.body.landing.footer.link4')}</Link>
                            <Link to="/">{this.translate('page.body.landing.footer.link5')}</Link>
                            <Link to="/">{this.translate('page.body.landing.footer.link6')}</Link>
                        </div>
                        <div className="pg-landing-screen__footer__wrap__navigation__col">
                            <Link to="/">{this.translate('page.body.landing.footer.link7')}</Link>
                            <Link to="/">{this.translate('page.body.landing.footer.link8')}</Link>
                            <Link to="/">{this.translate('page.body.landing.footer.link9')}</Link>
                        </div>
                    </div>
                    <div className="pg-landing-screen__footer__wrap__social">
                        <div className="pg-landing-screen__footer__wrap__social__row">
                            <img src={SocialIcon1} alt="" />
                            <img src={SocialIcon2} alt="" />
                            <img src={SocialIcon3} alt="" />
                            <img src={SocialIcon4} alt="" />
                        </div>
                        <div className="pg-landing-screen__footer__wrap__social__row">
                            <img src={SocialIcon5} alt="" />
                            <img src={SocialIcon6} alt="" />
                            <img src={SocialIcon7} alt="" />
                            <img src={SocialIcon8} alt="" />
                        </div>
                    </div>
                </div>
                <span className="pg-landing-screen__footer__rights">{this.translate('page.body.landing.footer.rights')}</span>
            </div>
        );
    }

    public render() {
        return (
            <div className="pg-landing-screen">
                {this.renderHeader()}
                {this.renderFirstBlock()}
                {this.renderSecondBlock()}
                {this.renderThirdBlock()}
                {this.renderFourthBlock()}
                {this.renderFifthBlock()}
                {this.renderSixthBlock()}
                {this.renderFooter()}
            </div>
        );
    }

    private handleScrollTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    private translate = (key: string) => this.props.intl.formatMessage({id: key});
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    isLoggedIn: selectUserLoggedIn(state),
});

// tslint:disable no-any
export const LandingScreen = withRouter(injectIntl(connect(mapStateToProps, null)(Landing) as any));
