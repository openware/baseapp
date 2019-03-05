import {
    Button,
    Dropdown,
} from '@openware/components';
import cr from 'classnames';
import countries = require('i18n-iso-countries');
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import MaskInput from 'react-maskinput';
import {
  connect,
  MapDispatchToPropsFunction,
} from 'react-redux';
import { isDateInFuture } from '../../helpers';
import {RootState, selectCurrentLanguage} from '../../modules';
import {
    selectSendIdentitySuccess,
    sendIdentity,
} from '../../modules/user/kyc/identity';
import { labelFetch } from '../../modules/user/kyc/label';
import { nationalities } from '../../translations/nationalities';

interface ReduxProps {
    success?: string;
    lang: string;
}

interface DispatchProps {
    sendIdentity: typeof sendIdentity;
    labelFetch: typeof labelFetch;
}

interface OnChangeEvent {
    target: {
        value: string;
    };
}

interface IdentityState {
    city: string;
    countryOfBirth: string;
    dateOfBirth: string;
    firstName: string;
    lastName: string;
    nationality: string;
    postcode: string;
    residentialAddress: string;
    cityFocused: boolean;
    dateOfBirthFocused: boolean;
    firstNameFocused: boolean;
    lastNameFocused: boolean;
    postcodeFocused: boolean;
    residentialAddressFocused: boolean;
}

type Props = ReduxProps & DispatchProps & InjectedIntlProps;

class IdentityComponent extends React.Component<Props, IdentityState> {
    public state = {
        city: '',
        countryOfBirth: '',
        dateOfBirth: '',
        firstName: '',
        lastName: '',
        nationality: '',
        postcode: '',
        residentialAddress: '',
        cityFocused: false,
        dateOfBirthFocused: false,
        firstNameFocused: false,
        lastNameFocused: false,
        postcodeFocused: false,
        residentialAddressFocused: false,
    };

    public translate = (e: string) => {
        return this.props.intl.formatMessage({id: e});
    };

    public componentDidUpdate(prev: Props) {
        if (!prev.success && this.props.success) {
            this.props.labelFetch();
        }
    }

