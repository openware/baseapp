import cr from 'classnames';
import * as countries from 'i18n-iso-countries';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { IntlProps } from '../../../';
import { languages } from '../../../api/config';
import { CustomInput, SearchDropdown, UploadFile } from '../../../components';
import {
    alertPush,
    RootState,
    selectCurrentLanguage,
    selectMobileDeviceState,
    selectSendAddressesSuccess,
    selectUserInfo,
    sendAddresses,
    User,
} from '../../../modules';

interface ReduxProps {
    lang: string;
    success?: string;
    isMobileDevice: boolean;
    user: User;
}

interface DispatchProps {
    sendAddresses: typeof sendAddresses;
    fetchAlert: typeof alertPush;
}

interface State {
    address: string;
    addressFocused: boolean;
    city: string;
    cityFocused: boolean;
    country: string;
    postcode: string;
    postcodeFocused: boolean;
    fileScan: File[];
    fileSizeErrorMessage: string;
}

type Props = ReduxProps & DispatchProps & RouterProps & IntlProps;

class AddressComponent extends React.Component<Props, State> {
    public state = {
        address: '',
        addressFocused: false,
        city: '',
        cityFocused: false,
        country: '',
        postcode: '',
        postcodeFocused: false,
        fileScan: [],
        fileSizeErrorMessage: '',
    };

    public UNSAFE_componentWillReceiveProps(next: Props) {
        if (next.success && !this.props.success) {
            this.props.history.push('/profile');
        }
    }

    public render() {
        const { lang, isMobileDevice } = this.props;
        const {
            address,
            addressFocused,
            city,
            cityFocused,
            postcode,
            postcodeFocused,
            fileScan,
        } = this.state;

        /* tslint:disable */
        languages.map((l: string) => countries.registerLocale(require(`i18n-iso-countries/langs/${l}.json`)));
        /* tslint:enable */

        const addressFocusedClass = cr('pg-confirm__content-address__row__content', {
            'pg-confirm__content-address__row__content--focused': addressFocused,
            'pg-confirm__content-address__row__content--wrong': address && !this.handleValidateInput('address', address),
        });

        const cityFocusedClass = cr('pg-confirm__content-address__row__content', {
            'pg-confirm__content-address__row__content--focused': cityFocused,
            'pg-confirm__content-address__row__content--wrong': city && !this.handleValidateInput('city', city),
        });

        const postcodeFocusedClass = cr('pg-confirm__content-address__row__content', {
            'pg-confirm__content-address__row__content--focused': postcodeFocused,
            'pg-confirm__content-address__row__content--wrong': postcode && !this.handleValidateInput('postcode', postcode),
        });

        const dataCountries = Object.values(countries.getNames(lang)).map(item => {
            return { label: item, value: item };
        });

        return (
            <React.Fragment>
                <div className="pg-confirm__content-address">
                    <div className="pg-confirm__content-address__row">
                        <fieldset className={addressFocusedClass}>
                            <CustomInput
                                type="string"
                                inputValue={address}
                                placeholder={this.translate('page.body.kyc.address.address.placeholder')}
                                label={this.translate('page.body.kyc.address.address')}
                                defaultLabel={''}
                                labelVisible={true}
                                handleChangeInput={e => this.handleChange(e, 'address')}
                                handleFocusInput={this.handleFieldFocus('address')}
                            />
                        </fieldset>
                    </div>
                    <div className="pg-confirm__content-address__row input-group">
                        <fieldset className={cityFocusedClass}>
                            <CustomInput
                                type="string"
                                label={this.translate('page.body.kyc.address.city')}
                                labelVisible={true}
                                defaultLabel={''}
                                placeholder={this.translate('page.body.kyc.address.city.placeholder')}
                                inputValue={city}
                                handleChangeInput={e => this.handleChange(e, 'city')}
                                handleFocusInput={this.handleFieldFocus('city')}
                            />
                        </fieldset>
                        <fieldset className={postcodeFocusedClass}>
                            <CustomInput
                                type="string"
                                label={this.translate('page.body.kyc.address.postcode')}
                                labelVisible={true}
                                defaultLabel={''}
                                placeholder={this.translate('page.body.kyc.address.postcode.placeholder')}
                                inputValue={postcode}
                                handleChangeInput={e => this.handleChange(e, 'postcode')}
                                handleFocusInput={this.handleFieldFocus('postcode')}
                            />
                        </fieldset>
                    </div>
                    <div className="pg-confirm__content-address__row__content">
                        <div className="pg-confirm__content-address__row__content-label">
                            {this.translate('page.body.kyc.documents.country')}
                        </div>
                        <SearchDropdown
                            className="pg-confirm__content-address__row__content-number-dropdown"
                            options={dataCountries}
                            onSelect={this.selectCountry}
                            placeholder={this.translate('page.body.kyc.documents.country.placeholder')}
                        />
                    </div>
                    <UploadFile
                        id="fileScan"
                        isMobileDevice={isMobileDevice}
                        title={this.translate('page.body.kyc.address.uploadFile.title')}
                        label={this.translate('page.body.kyc.address.uploadFile.label')}
                        buttonText={this.translate('page.body.kyc.address.uploadFile.button')}
                        sizesText={this.translate('page.body.kyc.address.uploadFile.sizes')}
                        formatsText={this.translate('page.body.kyc.address.uploadFile.formats')}
                        tipText={this.translate('page.body.kyc.address.uploadFile.tip')}
                        handleUploadScan={uploadEvent => this.handleUploadScan(uploadEvent, 'fileScan')}
                        uploadedFile={fileScan[0] && (fileScan[0] as File).name}
                        fileSizeErrorMessage={this.state.fileSizeErrorMessage}
                    />
                    <div className="pg-confirm__content-deep">
                        <Button
                            onClick={this.sendAddress}
                            disabled={this.handleCheckButtonDisabled()}
                            size="lg"
                            variant="primary"
                            type="button"
                            block={true}
                        >
                            {this.translate('page.body.kyc.submit')}
                        </Button>
                    </div>
                </div>
            </React.Fragment>
        );
    }

