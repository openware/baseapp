import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { DataIEOInterface } from '../../modules';
import { DetailsIEOInterface } from '../../screens';

interface OwnProps {
    ieoDetails: DetailsIEOInterface;
    currentIEO: DataIEOInterface;
}

type Props = OwnProps & InjectedIntlProps;

class IEODetailsComponent extends React.Component<Props> {
    public translate = (e: string) => {
        return this.props.intl.formatMessage({ id: e });
    };

    public render() {
        const { ieoDetails, currentIEO } = this.props;

        return (
            <div className="ieo-profile-details">
                <div className="ieo-profile-details__header">{this.translate('page.body.ieo.profile.details.header')}</div>
                <div className="ieo-profile-details__body">
                    <div className="ieo-profile-details__body__left">
                        <div className="ieo-profile-details__body__left__row">
                            <div className="ieo-profile-details__body__left__row__first-column">
                                {this.translate('page.body.ieo.profile.details.name')}
                            </div>
                            <div className="ieo-profile-details__body__left__row__second-column">{ieoDetails.name || '-'}</div>
                        </div>
                        <div className="ieo-profile-details__body__left__row">
                            <div className="ieo-profile-details__body__left__row__first-column">
                                {this.translate('page.body.ieo.profile.details.full.name')}
                            </div>
                            <div className="ieo-profile-details__body__left__row__second-column">{ieoDetails.full_name || '-'}</div>
                        </div>
                        <div className="ieo-profile-details__body__left__row">
                            <div className="ieo-profile-details__body__left__row__first-column">
                                {this.translate('page.body.ieo.profile.details.session.supply')}
                            </div>
                            <div className="ieo-profile-details__body__left__row__second-column">
                                {ieoDetails.session_supply}&nbsp;{ieoDetails.name && ieoDetails.name.toUpperCase() || '-'}
                            </div>
                        </div>
                        <div className="ieo-profile-details__body__left__row">
                            <div className="ieo-profile-details__body__left__row__first-column">
                                {this.translate('page.body.ieo.profile.details.total.supply')}
                            </div>
                            <div className="ieo-profile-details__body__left__row__second-column">
                                {ieoDetails.total_supply}&nbsp;{ieoDetails.name && ieoDetails.name.toUpperCase() || '-'}
                            </div>
                        </div>
                        <div className="ieo-profile-details__body__left__row">
                            <div className="ieo-profile-details__body__left__row__first-column">
                                {this.translate('page.body.ieo.profile.details..ieo.ratio')}
                            </div>
                            <div className="ieo-profile-details__body__left__row__second-column">{ieoDetails.ratio || '-'}</div>
                        </div>
                        <div className="ieo-profile-details__body__left__row">
                            <div className="ieo-profile-details__body__left__row__first-column">
                                {this.translate('page.body.ieo.profile.details.pre.sale.price')}
                            </div>
                            <div className="ieo-profile-details__body__left__row__second-column">
                                {ieoDetails.price}&nbsp;{currentIEO.pairs[0].quote_currency_id && currentIEO.pairs[0].quote_currency_id.toUpperCase() || '-'}
                            </div>
                        </div>
                        <div className="ieo-profile-details__body__left__row">
                            <div className="ieo-profile-details__body__left__row__first-column">
                                {this.translate('page.body.ieo.profile.details.minimum.contribution')}
                            </div>
                            <div className="ieo-profile-details__body__left__row__second-column">{ieoDetails.min_contribution || '-'}</div>
                        </div>
                        <div className="ieo-profile-details__body__left__row">
                            <div className="ieo-profile-details__body__left__row__first-column">
                                {this.translate('page.body.ieo.profile.details.ieo.start')}
                            </div>
                            <div className="ieo-profile-details__body__left__row__second-column">{ieoDetails.start_time || '-'}</div>
                        </div>
                        <div className="ieo-profile-details__body__left__row">
                            <div className="ieo-profile-details__body__left__row__first-column">
                                {this.translate('page.body.ieo.profile.details.ieo.end')}
                            </div>
                            <div className="ieo-profile-details__body__left__row__second-column">{ieoDetails.end_time || '-'}</div>
                        </div>
                    </div>
                    <div className="ieo-profile-details__body__right">
                        <div className="ieo-profile-details__body__right__row">
                            <div className="ieo-profile-details__body__right__row__first-column">
                                {this.translate('page.body.ieo.profile.details.technological.foundation')}
                            </div>
                            <div className="ieo-profile-details__body__right__row__second-column">{ieoDetails.technological_foundation || '-'}</div>
                        </div>
                        <div className="ieo-profile-details__body__right__row">
                            <div className="ieo-profile-details__body__right__row__first-column">
                                {this.translate('page.body.ieo.profile.details.website')}
                            </div>
                            <div className="ieo-profile-details__body__right__row__second-column">{ieoDetails.website || '-'}</div>
                        </div>
                        <div className="ieo-profile-details__body__right__row">
                            <div className="ieo-profile-details__body__right__row__first-column">
                                {this.translate('page.body.ieo.profile.details.whitepaper')}
                            </div>
                            <div className="ieo-profile-details__body__right__row__second-column">{ieoDetails.whitepaper || '-'}</div>
                        </div>
                        <div className="ieo-profile-details__body__right__row">
                            <div className="ieo-profile-details__body__right__row__first-column">
                                {this.translate('page.body.ieo.profile.details.telegram')}
                            </div>
                            <div className="ieo-profile-details__body__right__row__second-column">{ieoDetails.telegram || '-'}</div>
                        </div>
                        <div className="ieo-profile-details__body__right__row">
                            <div className="ieo-profile-details__body__right__row__first-column">
                                {this.translate('page.body.ieo.profile.details.twitter')}
                            </div>
                            <div className="ieo-profile-details__body__right__row__second-column">{ieoDetails.twitter || '-'}</div>
                        </div>
                        <div className="ieo-profile-details__body__right__row">
                            <div className="ieo-profile-details__body__right__row__first-column">
                                {this.translate('page.body.ieo.profile.details.bicointalk')}
                            </div>
                            <div className="ieo-profile-details__body__right__row__second-column">{ieoDetails.bitcointalk || '-'}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export const IEODetails = injectIntl(IEODetailsComponent);
