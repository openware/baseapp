import cr from 'classnames';
import * as countries from 'i18n-iso-countries';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import MaskInput from 'react-maskinput';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { IntlProps } from '../../../';
import { languages } from '../../../api/config';
import { CustomInput, DropdownComponent, UploadFile } from '../../../components';
import { formatDate, isDateInFuture, randomSecureHex } from '../../../helpers';
import {
    alertPush,
    RootState,
    selectCurrentLanguage,
    selectMobileDeviceState,
    selectSendDocumentsSuccess,
    sendDocuments,
} from '../../../modules';

import DocumentFrontExample from 'src/assets/images/kyc/DocumentFrontExample.svg';
import DocumentBackExample from 'src/assets/images/kyc/DocumentBackExample.svg';
import DocumentSelfieExample from 'src/assets/images/kyc/DocumentSelfieExample.svg';

interface ReduxProps {
    lang: string;
    success?: string;
    isMobileDevice: boolean;
}

interface DispatchProps {
    sendDocuments: typeof sendDocuments;
    fetchAlert: typeof alertPush;
}

interface OnChangeEvent {
    target: {
        value: string;
    };
}

interface DocumentsState {
    documentsType: string;
    issuedDate: string;
    issuedDateFocused: boolean;
    expireDate: string;
    expireDateFocused: boolean;
    idNumber: string;
    idNumberFocused: boolean;
    fileFront: File[];
    fileBack: File[];
    fileSelfie: File[];
}

type Props = ReduxProps & DispatchProps & RouterProps & IntlProps;

// tslint:disable:member-ordering
class DocumentsComponent extends React.Component<Props, DocumentsState> {
    public translate = (e: string) => {
        return this.props.intl.formatMessage({ id: e });
    };

    public data = [
        this.translate('page.body.kyc.documents.select.passport'),
        this.translate('page.body.kyc.documents.select.identityCard'),
        this.translate('page.body.kyc.documents.select.driverLicense'),
    ];

    public state = {
        documentsType: '',
        issuedDate: '',
        issuedDateFocused: false,
        expireDate: '',
        expireDateFocused: false,
        idNumber: '',
        idNumberFocused: false,
        fileFront: [],
        fileBack: [],
        fileSelfie: [],
    };

    public UNSAFE_componentWillReceiveProps(next: Props) {
        if (next.success && !this.props.success) {
            this.props.history.push('/profile');
        }
    }

