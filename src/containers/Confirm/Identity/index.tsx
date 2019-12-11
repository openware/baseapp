import { Dropdown } from '@openware/components';
import { Button } from 'react-bootstrap';
import cr from 'classnames';
import * as moment from 'moment';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import MaskInput from 'react-maskinput';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { formatDate, isDateInFuture } from '../../../helpers';
import {
    editIdentity,
    Label,
    labelFetch,
    RootState,
    selectCurrentLanguage,
    selectEditIdentitySuccess,
    selectLabelData,
    selectSendIdentitySuccess,
    selectUserInfo,
    sendIdentity,
    User,
} from '../../../modules';
import { nationalities } from '../../../translations/nationalities';

import * as countries from 'i18n-iso-countries';

interface ReduxProps {
    editSuccess?: string;
    sendSuccess?: string;
    lang: string;
    labels: Label[];
    user: User;
}

interface DispatchProps {
    editIdentity: typeof editIdentity;
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
    metadata: {
        nationality: string,
    };
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
        metadata: {
            nationality: '',
        },
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
        const {
            editSuccess,
            sendSuccess,
        } = this.props;

        if ((!prev.editSuccess && editSuccess) || (!prev.sendSuccess && sendSuccess)) {
            this.props.labelFetch();
        }
    }

    public render() {
        const {
            editSuccess,
            sendSuccess,
            lang,
        } = this.props;
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
            metadata,
        } = this.state;

        const cityGroupClass = cr('pg-confirm__content-identity-col-row-content', {
            'pg-confirm__content-identity-col-row-content--focused': cityFocused,
            'pg-confirm__content-identity-col-row-content--wrong': city && !this.handleValidateInput('city', city),
        });

        const dateOfBirthGroupClass = cr('pg-confirm__content-identity-col-row-content', {
            'pg-confirm__content-identity-col-row-content--focused': dateOfBirthFocused,
            'pg-confirm__content-identity-col-row-content--wrong': dateOfBirth && !this.handleValidateInput('dateOfBirth', dateOfBirth),
        });

        const firstNameGroupClass = cr('pg-confirm__content-identity-col-row-content', {
            'pg-confirm__content-identity-col-row-content--focused': firstNameFocused,
            'pg-confirm__content-identity-col-row-content--wrong': firstName && !this.handleValidateInput('firstName', firstName),
        });

        const lastNameGroupClass = cr('pg-confirm__content-identity-col-row-content', {
            'pg-confirm__content-identity-col-row-content--focused': lastNameFocused,
            'pg-confirm__content-identity-col-row-content--wrong': lastName && !this.handleValidateInput('lastName', lastName),
        });

        const postcodeGroupClass = cr('pg-confirm__content-identity-col-row-content', {
            'pg-confirm__content-identity-col-row-content--focused': postcodeFocused,
            'pg-confirm__content-identity-col-row-content--wrong': postcode && !this.handleValidateInput('postcode', postcode),
        });

        const residentialAddressGroupClass = cr('pg-confirm__content-identity-col-row-content', {
            'pg-confirm__content-identity-col-row-content--focused': residentialAddressFocused,
            'pg-confirm__content-identity-col-row-content--wrong': residentialAddress && !this.handleValidateInput('residentialAddress', residentialAddress),
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
                                  autoFocus={true}
                              />
                      </fieldset>
                    </div>
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
                        <div className="pg-confirm__content-identity-col-row-content">
                            <div className="pg-confirm__content-identity-col-row-content-label">
                                {metadata.nationality && this.translate('page.body.kyc.identity.nationality')}
                            </div>
                            <Dropdown
                                className="pg-confirm__content-documents-col-row-content-number"
                                list={dataNationalities}
                                onSelect={onSelectNationality}
                                placeholder={this.translate('page.body.kyc.identity.nationality')}
                            />
                        </div>
                    </div>
                </div>
                <div className="pg-confirm__content-identity-col pg-confirm__content-identity-col-right">
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
                                onKeyPress={this.handleConfirmEnterPress}
                            />
                        </fieldset>
                    </div>
                </div>
              </div>
              {sendSuccess && !editSuccess && <p className="pg-confirm__success">{this.translate(sendSuccess)}</p>}
              {editSuccess && !sendSuccess && <p className="pg-confirm__success">{this.translate(editSuccess)}</p>}
              <div className="pg-confirm__content-deep">
                    <Button
                        onClick={this.sendData}
                        disabled={this.handleCheckButtonDisabled()}
                        size="lg"
                        variant="primary"
                        type="button"
                        block={true}
                    >
                        {this.translate('page.body.kyc.next')}
                    </Button>
              </div>
          </div>
        );
    }

    private scrollToElement = (displayedElem: number) => {
            const element: HTMLElement = document.getElementsByClassName('pg-confirm__content-identity-col-row')[displayedElem] as HTMLElement;
            element && element.scrollIntoView({behavior: 'smooth', block: 'center', inline: 'nearest'});
    }

    private handleFieldFocus = (field: string) => {
        return () => {
            switch (field) {
                case 'city':
                    this.setState({
                        cityFocused: !this.state.cityFocused,
                    });
                    this.scrollToElement(6);
                    break;
                case 'dateOfBirth':
                    this.setState({
                        dateOfBirthFocused: !this.state.dateOfBirthFocused,
                    });
                    this.scrollToElement(2);
                    break;
                case 'firstName':
                    this.setState({
                        firstNameFocused: !this.state.firstNameFocused,
                    });
                    this.scrollToElement(0);
                    break;
                case 'lastName':
                    this.setState({
                        lastNameFocused: !this.state.lastNameFocused,
                    });
                    this.scrollToElement(1);
                    break;
                case 'postcode':
                    this.setState({
                        postcodeFocused: !this.state.postcodeFocused,
                    });
                    this.scrollToElement(7);
                    break;
                case 'residentialAddress':
                    this.setState({
                        residentialAddressFocused: !this.state.residentialAddressFocused,
                    });
                    this.scrollToElement(4);
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

    private handleConfirmEnterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && !this.handleCheckButtonDisabled()) {
            event.preventDefault();
            this.sendData();
        }
    };

    private handleChangeDate = (e: OnChangeEvent) => {
        this.setState({
            dateOfBirth: formatDate(e.target.value),
        });
    };

    private selectNationality = (value: string) => {
        this.setState({
            metadata: { nationality: value },
        });
    };

    private selectCountry = (value: string) => {
        this.setState({
            countryOfBirth: countries.getAlpha2Code(value, this.props.lang),
        });
    };

    private handleValidateInput = (field: string, value: string): boolean => {
        switch (field) {
            case 'firstName':
                const firstNameRegex = new RegExp(`^[a-zA-Z]{1,100}$`);
                return value.match(firstNameRegex) ? true : false;
            case 'lastName':
                const lastNameRegex = new RegExp(`^[a-zA-Z]{1,100}$`);
                return value.match(lastNameRegex) ? true : false;
            case 'residentialAddress':
                const residentialAddressRegex = new RegExp(`^[a-zA-Z0-9,.;/\\s]+$`);
                return value.match(residentialAddressRegex) ? true : false;
            case 'city':
                const cityRegex = new RegExp(`^[a-zA-Z]+$`);
                return value.match(cityRegex) ? true : false;
            case 'postcode':
                const postcodeRegex = new RegExp(`^[0-9]{1,12}$`);
                return value.match(postcodeRegex) ? true : false;
            case 'dateOfBirth':
                if (value.length === 10) {
                    return moment(value, 'DD/MM/YYYY').unix() < (Date.now() / 1000);
                }

                return false;
            default:
                return true;
        }
    }

    private handleCheckButtonDisabled = () => {
        const {
            city,
            dateOfBirth,
            firstName,
            lastName,
            postcode,
            residentialAddress,
            countryOfBirth,
            metadata,
        } = this.state;

        const firstNameValid = this.handleValidateInput('firstName', firstName);
        const lastNameValid = this.handleValidateInput('lastName', lastName);
        const residentialAddressValid = this.handleValidateInput('residentialAddress', residentialAddress);
        const cityValid = this.handleValidateInput('city', city);
        const postcodeValid = this.handleValidateInput('postcode', postcode);
        const dateOfBirthValid = this.handleValidateInput('dateOfBirth', dateOfBirth);

        return (
            !firstNameValid
            || !lastNameValid
            || !metadata.nationality
            || !residentialAddressValid
            || !countryOfBirth
            || !cityValid
            || !postcodeValid
            || !dateOfBirthValid
        );
    }

    private sendData = () => {
        const { labels, user } = this.props;
        const dob = !isDateInFuture(this.state.dateOfBirth) ? this.state.dateOfBirth : '';
        const profileInfo = {
            first_name: this.state.firstName,
            last_name: this.state.lastName,
            dob,
            address: this.state.residentialAddress,
            postcode: this.state.postcode,
            city: this.state.city,
            country: this.state.countryOfBirth,
            metadata: JSON.stringify({
                nationality: this.state.metadata.nationality,
            }),
        };
        const isIdentity = labels.length && labels.find(w => w.key === 'profile' && w.value === 'verified' && w.scope === 'private');

        if (!isIdentity && user.profile && user.profile.address) {
            this.props.editIdentity(profileInfo);
        } else {
            this.props.sendIdentity(profileInfo);
        }
    }
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    editSuccess: selectEditIdentitySuccess(state),
    sendSuccess: selectSendIdentitySuccess(state),
    lang: selectCurrentLanguage(state),
    labels: selectLabelData(state),
    user: selectUserInfo(state),
});

const mapDispatchProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        editIdentity: payload => dispatch(editIdentity(payload)),
        sendIdentity: payload => dispatch(sendIdentity(payload)),
        labelFetch: () => dispatch(labelFetch()),
    });

// tslint:disable-next-line
export const Identity = injectIntl(connect(mapStateToProps, mapDispatchProps)(IdentityComponent) as any);
