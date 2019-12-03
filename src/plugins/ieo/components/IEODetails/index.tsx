import { Decimal } from '@openware/components';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { localeDate } from '../../../../helpers';
import { Currency } from '../../../../modules';
import { DataIEOInterface } from '../../modules';

interface OwnProps {
    currentIEO: DataIEOInterface;
    currencies: Currency[];
}

type Props = OwnProps & InjectedIntlProps;

class IEODetailsComponent extends React.Component<Props> {
    public translate = (e: string) => {
        return this.props.intl.formatMessage({ id: e });
    };

    // tslint:disable-next-line: cyclomatic-complexity
    public render() {
        const { currentIEO, currencies } = this.props;
        const quoteCurrency = currencies.length && currencies.find(currency => currency.id && currency.id.toLowerCase() === currentIEO.pairs[0].quote_currency_id && currentIEO.pairs[0].quote_currency_id.toLowerCase());

        return (
            <div className="ieo-profile-details">
                <div className="ieo-profile-details__header">{this.translate('page.body.ieo.profile.details.header')}</div>
                <div className="ieo-profile-details__body">
                    <div className="ieo-profile-details__body__left">
                        <div className="ieo-profile-details__body__left__row">
                            <div className="ieo-profile-details__body__left__row__first-column">
                                {this.translate('page.body.ieo.profile.details.full.name')}
                            </div>
                            <div className="ieo-profile-details__body__left__row__second-column">{currentIEO.metadata && currentIEO.metadata.full_name || '-'}</div>
                        </div>
                        <div className="ieo-profile-details__body__left__row">
                            <div className="ieo-profile-details__body__left__row__first-column">
                                {this.translate('page.body.ieo.profile.details.session.supply')}
                            </div>
                            <div className="ieo-profile-details__body__left__row__second-column">
                                {currentIEO.metadata ? `${Decimal.format(currentIEO.supply, +currentIEO.metadata.precision)} ${currentIEO.currency_id && currentIEO.currency_id.toUpperCase()}` : '-'}
                            </div>
                        </div>
                        <div className="ieo-profile-details__body__left__row">
                            <div className="ieo-profile-details__body__left__row__first-column">
                                {this.translate('page.body.ieo.profile.details.total.supply')}
                            </div>
                            <div className="ieo-profile-details__body__left__row__second-column">
                                {currentIEO.metadata ? `${Decimal.format(currentIEO.metadata.total_supply, +currentIEO.metadata.precision)} ${currentIEO.currency_id && currentIEO.currency_id.toUpperCase()}` : '-'}
                            </div>
                        </div>
                        <div className="ieo-profile-details__body__left__row">
                            <div className="ieo-profile-details__body__left__row__first-column">
                                {this.translate('page.body.ieo.profile.details..ieo.ratio')}
                            </div>
                            <div className="ieo-profile-details__body__left__row__second-column">{currentIEO.ratio || '-'}</div>
                        </div>
                        <div className="ieo-profile-details__body__left__row">
                            <div className="ieo-profile-details__body__left__row__first-column">
                                {this.translate('page.body.ieo.profile.details.pre.sale.price')}
                            </div>
                            <div className="ieo-profile-details__body__left__row__second-column">
                                {quoteCurrency && Decimal.format(currentIEO.pairs[0].price, +quoteCurrency.precision)}&nbsp;
                                {(currentIEO.pairs[0].quote_currency_id && currentIEO.pairs[0].quote_currency_id.toUpperCase()) || '-'}
                            </div>
                        </div>
                        <div className="ieo-profile-details__body__left__row">
                            <div className="ieo-profile-details__body__left__row__first-column">
                                {this.translate('page.body.ieo.profile.details.maximum.contribution')}
                            </div>
                            <div className="ieo-profile-details__body__left__row__second-column">
                                {currentIEO.metadata ? `${Decimal.format(currentIEO.max_amount, +currentIEO.metadata.precision)} ${currentIEO.currency_id && currentIEO.currency_id.toUpperCase()}` : '-'}
                            </div>
                        </div>
                        <div className="ieo-profile-details__body__left__row">
                            <div className="ieo-profile-details__body__left__row__first-column">
                                {this.translate('page.body.ieo.profile.details.minimum.contribution')}
                            </div>
                            <div className="ieo-profile-details__body__left__row__second-column">
                                {currentIEO.metadata ? `${Decimal.format(currentIEO.min_amount, +currentIEO.metadata.precision)} ${currentIEO.currency_id && currentIEO.currency_id.toUpperCase()}` : '-'}
                            </div>
                        </div>
                        <div className="ieo-profile-details__body__left__row">
                            <div className="ieo-profile-details__body__left__row__first-column">
                                {this.translate('page.body.ieo.profile.details.ieo.start')}
                            </div>
                            <div className="ieo-profile-details__body__left__row__second-column">
                                {localeDate(currentIEO.starts_at, 'fullDate') || '-'}
                            </div>
                        </div>
                        <div className="ieo-profile-details__body__left__row">
                            <div className="ieo-profile-details__body__left__row__first-column">
                                {this.translate('page.body.ieo.profile.details.ieo.end')}
                            </div>
                            <div className="ieo-profile-details__body__left__row__second-column">
                                {localeDate(currentIEO.finishes_at, 'fullDate') || '-'}
                            </div>
                        </div>
                    </div>
                    <div className="ieo-profile-details__body__right">
                        <div className="ieo-profile-details__body__right__row">
                            <div className="ieo-profile-details__body__right__row__first-column">
                                {this.translate('page.body.ieo.profile.details.technological.foundation')}
                            </div>
                            <div className="ieo-profile-details__body__right__row__second-column">{currentIEO.metadata && currentIEO.metadata.technological_foundation || '-'}</div>
                        </div>
                        <div className="ieo-profile-details__body__right__row">
                            <div className="ieo-profile-details__body__right__row__first-column">
                                {this.translate('page.body.ieo.profile.details.website')}
                            </div>
                            {this.getLinkIfExist(currentIEO.metadata && currentIEO.metadata.website)}
                        </div>
                        <div className="ieo-profile-details__body__right__row">
                            <div className="ieo-profile-details__body__right__row__first-column">
                                {this.translate('page.body.ieo.profile.details.whitepaper')}
                            </div>
                            {this.getLinkIfExist(currentIEO.metadata && currentIEO.metadata.whitepaper)}
                        </div>
                        <div className="ieo-profile-details__body__right__row">
                            <div className="ieo-profile-details__body__right__row__first-column">
                                {this.translate('page.body.ieo.profile.details.telegram')}
                            </div>
                            {this.getLinkIfExist(currentIEO.metadata && currentIEO.metadata.telegram)}
                         </div>
                        <div className="ieo-profile-details__body__right__row">
                            <div className="ieo-profile-details__body__right__row__first-column">
                                {this.translate('page.body.ieo.profile.details.twitter')}
                            </div>
                            {this.getLinkIfExist(currentIEO.metadata && currentIEO.metadata.twitter)}
                         </div>
                        <div className="ieo-profile-details__body__right__row">
                            <div className="ieo-profile-details__body__right__row__first-column">
                                {this.translate('page.body.ieo.profile.details.bicointalk')}
                            </div>
                            {this.getLinkIfExist(currentIEO.metadata && currentIEO.metadata.bitcointalk)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    private getLinkIfExist = link => (
        link ? <a className="ieo-profile-details__body__right__row__second-column-link" href={link}>{link}</a> :
            <div className="ieo-profile-details__body__right__row__second-column">-</div>
    );
}

export const IEODetails = injectIntl(IEODetailsComponent);
