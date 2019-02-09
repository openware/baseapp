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
import { isDateInFuture } from '../../helpers/checkDate';
import { RootState } from '../../modules';
import {
    selectSendDocumentsSuccess,
    sendDocuments,
} from '../../modules/kyc/documents';

interface ReduxProps {
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
    scans: File[];
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
            idNumber,
            expiration,
            scans,
        }: DocumentsState = this.state;

        const onSelect = value => this.handleChangeDocumentsType(this.data[value]);
        const numberType = `${documentsType}${this.translate('page.body.kyc.documents.number')}`;

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
                                    {Array.from(scans).map(this.renderScan)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
                {scan.name}&nbsp;
                <img src={require('../../assets/images/close.svg')}/>
            </div>
        );
    }

    private handleChangeIdNumber = (e: OnChangeEvent) => {
        this.setState({
            idNumber: e.target.value,
        });
    };

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

    private handleChangeExpiration = (e: OnChangeEvent) => {
        this.setState({
          expiration: this.formatDate(e.target.value),
        });
    }

    private handleUploadScan = uploadEvent => {
        const allFiles: File[] = uploadEvent.target.files;
        const oldFileList = Array.from(this.state.scans);
        const additionalFileList = Array.from(allFiles).length > 5 ?  Array.from(allFiles).slice(0,5) : Array.from(allFiles);
        if (oldFileList.length !== 5) {
            this.setState({
                scans: additionalFileList.concat(oldFileList),
            });
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
           case this.data[1]: return 'Identity Card';
           case this.data[2]: return 'Driver License';
           case this.data[3]: return 'Utility Bill';
           default: return value;
        }
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    success: selectSendDocumentsSuccess(state),
});

const mapDispatchProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        sendDocuments: payload => dispatch(sendDocuments(payload)),
    });

// tslint:disable-next-line:no-any
export const Documents = injectIntl(withRouter(connect(mapStateToProps, mapDispatchProps)(DocumentsComponent) as any));
