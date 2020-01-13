import { Button, Spinner } from 'react-bootstrap';
import cr from 'classnames';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import MaskInput from 'react-maskinput';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { CustomInput } from '../../../components';
import { DropdownComponent } from '../../../components/Dropdown';
import { formatDate } from '../../../helpers';
import { isDateInFuture } from '../../../helpers/checkDate';
import { alertPush, RootState } from '../../../modules';
import {
    selectSendDocumentsLoading,
    selectSendDocumentsSuccess,
    sendDocuments,
} from '../../../modules/user/kyc/documents';

import close from '../../../assets/images/close.svg';

interface ReduxProps {
    success?: string;
    loading: boolean;
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
    documentsFocused: boolean;
    expiration: string;
    expirationFocused: boolean;
    idNumber: string;
    idNumberFocused: boolean;
    scans: File[];
}

type Props = ReduxProps & DispatchProps & RouterProps & InjectedIntlProps;

// tslint:disable:member-ordering
class DocumentsComponent extends React.Component<Props, DocumentsState> {
    public translate = (e: string) => {
        return this.props.intl.formatMessage({id: e});
    };

    public data = [
        this.translate('page.body.kyc.documents.select.passport'),
        this.translate('page.body.kyc.documents.select.identityCard'),
        this.translate('page.body.kyc.documents.select.driverLicense'),
        this.translate('page.body.kyc.documents.select.utilityBill'),
    ];

    public state = {
        documentsType: '',
        documentsFocused :false,
        expiration: '',
        expirationFocused: false,
        idNumber: '',
        idNumberFocused: false,
        scans: [],
    };

    public componentWillReceiveProps(next: Props) {
        if (next.success){
            this.props.history.push('/profile');
        }
    }

