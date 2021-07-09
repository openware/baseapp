import cr from 'classnames';
import moment from 'moment';
import * as React from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import MaskInput from 'react-maskinput';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { IntlProps } from '../../../';
import { languages } from '../../../api/config';
import { CustomInput, SearchDropdown } from '../../../components';
import { formatDate, isDateInFuture } from '../../../helpers';
import {
    editIdentity,
    Label,
    labelFetch,
    RootState,
    selectCurrentLanguage,
    selectEditIdentitySuccess,
    selectLabelData,
    selectSendIdentityLoading,
    selectSendIdentitySuccess,
    selectUserInfo,
    sendIdentity,
    User,
} from '../../../modules';
import { IdentityData } from '../../../modules/user/kyc/identity/types';

import * as countries from 'i18n-iso-countries';

interface ReduxProps {
    editSuccess?: string;
    sendSuccess?: string;
    lang: string;
    labels: Label[];
    user: User;
    loading: boolean;
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
    postcode: string;
    residentialAddress: string;
    cityFocused: boolean;
    dateOfBirthFocused: boolean;
    firstNameFocused: boolean;
    lastNameFocused: boolean;
    postcodeFocused: boolean;
    residentialAddressFocused: boolean;
}

type Props = ReduxProps & DispatchProps & RouterProps & IntlProps;

class IdentityComponent extends React.Component<Props, IdentityState> {
    public state = {
        city: '',
        countryOfBirth: '',
        dateOfBirth: '',
        firstName: '',
        lastName: '',
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
        return this.props.intl.formatMessage({ id: e });
    };

    public componentDidUpdate(prev: Props) {
        const { history, editSuccess, sendSuccess } = this.props;

        if ((!prev.editSuccess && editSuccess) || (!prev.sendSuccess && sendSuccess)) {
            this.props.labelFetch();
            history.push('/profile');
        }
    }

    public render() {
        const { editSuccess, sendSuccess, lang, loading } = this.props;
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
        } = this.state;

        const firstNameGroupClass = cr('pg-confirm__content-identity__forms__row__content', {
            'pg-confirm__content-identity__forms__row__content--focused': firstNameFocused,
            'pg-confirm__content-identity__forms__row__content--wrong':
                firstName && !this.handleValidateInput('firstName', firstName),
        });

        const lastNameGroupClass = cr('pg-confirm__content-identity__forms__row__content', {
            'pg-confirm__content-identity__forms__row__content--focused': lastNameFocused,
            'pg-confirm__content-identity__forms__row__content--wrong':
                lastName && !this.handleValidateInput('lastName', lastName),
        });

        const dateOfBirthGroupClass = cr('pg-confirm__content-identity__forms__row__content', {
            'pg-confirm__content-identity__forms__row__content--focused': dateOfBirthFocused,
            'pg-confirm__content-identity__forms__row__content--wrong':
                dateOfBirth && !this.handleValidateInput('dateOfBirth', dateOfBirth),
        });

        const residentialAddressGroupClass = cr('pg-confirm__content-identity__forms__row__content', {
            'pg-confirm__content-identity__forms__row__content--focused': residentialAddressFocused,
            'pg-confirm__content-identity__forms__row__content--wrong':
                residentialAddress && !this.handleValidateInput('residentialAddress', residentialAddress),
        });

        const cityGroupClass = cr('pg-confirm__content-identity__forms__row__content', {
            'pg-confirm__content-identity__forms__row__content--focused': cityFocused,
            'pg-confirm__content-identity__forms__row__content--wrong': city && !this.handleValidateInput('city', city),
        });

        const postcodeGroupClass = cr('pg-confirm__content-identity__forms__row__content', {
            'pg-confirm__content-identity__forms__row__content--focused': postcodeFocused,
            'pg-confirm__content-identity__forms__row__content--wrong':
                postcode && !this.handleValidateInput('postcode', postcode),
        });

        /* tslint:disable */
        languages.map((l: string) => countries.registerLocale(require(`i18n-iso-countries/langs/${l}.json`)));

        /* tslint:enable */

        const dataCountries = Object.values(countries.getNames(lang)).map((item) => {
            return { label: item, value: item };
        });

