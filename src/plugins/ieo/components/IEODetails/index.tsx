import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';


type Props = InjectedIntlProps;

const name = 'OWC';
const fullName = 'Openware Coin Market';
const sessionSupply = '600 000 000';
const sessionSupplyCoin = 'OWC';
const totalSupply = '600 000 000';
const totalSupplyCoin = 'OWC';
const ieoRatio = '0.00125 BTC = 2500 OWC';
const preSalePrice = '0.0000005';
const preSalePriceCoin = 'BTC';
const minimumContribution = '--';
const ieoStartTime = '2019-09-30 10:00:00';
const ieoEndTime = '2019-10-30 09:00:00';

const technologicalFoundation = 'ERC20';
const websiteLink = 'https://www.openware.com';
const whitepaperLink = 'https://www.openware.com/whitepaper_eng.pdf';
const telegram = 'https://t.me/Openware';
const twitter = 'https://twitter.com/OpenWare';
const bicointalk = '--';

class IEODetailsComponent extends React.Component<Props> {
    public translate = (e: string) => {
        return this.props.intl.formatMessage({ id: e });
    };
    public render() {
        return (
            <div className="ieo-profile-details">
                <div className="ieo-profile-details__header">{this.translate('page.body.ieo.profile.details.header')}</div>
                <div className="ieo-profile-details__body">
                    <div className="ieo-profile-details__body__left">
                        <div className="ieo-profile-details__body__left__row">
                            <div className="ieo-profile-details__body__left__row__first-column">
                                {this.translate('page.body.ieo.profile.details.name')}
                            </div>
                            <div className="ieo-profile-details__body__left__row__second-column">{name}</div>
                        </div>
                        <div className="ieo-profile-details__body__left__row">
                            <div className="ieo-profile-details__body__left__row__first-column">
                                {this.translate('page.body.ieo.profile.details.full.name')}
                            </div>
                            <div className="ieo-profile-details__body__left__row__second-column">{fullName}</div>
                        </div>
                        <div className="ieo-profile-details__body__left__row">
                            <div className="ieo-profile-details__body__left__row__first-column">
                                {this.translate('page.body.ieo.profile.details.session.supply')}
                            </div>
                            <div className="ieo-profile-details__body__left__row__second-column">
                                {sessionSupply}&nbsp;{sessionSupplyCoin}
                            </div>
                        </div>
                        <div className="ieo-profile-details__body__left__row">
                            <div className="ieo-profile-details__body__left__row__first-column">
                                {this.translate('page.body.ieo.profile.details.total.supply')}
                            </div>
                            <div className="ieo-profile-details__body__left__row__second-column">
                                {totalSupply}&nbsp;{totalSupplyCoin}
                            </div>
                        </div>
                        <div className="ieo-profile-details__body__left__row">
                            <div className="ieo-profile-details__body__left__row__first-column">
                                {this.translate('page.body.ieo.profile.details..ieo.ratio')}
                            </div>
                            <div className="ieo-profile-details__body__left__row__second-column">{ieoRatio}</div>
                        </div>
                        <div className="ieo-profile-details__body__left__row">
                            <div className="ieo-profile-details__body__left__row__first-column">
                                {this.translate('page.body.ieo.profile.details.pre.sale.price')}
                            </div>
                            <div className="ieo-profile-details__body__left__row__second-column">
                                {preSalePrice}&nbsp;{preSalePriceCoin}
                            </div>
                        </div>
                        <div className="ieo-profile-details__body__left__row">
                            <div className="ieo-profile-details__body__left__row__first-column">
                                {this.translate('page.body.ieo.profile.details.minimum.contribution')}
                            </div>
                            <div className="ieo-profile-details__body__left__row__second-column">{minimumContribution}</div>
                        </div>
                        <div className="ieo-profile-details__body__left__row">
                            <div className="ieo-profile-details__body__left__row__first-column">
                                {this.translate('page.body.ieo.profile.details.ieo.start')}
                            </div>
                            <div className="ieo-profile-details__body__left__row__second-column">{ieoStartTime}</div>
                        </div>
                        <div className="ieo-profile-details__body__left__row">
                            <div className="ieo-profile-details__body__left__row__first-column">
                                {this.translate('page.body.ieo.profile.details.ieo.end')}
                            </div>
                            <div className="ieo-profile-details__body__left__row__second-column">{ieoEndTime}</div>
                        </div>
                    </div>
                    <div className="ieo-profile-details__body__right">
                        <div className="ieo-profile-details__body__right__row">
                            <div className="ieo-profile-details__body__right__row__first-column">
                                {this.translate('page.body.ieo.profile.details.technological.foundation')}
                            </div>
                            <div className="ieo-profile-details__body__right__row__second-column">{technologicalFoundation}</div>
                        </div>
                        <div className="ieo-profile-details__body__right__row">
                            <div className="ieo-profile-details__body__right__row__first-column">
                                {this.translate('page.body.ieo.profile.details.website')}
                            </div>
                            <div className="ieo-profile-details__body__right__row__second-column">{websiteLink}</div>
                        </div>
                        <div className="ieo-profile-details__body__right__row">
                            <div className="ieo-profile-details__body__right__row__first-column">
                                {this.translate('page.body.ieo.profile.details.whitepaper')}
                            </div>
                            <div className="ieo-profile-details__body__right__row__second-column">{whitepaperLink}</div>
                        </div>
                        <div className="ieo-profile-details__body__right__row">
                            <div className="ieo-profile-details__body__right__row__first-column">
                                {this.translate('page.body.ieo.profile.details.telegram')}
                            </div>
                            <div className="ieo-profile-details__body__right__row__second-column">{telegram}</div>
                        </div>
                        <div className="ieo-profile-details__body__right__row">
                            <div className="ieo-profile-details__body__right__row__first-column">
                                {this.translate('page.body.ieo.profile.details.twitter')}
                            </div>
                            <div className="ieo-profile-details__body__right__row__second-column">{twitter}</div>
                        </div>
                        <div className="ieo-profile-details__body__right__row">
                            <div className="ieo-profile-details__body__right__row__first-column">
                                {this.translate('page.body.ieo.profile.details.bicointalk')}
                            </div>
                            <div className="ieo-profile-details__body__right__row__second-column">{bicointalk}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export const IEODetails = injectIntl(IEODetailsComponent);
