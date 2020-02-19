import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { Link, withRouter } from 'react-router-dom';
import { MarketsTable } from '../../containers';

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

    public render() {
        return (
            <div className="pg-landing-screen">
                {this.renderFirstBlock()}
                {this.renderSecondBlock()}
                {this.renderThirdBlock()}
            </div>
        );
    }

    private translate = (key: string) => this.props.intl.formatMessage({id: key});
}

export const LandingScreen = withRouter(injectIntl(LandingScreenClass));