        return (
            <form className="pg-confirm__content-identity" autoComplete="on">
                <div className="pg-confirm__content-identity__forms">
                    <div className="pg-confirm__content-identity__forms__row input-group">
                        <fieldset className={firstNameGroupClass}>
                            <CustomInput
                                type="string"
                                name="fname"
                                autoComplete="given-name"
                                inputValue={firstName}
                                placeholder={this.translate('page.body.kyc.identity.firstName')}
                                handleChangeInput={(e) => this.handleChange(e, 'firstName')}
                                autoFocus={true}
                                label={this.translate('page.body.kyc.identity.firstName')}
                                defaultLabel={''}
                                handleFocusInput={this.handleFieldFocus('firstName')}
                            />
                        </fieldset>
                        <fieldset className={lastNameGroupClass}>
                            <CustomInput
                                type="string"
                                name="lname"
                                autoComplete="family-name"
                                inputValue={lastName}
                                handleChangeInput={(e) => this.handleChange(e, 'lastName')}
                                placeholder={this.translate('page.body.kyc.identity.lastName')}
                                label={this.translate('page.body.kyc.identity.lastName')}
                                defaultLabel={''}
                                handleFocusInput={this.handleFieldFocus('lastName')}
                            />
                        </fieldset>
                    </div>
                    <div className="pg-confirm__content-identity__forms__row">
                        <fieldset className={dateOfBirthGroupClass}>
                            <div className="custom-input">
                                {dateOfBirth ? (
                                    <label>{this.translate('page.body.kyc.identity.dateOfBirth')}</label>
                                ) : null}
                                <div className="input-group input-group-lg">
                                    <MaskInput
                                        className="pg-confirm__content-identity__forms__row__content-number"
                                        maskString="00/00/0000"
                                        mask="00/00/0000"
                                        onChange={this.handleChangeDate}
                                        onFocus={this.handleFieldFocus('dateOfBirth')}
                                        onBlur={this.handleFieldFocus('dateOfBirth')}
                                        value={dateOfBirth}
                                        placeholder={this.translate('page.body.kyc.identity.dateOfBirth.placeholder')}
                                    />
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    <div className="pg-confirm__content-identity__forms__row">
                        <div className="pg-confirm__content-identity__forms__row__content">
                            <SearchDropdown
                                className="pg-confirm__content-identity__forms__row__content-number-dropdown"
                                options={dataCountries}
                                onSelect={this.selectCountry}
                                placeholder={this.translate('page.body.kyc.identity.CoR')}
                            />
                        </div>
                    </div>
                    <div className="pg-confirm__content-identity__forms__row">
                        <fieldset className={residentialAddressGroupClass}>
                            <CustomInput
                                type="string"
                                name="ship-address"
                                autoComplete="shipping street-address"
                                inputValue={residentialAddress}
                                placeholder={this.translate('page.body.kyc.identity.residentialAddress')}
                                label={this.translate('page.body.kyc.identity.residentialAddress')}
                                defaultLabel={''}
                                handleChangeInput={(e) => this.handleChange(e, 'residentialAddress')}
                                handleFocusInput={this.handleFieldFocus('residentialAddress')}
                            />
                        </fieldset>
                    </div>
                    <div className="pg-confirm__content-identity__forms__row input-group">
                        <fieldset className={cityGroupClass}>
                            <CustomInput
                                type="string"
                                name="ship-city"
                                autoComplete="shipping locality"
                                inputValue={city}
                                handleChangeInput={(e) => this.handleChange(e, 'city')}
                                placeholder={this.translate('page.body.kyc.identity.city')}
                                label={this.translate('page.body.kyc.identity.city')}
                                defaultLabel={''}
                                handleFocusInput={this.handleFieldFocus('city')}
                            />
                        </fieldset>
                        <fieldset className={postcodeGroupClass}>
                            <CustomInput
                                label={this.translate('page.body.kyc.identity.postcode')}
                                defaultLabel={this.translate('page.body.kyc.identity.postcode')}
                                type="string"
                                name="ship-zip"
                                autoComplete="shipping postal-code"
                                inputValue={postcode}
                                handleChangeInput={(e) => this.handleChange(e, 'postcode')}
                                onKeyPress={this.handleConfirmEnterPress}
                                placeholder={this.translate('page.body.kyc.identity.postcode')}
                                handleFocusInput={this.handleFieldFocus('postcode')}
                            />
                        </fieldset>
                    </div>
                </div>
                {sendSuccess && !editSuccess && <p className="pg-confirm__success">{this.translate(sendSuccess)}</p>}
                {editSuccess && !sendSuccess && <p className="pg-confirm__success">{this.translate(editSuccess)}</p>}
                <div className="pg-confirm__content-deep">
                    <Button
                        onClick={this.sendData}
                        disabled={this.handleCheckButtonDisabled() || loading}
                        size="lg"
                        variant="primary"
                        type="submit"
                        block={true}>
                        {loading ? (
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />
                        ) : this.translate('page.body.kyc.next')}
                    </Button>
                </div>
            </form>
        );
    }

    private scrollToElement = (displayedElem: number) => {
        const element: HTMLElement = document.getElementsByClassName('pg-confirm__content-identity__forms__row')[
            displayedElem
        ] as HTMLElement;
        element && element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    };

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
    };

    private handleChange = (value: string, key: string) => {
        // @ts-ignore
        this.setState({
            [key]: value,
        });
    };

    private handleConfirmEnterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && !this.handleCheckButtonDisabled()) {
            event.preventDefault();
            this.sendData(event);
        }
    };

    private handleChangeDate = (e: OnChangeEvent) => {
        this.setState({
            dateOfBirth: formatDate(e.target.value),
        });
    };

    private selectCountry = (option) => {
        this.setState({
            countryOfBirth: countries.getAlpha2Code(option.value, this.props.lang),
        });
    };

    private handleValidateInput = (field: string, value: string): boolean => {
        switch (field) {
            case 'firstName':
                const firstNameRegex = new RegExp(`^[a-zA-Z—-\\s]{1,255}$`);

                return Boolean(value.match(firstNameRegex));
            case 'lastName':
                const lastNameRegex = new RegExp(`^[a-zA-Z—-\\s]{1,255}$`);

                return Boolean(value.match(lastNameRegex));
            case 'residentialAddress':
                const residentialAddressRegex = new RegExp(`^[a-zA-Z0-9-,.;~\\/\\\\\\s]{1,255}$`);

                return Boolean(value.match(residentialAddressRegex));
            case 'city':
                const cityRegex = new RegExp(`^[a-zA-Z0-9-,.;/\\s]{1,255}$`);

                return Boolean(value.match(cityRegex));
            case 'postcode':
                const postcodeRegex = new RegExp(`^[a-zA-Z0-9/\\s]{1,12}$`);

                return Boolean(value.match(postcodeRegex));
            case 'dateOfBirth':
                if (value.length === 10) {
                    return moment(value, 'DD/MM/YYYY').unix() < Date.now() / 1000;
                }

                return false;
            default:
                return true;
        }
    };

    private handleCheckButtonDisabled = () => {
        const { city, dateOfBirth, firstName, lastName, postcode, residentialAddress, countryOfBirth } = this.state;

        const firstNameValid = this.handleValidateInput('firstName', firstName);
        const lastNameValid = this.handleValidateInput('lastName', lastName);
        const residentialAddressValid = this.handleValidateInput('residentialAddress', residentialAddress);
        const cityValid = this.handleValidateInput('city', city);
        const postcodeValid = this.handleValidateInput('postcode', postcode);
        const dateOfBirthValid = this.handleValidateInput('dateOfBirth', dateOfBirth);

        return (
            !firstNameValid ||
            !lastNameValid ||
            !residentialAddressValid ||
            !countryOfBirth ||
            !cityValid ||
            !postcodeValid ||
            !dateOfBirthValid
        );
    };

    private sendData = (event) => {
        event.preventDefault();
        const { labels, user } = this.props;
        const dob = !isDateInFuture(this.state.dateOfBirth) ? this.state.dateOfBirth : '';
        const profileInfo: IdentityData = {
            first_name: this.state.firstName,
            last_name: this.state.lastName,
            dob,
            address: this.state.residentialAddress,
            postcode: this.state.postcode,
            city: this.state.city,
            country: this.state.countryOfBirth,
            confirm: true,
        };
        const isIdentity =
            labels.length && labels.find((w) => w.key === 'profile' && w.value === 'verified' && w.scope === 'private');
        const verifiedProfiles = user.profiles.length ? user.profiles.filter((i) => i.state === 'verified') : [];
        const lastVerifiedProfile = verifiedProfiles.length && verifiedProfiles[verifiedProfiles.length - 1];

        if (!isIdentity && lastVerifiedProfile && lastVerifiedProfile.address) {
            this.props.editIdentity(profileInfo);
        } else {
            this.props.sendIdentity(profileInfo);
        }
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    editSuccess: selectEditIdentitySuccess(state),
    sendSuccess: selectSendIdentitySuccess(state),
    lang: selectCurrentLanguage(state),
    labels: selectLabelData(state),
    user: selectUserInfo(state),
    loading: selectSendIdentityLoading(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = (dispatch) => ({
    editIdentity: (payload) => dispatch(editIdentity(payload)),
    sendIdentity: (payload) => dispatch(sendIdentity(payload)),
    labelFetch: () => dispatch(labelFetch()),
});

export const Identity = compose(
    injectIntl,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps)
)(IdentityComponent) as any; // tslint:disable-line