    public render() {
        const {
            city,
            dateOfBirth,
            firstName,
            lastName,
            postcode,
            residentialAddress,
            cityFocused,
            dateOfBirthFocused,
            firstNameFocused,
            lastNameFocused,
            postcodeFocused,
            residentialAddressFocused,
            countryOfBirth,
            nationality,
        } = this.state;
        const { success, lang } = this.props;

        const cityGroupClass = cr('pg-confirm__content-identity-col-row-content', {
            'pg-confirm__content-identity-col-row-content--focused': cityFocused,
        });

        const dateOfBirthGroupClass = cr('pg-confirm__content-identity-col-row-content', {
            'pg-confirm__content-identity-col-row-content--focused': dateOfBirthFocused,
        });

        const firstNameGroupClass = cr('pg-confirm__content-identity-col-row-content', {
            'pg-confirm__content-identity-col-row-content--focused': firstNameFocused,
        });

        const lastNameGroupClass = cr('pg-confirm__content-identity-col-row-content', {
            'pg-confirm__content-identity-col-row-content--focused': lastNameFocused,
        });

        const postcodeGroupClass = cr('pg-confirm__content-identity-col-row-content', {
            'pg-confirm__content-identity-col-row-content--focused': postcodeFocused,
        });

        const residentialAddressGroupClass = cr('pg-confirm__content-identity-col-row-content', {
            'pg-confirm__content-identity-col-row-content--focused': residentialAddressFocused,
        });

        const dataNationalities = nationalities.map(value => {
            return this.translate(value);
        });
        const onSelectNationality = value => this.selectNationality(dataNationalities[value]);

        /* tslint:disable */
        countries.registerLocale(require("i18n-iso-countries/langs/en.json"));
        countries.registerLocale(require("i18n-iso-countries/langs/ru.json"));
        countries.registerLocale(require("i18n-iso-countries/langs/zh.json"));
        /* tslint:enable */

        const dataCountries = Object.values(countries.getNames(lang));
        const onSelectCountry = value => this.selectCountry(dataCountries[value]);

        return (
          <div className="pg-confirm__content-identity">
            <div className="pg-confirm__content-identity-forms">
                <div className="pg-confirm__content-identity-col">
                    <div className="pg-confirm__content-identity-col-row">
                      <fieldset className={firstNameGroupClass}>
                          {firstName && <legend>{this.translate('page.body.kyc.identity.firstName')}</legend>}
                              <input
                                  className="pg-confirm__content-identity-col-row-content-number"
                                  type="string"
                                  placeholder={this.translate('page.body.kyc.identity.firstName')}
                                  value={firstName}
                                  onChange={this.handleChange('firstName')}
                                  onFocus={this.handleFieldFocus('firstName')}
                                  onBlur={this.handleFieldFocus('firstName')}
                              />
                      </fieldset>
                    </div>
                    <div className="pg-confirm__content-identity-col-row">
                      <fieldset className={dateOfBirthGroupClass}>
                          {dateOfBirth && <legend>{this.translate('page.body.kyc.identity.dateOfBirth')}</legend>}
                          <MaskInput
                            className="pg-confirm__content-identity-col-row-content-number"
                            maskString="00/00/0000"
                            mask="00/00/0000"
                            onChange={this.handleChangeDate}
                            onFocus={this.handleFieldFocus('dateOfBirth')}
                            onBlur={this.handleFieldFocus('dateOfBirth')}
                            value={dateOfBirth}
                            placeholder={this.translate('page.body.kyc.identity.dateOfBirth')}
                          />
                      </fieldset>
                    </div>
                    <div className="pg-confirm__content-identity-col-row">
                      <fieldset className={residentialAddressGroupClass}>
                          {residentialAddress && <legend>{this.translate('page.body.kyc.identity.residentialAddress')}</legend>}
                          <input
                            className="pg-confirm__content-identity-col-row-content-number"
                            type="string"
                            placeholder={this.translate('page.body.kyc.identity.residentialAddress')}
                            value={residentialAddress}
                            onChange={this.handleChange('residentialAddress')}
                            onFocus={this.handleFieldFocus('residentialAddress')}
                            onBlur={this.handleFieldFocus('residentialAddress')}
                          />
                      </fieldset>
                    </div>
                    <div className="pg-confirm__content-identity-col-row">
                      <fieldset className={cityGroupClass}>
                          {city && <legend>{this.translate('page.body.kyc.identity.city')}</legend>}
                          <input
                              className="pg-confirm__content-identity-col-row-content-number"
                              type="string"
                              placeholder={this.translate('page.body.kyc.identity.city')}
                              value={city}
                              onChange={this.handleChange('city')}
                              onFocus={this.handleFieldFocus('city')}
                              onBlur={this.handleFieldFocus('city')}
                          />
                      </fieldset>
                    </div>
                </div>
                <div className="pg-confirm__content-identity-col pg-confirm__content-identity-col-right">
                  <div className="pg-confirm__content-identity-col-row">
                    <fieldset className={lastNameGroupClass}>
                        {lastName && <legend>{this.translate('page.body.kyc.identity.lastName')}</legend>}
                            <input
                                className="pg-confirm__content-identity-col-row-content-number"
                                type="string"
                                placeholder={this.translate('page.body.kyc.identity.lastName')}
                                value={lastName}
                                onChange={this.handleChange('lastName')}
                                onFocus={this.handleFieldFocus('lastName')}
                                onBlur={this.handleFieldFocus('lastName')}
                            />
                    </fieldset>
                  </div>
                    <div className="pg-confirm__content-identity-col-row">
                      <div className="pg-confirm__content-identity-col-row-content">
                          <div className="pg-confirm__content-identity-col-row-content-label">
                              {nationality && this.translate('page.body.kyc.identity.nationality')}
                          </div>
                        <Dropdown
                          className="pg-confirm__content-documents-col-row-content-number"
                          list={dataNationalities}
                          onSelect={onSelectNationality}
                          placeholder={this.translate('page.body.kyc.identity.nationality')}
                        />
                      </div>
                    </div>
                    <div className="pg-confirm__content-identity-col-row">
                      <div className="pg-confirm__content-identity-col-row-content">
                          <div className="pg-confirm__content-identity-col-row-content-label">
                              {countryOfBirth && this.translate('page.body.kyc.identity.CoR')}
                          </div>
                        <Dropdown
                          className="pg-confirm__content-documents-col-row-content-number"
                          list={dataCountries}
                          onSelect={onSelectCountry}
                          placeholder={this.translate('page.body.kyc.identity.CoR')}
                        />
                      </div>
                    </div>
                    <div className="pg-confirm__content-identity-col-row">
                      <fieldset className={postcodeGroupClass}>
                          {postcode && <legend>{this.translate('page.body.kyc.identity.postcode')}</legend>}
                          <input
                              className="pg-confirm__content-identity-col-row-content-number"
                              type="string"
                              placeholder={this.translate('page.body.kyc.identity.postcode')}
                              value={postcode}
                              onChange={this.handleChange('postcode')}
                              onFocus={this.handleFieldFocus('postcode')}
                              onBlur={this.handleFieldFocus('postcode')}
                          />
                      </fieldset>
                    </div>
                </div>
              </div>
              {success && <p className="pg-confirm__success">{success}</p>}
              <div className="pg-confirm__content-deep">
                  <Button
                      className="pg-confirm__content-phone-deep-button"
                      label={this.translate('page.body.kyc.next')}
                      onClick={this.sendData}
                      disabled={this.handleCheckButtonDisabled()}
                  />
              </div>
          </div>
        );
    }

