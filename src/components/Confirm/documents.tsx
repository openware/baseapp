import {
  Button,
  Dropdown,
} from '@openware/components';
import * as React from 'react';
import {
    InjectedIntlProps,
    injectIntl,
    intlShape,
} from 'react-intl';
import MaskInput from 'react-maskinput';
import {
  connect,
  MapDispatchToPropsFunction,
} from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { RootState } from '../../modules';
import {
    selectSendDocumentsError,
    selectSendDocumentsSuccess,
    sendDocuments,
} from '../../modules/kyc/documents';
import { CommonError } from '../../modules/types';

interface ReduxProps {
    error?: CommonError;
    success?: string;
}

interface DispatchProps {
    sendDocuments: typeof sendDocuments;
}

interface OnChangeEvent {
    target: {
        value: string;
    };
}

interface DocumentsState {
    documentsType: string;
    idNumber: string;
    expiration: string;
    scan?: File;
}

type Props = ReduxProps & DispatchProps & RouterProps & InjectedIntlProps;

// tslint:disable:member-ordering
class DocumentsComponent extends React.Component<Props, DocumentsState> {
    //tslint:disable-next-line:no-any
    public static propsTypes: React.ValidationMap<any> = {
        intl: intlShape.isRequired,
    };

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
        documentsType: this.data[0],
        idNumber: '',
        expiration: '',
    };

    public componentWillReceiveProps(next: Props) {
        if (next.success){
            this.props.history.push('/profile');
        }
    }

    public render() {
        const {
            documentsType,
            idNumber,
            expiration,
            scan,
        }: DocumentsState = this.state;
        const { error } = this.props;

        const onSelect = value => this.handleChangeDocumentsType(this.data[value]);
        const numberType = `${documentsType}${this.translate('page.body.kyc.documents.number')}`;
        const scanName = scan && (scan.name.length > 30 ? `${scan.name.slice(0, 20)}...${scan.name.slice(-8)}` : scan.name);

        return (
            <React.Fragment>
                <div className="pg-confirm__content-documents">
                    <div className="pg-confirm__content-documents-col-row">
                        <div className="pg-confirm__content-documents-col">
                            <div className="pg-confirm__content-documents-col-row">
                                <div className="pg-confirm__content-documents-col-row-content-3">
                                    <Dropdown
                                        className="pg-confirm__content-documents-col-row-content-number"
                                        list={this.data}
                                        onSelect={onSelect}
                                    />
                                </div>
                                <div className="pg-confirm__content-documents-col-row-content">
                                    <input
                                      className="pg-confirm__content-documents-col-row-content-number"
                                      type="string"
                                      placeholder={numberType}
                                      value={idNumber}
                                      onChange={this.handleChangeIdNumber}
                                    />
                                </div>
                                <div className="pg-confirm__content-documents-col-row-content">
                                    <MaskInput
                                      maskString="00/00/0000"
                                      mask="00/00/0000"
                                      onChange={this.handleChangeExpiration}
                                      value={expiration}
                                      className="group-input"
                                      placeholder={this.translate('page.body.kyc.documents.expiryDate')}
                                    />
                                </div>
                            </div>
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
                                    {scanName && <p>{scanName}</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {error && <p className="pg-confirm__error">{error.message}</p>}
                <div className="pg-confirm__content-deep">
                    <Button
                        className="pg-confirm__content-phone-deep-button"
                        label={this.translate('page.body.kyc.next')}
                        onClick={this.sendDocuments}
                    />
                </div>
            </React.Fragment>
        );
    }

    private handleChangeDocumentsType = (value: string) => {
        this.setState({
            documentsType: value,
        });
    };

    private handleChangeIdNumber = (e: OnChangeEvent) => {
        this.setState({
            idNumber: e.target.value,
        });
    };

    private handleChangeScan = (scan: File) => {
        this.setState({ scan });
    }

    private formatDate = (date: string) => {
        const [day, month, year] = date.split('/');

        let formatDay = day ? day : '';
        formatDay = formatDay === '' || parseFloat(formatDay) <= 31 ? formatDay : '31';
        let formatMonth = month ? month : '';
        formatMonth = formatMonth === '' || parseFloat(formatMonth) <= 12 ? formatMonth : '12';
        const formatYear = year ? parseFloat(year) : '';

        return (formatDay && formatMonth && formatYear) ?
               `${formatDay}/${formatMonth}/${formatYear}` : ``;
    }

    private checkDate = (date: string) => {
        const [day, month, year] = date.split('/');
        const inputDate = new Date(`${month}/${day}/${year}`);
        const curDate = new Date();

        return (inputDate > curDate) ? true : false;
    }

    private handleChangeExpiration = (e: OnChangeEvent) => {
        this.setState({
          expiration: this.formatDate(e.target.value),
        });
    }

    private handleUploadScan = uploadEvent => {
        const allFiles: File[] = uploadEvent.target.files;
        const file: File = allFiles[0];

        if (allFiles && file) {
            this.handleChangeScan(file);
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

    private sendDocuments = () => {
        const {
            scan,
            idNumber,
            expiration,
            documentsType,
        }: DocumentsState = this.state;

        const docExpire = this.checkDate(expiration) ? expiration : '';

        const typeOfDocuments = this.getDocumentsType(documentsType);

        if (!scan) {
            return;
        }

        const request = new FormData();

        request.append('upload[]', scan);
        request.append('doc_expire', docExpire);
        request.append('doc_type', typeOfDocuments);
        request.append('doc_number', idNumber);

        this.props.sendDocuments(request);
    };

    private getDocumentsType = (value: string) => {
        switch (value) {
           case this.data[0]: return 'Passport';
           case this.data[1]: return 'Identity Card';
           case this.data[2]: return 'Driver License';
           case this.data[3]: return 'Utility Bill';
           default: return value;
        }
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    success: selectSendDocumentsSuccess(state),
    error: selectSendDocumentsError(state),
});

const mapDispatchProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        sendDocuments: payload => dispatch(sendDocuments(payload)),
    });

// tslint:disable-next-line:no-any
export const Documents = injectIntl(withRouter(connect(mapStateToProps, mapDispatchProps)(DocumentsComponent) as any));