    private handleChange = (value: string, key: string) => {
        // @ts-ignore
        this.setState({
            [key]: value,
        });
    };

    private handleFieldFocus = (field: string) => {
        return () => {
            switch (field) {
                case 'address':
                    this.setState({
                        addressFocused: !this.state.addressFocused,
                    });
                    break;
                case 'city':
                    this.setState({
                        cityFocused: !this.state.cityFocused,
                    });
                    break;
                case 'postcode':
                    this.setState({
                        postcodeFocused: !this.state.postcodeFocused,
                    });
                    break;
                default:
                    break;
            }
        };
    };

    private handleUploadScan = (uploadEvent, id) => {
        const { barong_upload_size_max_range, barong_upload_size_min_range } = this.props.user;
        const allFiles: File[] = uploadEvent.target.files;
        const maxDocsCount = 1;
        const additionalFileList = Array.from(allFiles).length > maxDocsCount ?  Array.from(allFiles).slice(0, maxDocsCount) : Array.from(allFiles);
        const sizeKB = (additionalFileList[0].size / 1024).toFixed(1);

        if (additionalFileList[0].size > barong_upload_size_max_range * 1024 * 1024) {
            this.setState({ fileSizeErrorMessage: this.translate('page.body.kyc.address.uploadFile.error.size.tooBig', sizeKB) });
        } else if (additionalFileList[0].size < barong_upload_size_min_range * 1024 * 1024) {
            this.setState({ fileSizeErrorMessage: this.translate('page.body.kyc.address.uploadFile.error.size.tooSmall', sizeKB) });
        } else {
            this.setState({ fileSizeErrorMessage: '' });
        }

        switch (id) {
            case 'fileScan':
                this.setState({ fileScan: additionalFileList });
                break;
            default:
                break;
        }
    };

    private handleValidateInput = (field: string, value: string): boolean => {
        switch (field) {
            case 'address':
                const residentialAddressRegex = new RegExp(`^[a-zA-Z0-9,.;/\\s]+$`);

                return value.match(residentialAddressRegex) ? true : false;
            case 'city':
                const cityRegex = new RegExp(`^[a-zA-Z]+$`);

                return value.match(cityRegex) ? true : false;
            case 'postcode':
                const postcodeRegex = new RegExp(`^[a-zA-Z0-9]{1,12}$`);

                return value.match(postcodeRegex) ? true : false;
            default:
                return true;
        }
    };

    private selectCountry = option => {
        this.setState({
            country: countries.getAlpha2Code(option.value, this.props.lang),
        });
    };

    private handleCheckButtonDisabled = () => {
        const {
            address,
            city,
            country,
            fileScan,
            postcode,
            fileSizeErrorMessage,
        } = this.state;

        const addressValid = this.handleValidateInput('address', address);
        const cityValid = this.handleValidateInput('city', city);
        const postcodeValid = this.handleValidateInput('postcode', postcode);

        return (
            !addressValid ||
            !cityValid ||
            !country.length ||
            !postcodeValid ||
            fileSizeErrorMessage !== '' ||
            !fileScan.length
        );
    };

    private sendAddress = () => {
        const {
            address,
            city,
            country,
            fileScan,
            postcode,
        } = this.state;

        const request = new FormData();
        request.append('upload[]', fileScan[0]);
        request.append('address', address);
        request.append('city', city);
        request.append('country', country);
        request.append('postcode', postcode);

        this.props.sendAddresses(request);
    };

    private translate = (key: string, value?: string) => this.props.intl.formatMessage({id: key}, {value});
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    lang: selectCurrentLanguage(state),
    success: selectSendAddressesSuccess(state),
    isMobileDevice: selectMobileDeviceState(state),
    user: selectUserInfo(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        fetchAlert: payload => dispatch(alertPush(payload)),
        sendAddresses: payload => dispatch(sendAddresses(payload)),
    });

export const Address = compose(
    injectIntl,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps),
)(AddressComponent) as any; // tslint:disable-line