    private handleFieldFocus = (field: string) => {
        return () => {
            switch (field) {
                case 'city':
                    this.setState({
                        cityFocused: !this.state.cityFocused,
                    });
                    break;
                case 'dateOfBirth':
                    this.setState({
                        dateOfBirthFocused: !this.state.dateOfBirthFocused,
                    });
                    break;
                case 'firstName':
                    this.setState({
                        firstNameFocused: !this.state.firstNameFocused,
                    });
                    break;
                case 'lastName':
                    this.setState({
                        lastNameFocused: !this.state.lastNameFocused,
                    });
                    break;
                case 'postcode':
                    this.setState({
                        postcodeFocused: !this.state.postcodeFocused,
                    });
                    break;
                case 'residentialAddress':
                    this.setState({
                        residentialAddressFocused: !this.state.residentialAddressFocused,
                    });
                    break;
                default:
                    break;
            }
        };
    }

    private handleChange = (key: string) => {
        return (e: OnChangeEvent) => {
            // @ts-ignore
            this.setState({
                [key]: e.target.value,
            });
        };
    };

    private formatDate = (date: string) => {
        const [day, month, year] = date.split('/');

        let formatDay = day ? day : '';
        formatDay = formatDay === '' || parseFloat(formatDay) <= 31 ? formatDay : '31';
        let formatMonth = month ? month : '';
        formatMonth = formatMonth === '' || parseFloat(formatMonth) <= 12 ? formatMonth : '12';
        const formatYear = year ? parseFloat(year) : '';

        return (formatDay && formatMonth && formatYear) ?
            `${formatDay}/${formatMonth}/${formatYear}` : date;
    }

    private handleChangeDate = (e: OnChangeEvent) => {
        this.setState({
            dateOfBirth: this.formatDate(e.target.value),
        });
    }

    private selectNationality = (value: string) => {
        this.setState({
            nationality: value,
        });
    };

    private selectCountry = (value: string) => {
        this.setState({
            countryOfBirth: countries.getAlpha2Code(value, this.props.lang),
        });
    };

    private handleCheckButtonDisabled = () => {
        const {
            city,
            dateOfBirth,
            firstName,
            lastName,
            postcode,
            residentialAddress,
            countryOfBirth,
            nationality,
        } = this.state;
        return !firstName || !lastName  || !dateOfBirth || !nationality || !residentialAddress || !countryOfBirth || !city || !postcode;
    }

    private sendData = () => {
        const dob = !isDateInFuture(this.state.dateOfBirth) ? this.state.dateOfBirth : '';
        const profileInfo = {
            first_name: this.state.firstName,
            last_name: this.state.lastName,
            dob,
            address: this.state.residentialAddress,
            postcode: this.state.postcode,
            city: this.state.city,
            country: this.state.countryOfBirth,
        };
        this.props.sendIdentity(profileInfo);
    }
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    success: selectSendIdentitySuccess(state),
    lang: selectCurrentLanguage(state),
});

const mapDispatchProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        sendIdentity: payload => dispatch(sendIdentity(payload)),
        labelFetch: () => dispatch(labelFetch()),
    });

// tslint:disable-next-line
export const Identity = injectIntl(connect(mapStateToProps, mapDispatchProps)(IdentityComponent) as any);