    public render() {
        const { isMobileDevice } = this.props;
        const {
            fileFront,
            fileBack,
            fileSelfie,
            issuedDate,
            issuedDateFocused,
            expireDate,
            expireDateFocused,
            idNumber,
            idNumberFocused,
        }: DocumentsState = this.state;

        /* tslint:disable */
        languages.map((l: string) => countries.registerLocale(require(`i18n-iso-countries/langs/${l}.json`)));
        /* tslint:enable */

        const issuedDateFocusedClass = cr('pg-confirm__content-documents__row__content', {
            'pg-confirm__content-documents__row__content--focused': issuedDateFocused,
            'pg-confirm__content-documents__row__content--wrong':
                issuedDate && !this.handleValidateInput('issuedDate', issuedDate),
        });

        const expireDateFocusedClass = cr('pg-confirm__content-documents__row__content', {
            'pg-confirm__content-documents__row__content--focused': expireDateFocused,
            'pg-confirm__content-documents__row__content--wrong':
                expireDate && !this.handleValidateInput('expireDate', expireDate),
        });

        const idNumberFocusedClass = cr('pg-confirm__content-documents__row__content', {
            'pg-confirm__content-documents__row__content--focused': idNumberFocused,
            'pg-confirm__content-documents__row__content--wrong':
                idNumber && !this.handleValidateInput('idNumber', idNumber),
        });

        const onSelect = (value) => this.handleChangeDocumentsType(this.data[value]);

        return (
            <React.Fragment>
                <div className="pg-confirm__content-documents">
                    <div className="pg-confirm__content-documents__row__content">
                        <div className="pg-confirm__content-documents__row__content-label">
                            {this.translate('page.body.kyc.documentsType')}
                        </div>
                        <DropdownComponent
                            className="pg-confirm__content-documents__row__content-number-dropdown"
                            list={this.data}
                            onSelect={onSelect}
                            placeholder={this.translate('page.body.kyc.documentsType.placeholder')}
                        />
                    </div>
                    <div className="pg-confirm__content-documents__row">
                        <fieldset className={idNumberFocusedClass}>
                            <CustomInput
                                type="string"
                                label={this.translate('page.body.kyc.documents.idNumber')}
                                labelVisible={true}
                                defaultLabel={''}
                                placeholder={this.translate('page.body.kyc.documents.idNumber.placeholder')}
                                inputValue={idNumber}
                                handleChangeInput={this.handleChangeIdNumber}
                                handleFocusInput={this.handleFieldFocus('idNumber')}
                            />
                        </fieldset>
                    </div>
                    <div className="pg-confirm__content-documents__row input-group">
                        <fieldset className={issuedDateFocusedClass}>
                            <div className="custom-input">
                                <label>{this.translate('page.body.kyc.documents.issuedDate')}</label>
                                <div className="input-group input-group-lg">
                                    <MaskInput
                                        maskString="00/00/0000"
                                        mask="00/00/0000"
                                        onChange={this.handleChangeIssuedDate}
                                        onFocus={this.handleFieldFocus('issuedDate')}
                                        onBlur={this.handleFieldFocus('issuedDate')}
                                        value={issuedDate}
                                        className="group-input"
                                        placeholder={this.translate('page.body.kyc.documents.issuedDate.placeholder')}
                                    />
                                </div>
                            </div>
                        </fieldset>
                        <fieldset className={expireDateFocusedClass}>
                            <div className="custom-input">
                                <label>{this.translate('page.body.kyc.documents.expiryDate')}</label>
                                <div className="input-group input-group-lg">
                                    <MaskInput
                                        maskString="00/00/0000"
                                        mask="00/00/0000"
                                        onChange={this.handleChangeExpiration}
                                        onFocus={this.handleFieldFocus('expireDate')}
                                        onBlur={this.handleFieldFocus('expireDate')}
                                        value={expireDate}
                                        className="group-input"
                                        placeholder={this.translate('page.body.kyc.documents.expiryDate.placeholder')}
                                    />
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    {this.state.documentsType ? (
                        <UploadFile
                            isMobileDevice={isMobileDevice}
                            id="fileFront"
                            title={this.translate('page.body.kyc.documents.uploadFile.front.title')}
                            label={this.translate('page.body.kyc.documents.uploadFile.front.label')}
                            buttonText={this.translate('page.body.kyc.documents.uploadFile.front.button')}
                            sizesText={this.translate('page.body.kyc.documents.uploadFile.front.sizes')}
                            formatsText={this.translate('page.body.kyc.documents.uploadFile.front.formats')}
                            handleUploadScan={(uploadEvent) => this.handleUploadScan(uploadEvent, 'front')}
                            exampleImagePath={DocumentFrontExample}
                            uploadedFile={fileFront[0] && (fileFront[0] as File).name}
                        />
                    ) : null}
                    {this.state.documentsType && this.state.documentsType !== 'Passport' ? (
                        <UploadFile
                            isMobileDevice={isMobileDevice}
                            id="fileBack"
                            title={this.translate('page.body.kyc.documents.uploadFile.back.title')}
                            label={this.translate('page.body.kyc.documents.uploadFile.back.label')}
                            buttonText={this.translate('page.body.kyc.documents.uploadFile.back.button')}
                            sizesText={this.translate('page.body.kyc.documents.uploadFile.back.sizes')}
                            formatsText={this.translate('page.body.kyc.documents.uploadFile.back.formats')}
                            handleUploadScan={(uploadEvent) => this.handleUploadScan(uploadEvent, 'back')}
                            exampleImagePath={DocumentBackExample}
                            uploadedFile={fileBack[0] && (fileBack[0] as File).name}
                        />
                    ) : null}
                    {this.state.documentsType ? (
                        <UploadFile
                            isMobileDevice={isMobileDevice}
                            id="fileSelfie"
                            title={this.translate('page.body.kyc.documents.uploadFile.selfie.title')}
                            label={this.translate('page.body.kyc.documents.uploadFile.selfie.label')}
                            buttonText={this.translate('page.body.kyc.documents.uploadFile.selfie.button')}
                            sizesText={this.translate('page.body.kyc.documents.uploadFile.selfie.sizes')}
                            formatsText={this.translate('page.body.kyc.documents.uploadFile.selfie.formats')}
                            handleUploadScan={(uploadEvent) => this.handleUploadScan(uploadEvent, 'selfie')}
                            exampleImagePath={DocumentSelfieExample}
                            uploadedFile={fileSelfie[0] && (fileSelfie[0] as File).name}
                        />
                    ) : null}
                    <div className="pg-confirm__content-deep">
                        <Button
                            onClick={this.sendDocuments}
                            disabled={this.handleCheckButtonDisabled()}
                            size="lg"
                            variant="primary"
                            type="button"
                            block={true}>
                            {this.translate('page.body.kyc.submit')}
                        </Button>
                    </div>
                </div>
            </React.Fragment>
        );
    }

