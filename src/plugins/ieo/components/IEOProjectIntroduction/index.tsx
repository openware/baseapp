import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';

type Props = InjectedIntlProps;

class IEOProjectIntroductionComponent extends React.Component<Props> {
    public translate = (e: string) => {
        return this.props.intl.formatMessage({ id: e });
    };

    public render() {
        return (
            <div className="ieo-profile-project-introduction">
                <div className="ieo-profile-project-introduction__header">
                    {this.translate('page.body.ieo.profile.introduction.header')}
                </div>
                <div className="ieo-profile-project-introduction__body">
                    <p>{this.translate('page.body.ieo.profile.introduction.welcome')}</p>
                    <p>{this.translate('page.page.body.ieo.profile.introduction.coin.market')}</p>
                    <p>{this.translate('page.page.body.ieo.profile.introduction.owc.present')}</p>
                    <p>{this.translate('page.page.body.ieo.profile.introduction.buy.directly')}</p>
                    <p>{this.translate('page.page.body.ieo.profile.introduction.other.options')}</p>
                    <p>{this.translate('page.page.body.ieo.profile.introduction.option.first')}</p>
                    <p>{this.translate('page.page.body.ieo.profile.introduction.option.second')}</p>
                    <p>{this.translate('page.page.body.ieo.profile.introduction.option.third')}</p>
                    <p>{this.translate('page.page.body.ieo.profile.introduction.option.fourth')}</p>
                    <p>{this.translate('page.page.body.ieo.profile.introduction.complex.deal')}</p>
                    <p>{this.translate('page.page.body.ieo.profile.introduction.togetether.funcrtions')}</p>
                    <p>{this.translate('page.page.body.ieo.profile.introduction.market.remains')}</p>
                    <p>{this.translate('page.page.body.ieo.profile.introduction.dom')}</p>
                    <p>{this.translate('page.page.body.ieo.profile.introduction.dom.willoffer')}</p>
                    <p>{this.translate('page.page.body.ieo.profile.introduction.businesscompanies')}</p>
                    <p>{this.translate('page.page.body.ieo.profile.introduction.learn.more')}</p>
                </div>
            </div>
        );
    }
}

export const IEOProjectIntroduction = injectIntl(IEOProjectIntroductionComponent);