    public render() {
        const {
            documentsType,
            documentsFocused,
            expiration,
            expirationFocused,
            idNumber,
            idNumberFocused,
            scans,
        }: DocumentsState = this.state;

        const { loading } = this.props;

        const dropdownFocusedClass = cr('pg-confirm__content-documents-col-row-content-3', {
            'pg-confirm__content-documents-col-row-content-3--focused': documentsFocused,
        });

        const expirationFocusedClass = cr('pg-confirm__content-documents-col-row-content', {
            'pg-confirm__content-documents-col-row-content--focused': expirationFocused,
        });

        const idNumberFocusedClass = cr('pg-confirm__content-documents-col-row-content', {
            'pg-confirm__content-documents-col-row-content--focused': idNumberFocused,
        });

        const onSelect = value => this.handleChangeDocumentsType(this.data[value]);
        const numberType = `${documentsType || this.translate('page.body.kyc.documentsType')}${this.translate('page.body.kyc.documents.number')}`;
        return (
            <React.Fragment>
                <div className="pg-confirm__content-documents">
                    <div className="pg-confirm__content-documents-col-row">
                        <div className="pg-confirm__content-documents-col">
                            <div className="pg-confirm__content-documents-col-row">
                                <div className={dropdownFocusedClass} onClick={this.handleFieldFocus('document')} onBlur={this.handleFieldFocus('document')}>
                                    <div className="pg-confirm__content-documents-col-row-content-label">
                                        {documentsType && this.translate('page.body.kyc.documentsType')}
                                    </div>
                                    <DropdownComponent
                                        className="pg-confirm__content-documents-col-row-content-number"
                                        list={this.data}
                                        placeholder={this.translate('page.body.kyc.documentsType')}
                                        onSelect={onSelect}
                                    />
                                </div>
                                <fieldset className={idNumberFocusedClass}>
                                    <CustomInput
                                        type="string"
                                        label={idNumber ? documentsType : ''}
                                        defaultLabel={idNumber ? documentsType : ''}
                                        placeholder={numberType}
                                        inputValue={idNumber}
                                        handleChangeInput={this.handleChangeIdNumber}
                                        handleFocusInput={this.handleFieldFocus('idNumber')}
                                    />
                                </fieldset>
                                <fieldset className={expirationFocusedClass}>
                                    {expiration && <legend>{this.translate('page.body.kyc.documents.expiryDate')}</legend>}
                                    <MaskInput
                                      maskString="00/00/0000"
                                      mask="00/00/0000"
                                      onChange={this.handleChangeExpiration}
                                      onFocus={this.handleFieldFocus('expiration')}
                                      onBlur={this.handleFieldFocus('expiration')}
                                      value={expiration}
                                      className="group-input"
                                      placeholder={this.translate('page.body.kyc.documents.expiryDate')}
                                    />
                                </fieldset>
                            </div>
                        </div>
                        <div className="pg-confirm__loader">
                            {loading ? <Spinner animation="border" variant="primary" /> : null}
                        </div>
                        <div className="pg-confirm__content-documents-col pg-confirm__content-documents-drag">
                            <div className="pg-confirm__content-documents-col-row">
                                <div className="pg-confirm__content-documents-col-row-content-2">
                                    {this.translate('page.body.kyc.documents.upload')}
                                    <div className="pg-confirm__content-documents-col-row-content-2-documents">
                                        <form
                                            className="box"
                                            draggable={true}
                                            onDrop={this.handleFileDrop}
                                            onDragOver={this.handleDragOver}
                                            method="post"
                                            action=""
                                            data-enctype="multipart/form-data"
                                        >
                                            <input
                                                className="pg-confirm__content-documents-col-row-content-2-documents-input"
                                                data-multiple-caption="files selected"
                                                draggable={true}
                                                multiple={true}
                                                name="files[]"
                                                type="file"
                                                id="file"
                                                onChange={this.handleUploadScan}
                                            />
                                            <div className="pg-confirm__content-documents-col-row-content-2-documents-label">
                                                <label
                                                    className="pg-confirm__content-documents-col-row-content-2-documents-label-item"
                                                    htmlFor="file"
                                                >
                                                    <p className="active">{this.translate('page.body.kyc.documents.drag')}</p>
                                                    <div className="muted">{this.translate('page.body.kyc.documents.maxFile')}</div>
                                                    <div className="muted">{this.translate('page.body.kyc.documents.maxNum')}</div>
                                                </label>
                                            </div>
                                        </form>
                                    </div>
                                    {Array.from(scans).map(this.renderScan)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="pg-confirm__content-deep">
                    <Button
                        onClick={this.sendDocuments}
                        disabled={this.handleCheckButtonDisabled()}
                        size="lg"
                        variant="primary"
                        type="button"
                        block={true}
                    >
                        {this.translate('page.body.kyc.submit')}
                    </Button>
                </div>
            </React.Fragment>
        );
    }

    private handleChangeDocumentsType = (value: string) => {
        this.setState({
            documentsType: value,
        });
    };

    private handleFileDelete = (key: number) => () => {
        const fileList = Array.from(this.state.scans);
        fileList.splice(key, 1);
        this.setState({
            scans: fileList,
        });
    }

    private renderScan = (scan: File, index: number) => {
        return (
            <div
                className="pg-confirm__content-documents-filename"
                key={index}
                onClick={this.handleFileDelete(index)}
            >
                {scan.name.slice(0, 27)}...&nbsp;
                <img alt="close" src={close}/>
            </div>
        );
    }

    private handleChangeIdNumber = (value: string) => {
        this.setState({
            idNumber: value,
        });
    };

    private handleFieldFocus = (field: string) => {
        return () => {
            switch (field) {
                case 'expiration':
                    this.setState({
                        expirationFocused: !this.state.expirationFocused,
                    });
                    break;
                case 'idNumber':
                    this.setState({
                        idNumberFocused: !this.state.idNumberFocused,
                    });
                    break;
                case 'document':
                    this.setState({
                        documentsFocused: !this.state.documentsFocused,
                    });
                    break;
                default:
                    break;
            }
        };
    }

    private handleChangeExpiration = (e: OnChangeEvent) => {
        this.setState({
          expiration: formatDate(e.target.value),
        });
    }

    private handleUploadScan = uploadEvent => {
        const allFiles: File[] = uploadEvent.target.files;
        const oldFileList = Array.from(this.state.scans);
        const documentsCount = 5;
        const additionalFileList = Array.from(allFiles).length > documentsCount ?  Array.from(allFiles).slice(0,documentsCount) : Array.from(allFiles);
        if (oldFileList.length + additionalFileList.length <= documentsCount) {
            this.setState({ scans: additionalFileList.concat(oldFileList) });
        } else {
            this.setState({ scans: additionalFileList.concat(oldFileList).slice(0,documentsCount) });
            this.props.fetchAlert({ message: ['resource.documents.limit_reached'], type: 'error'});
        }
    }
    private handleFileDrop = event => {
      event.preventDefault();
      event.stopPropagation();
      const uploadObj = {
          target: event.nativeEvent.dataTransfer,
      };
      this.handleUploadScan(uploadObj);
    }

    private handleDragOver = event => {
      event.preventDefault();
      event.stopPropagation();
    }

    private handleCheckButtonDisabled = () => {
        const {
            expiration,
            idNumber,
            scans,
        } = this.state;
        return !scans.length || !idNumber || !expiration;
    }

    private sendDocuments = () => {
        const {
            scans,
            idNumber,
            expiration,
            documentsType,
        }: DocumentsState = this.state;

        const typeOfDocuments = this.getDocumentsType(documentsType);
        const docExpire = isDateInFuture(expiration) ? expiration : '';

        if (!scans.length) {
            return;
        }

        const request = new FormData();

        for (const scan of scans) {
            request.append('upload[]', scan);
        }
        request.append('doc_expire', docExpire);
        request.append('doc_type', typeOfDocuments);
        request.append('doc_number', idNumber);

        this.props.sendDocuments(request);
    };

    private getDocumentsType = (value: string) => {
        switch (value) {
           case this.data[0]: return 'Passport';
           case this.data[1]: return 'Identity card';
           case this.data[2]: return 'Driver license';
           case this.data[3]: return 'Utility Bill';
           default: return value;
        }
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    success: selectSendDocumentsSuccess(state),
    loading: selectSendDocumentsLoading(state),
});

const mapDispatchProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        fetchAlert: payload => dispatch(alertPush(payload)),
        sendDocuments: payload => dispatch(sendDocuments(payload)),
    });

// tslint:disable-next-line:no-any
export const Documents = injectIntl(withRouter(connect(mapStateToProps, mapDispatchProps)(DocumentsComponent) as any));