    private handleChangeDocumentsType = (value: string) => {
        this.setState({
            documentsType: value,
        });
    };

    private handleChangeIdNumber = (value: string) => {
        this.setState({
            idNumber: value,
        });
    };

    private handleFieldFocus = (field: string) => {
        return () => {
            switch (field) {
                case 'issuedDate':
                    this.setState({
                        issuedDateFocused: !this.state.issuedDateFocused,
                    });
                    break;
                case 'expireDate':
                    this.setState({
                        expireDateFocused: !this.state.expireDateFocused,
                    });
                    break;
                case 'idNumber':
                    this.setState({
                        idNumberFocused: !this.state.idNumberFocused,
                    });
                    break;
                default:
                    break;
            }
        };
    };

    private handleChangeIssuedDate = (e: OnChangeEvent) => {
        this.setState({
            issuedDate: formatDate(e.target.value),
        });
    };

    private handleChangeExpiration = (e: OnChangeEvent) => {
        this.setState({
            expireDate: formatDate(e.target.value),
        });
    };

    private handleUploadScan = (uploadEvent, id) => {
        const allFiles: File[] = uploadEvent.target.files;
        const maxDocsCount = 1;
        const additionalFileList =
            Array.from(allFiles).length > maxDocsCount
                ? Array.from(allFiles).slice(0, maxDocsCount)
                : Array.from(allFiles);

        switch (id) {
            case 'front':
                this.setState({ fileFront: additionalFileList });
                break;
            case 'back':
                this.setState({ fileBack: additionalFileList });
                break;
            case 'selfie':
                this.setState({ fileSelfie: additionalFileList });
                break;
            default:
                break;
        }
    };

    private handleValidateInput = (field: string, value: string): boolean => {
        switch (field) {
            case 'issuedDate':
                return !isDateInFuture(value);
            case 'expireDate':
                return isDateInFuture(value);
            case 'idNumber':
                const cityRegex = new RegExp(`^[a-zA-Z0-9]+$`);

                return value.match(cityRegex) ? true : false;
            default:
                return true;
        }
    };

    private handleCheckButtonDisabled = () => {
        const { documentsType, issuedDate, expireDate, fileBack, fileFront, fileSelfie, idNumber } = this.state;

        const typeOfDocuments = this.getDocumentsType(documentsType);
        const filesValid =
            typeOfDocuments === 'Passport'
                ? fileFront.length && fileSelfie.length
                : fileSelfie.length && fileFront.length && fileBack.length;

        return (
            !this.handleValidateInput('idNumber', idNumber) ||
            !this.handleValidateInput('issuedDate', issuedDate) ||
            (expireDate && !this.handleValidateInput('expireDate', expireDate)) ||
            !filesValid
        );
    };

    private sendDocuments = () => {
        const { documentsType, fileBack, fileFront, fileSelfie } = this.state;
        const identificator = randomSecureHex(32);

        if (this.handleCheckButtonDisabled()) {
            return;
        }

        this.props.sendDocuments(this.createFormData('front_side', fileFront, identificator));

        if (documentsType !== 'Passport') {
            this.props.sendDocuments(this.createFormData('back_side', fileBack, identificator));
        }

        this.props.sendDocuments(this.createFormData('selfie', fileSelfie, identificator));
    };

    private createFormData = (docCategory: string, upload: File[], identificator: string) => {
        const { documentsType, expireDate, issuedDate, idNumber }: DocumentsState = this.state;
        const typeOfDocuments = this.getDocumentsType(documentsType);

        const request = new FormData();

        if (expireDate) {
            request.append('doc_expire', expireDate);
        }

        request.append('doc_issue', issuedDate);
        request.append('doc_type', typeOfDocuments);
        request.append('doc_number', idNumber);
        request.append('identificator', identificator);
        request.append('doc_category', docCategory);
        request.append('upload[]', upload[0]);

        return request;
    };

    private getDocumentsType = (value: string) => {
        switch (value) {
            case this.data[0]:
                return 'Passport';
            case this.data[1]:
                return 'Identity card';
            case this.data[2]:
                return 'Driver license';
            default:
                return value;
        }
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    lang: selectCurrentLanguage(state),
    success: selectSendDocumentsSuccess(state),
    isMobileDevice: selectMobileDeviceState(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = (dispatch) => ({
    fetchAlert: (payload) => dispatch(alertPush(payload)),
    sendDocuments: (payload) => dispatch(sendDocuments(payload)),
});

export const Documents = compose(
    injectIntl,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps)
)(DocumentsComponent) as any; // tslint:disable-line
