import {
  Button,
  Dropdown,
} from '@openware/components';
import * as React from 'react';
import MaskInput from 'react-maskinput';
import {
  connect,
  MapDispatchToPropsFunction,
} from 'react-redux';
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

type Props = ReduxProps & DispatchProps;

class DocumentsComponent extends React.Component<Props, DocumentsState> {
    public state = {
        documentsType: 'Passport',
        idNumber: '',
        expiration: '',
    };

    public render() {
        const {
            documentsType,
            idNumber,
            expiration,
            scan,
        }: DocumentsState = this.state;
        const { error, success } = this.props;
        const data = ['Passport', 'Identity Card', 'Driver license', 'Utility Bill'];

        const onSelect = value => this.handleChangeDocumentsType(data[value]);
        const numberType = `${documentsType} Number`;
        const scanName = scan && (scan.name.length > 30 ? `${scan.name.slice(0, 20)}...${scan.name.slice(-8)}` : scan.name);

        return (
            <div>
                <div className="pg-confirm__content-documents">
                        <div className="pg-confirm__content-documents-col-row">
                          <div className="pg-confirm__content-documents-col">
                            <div className="pg-confirm__content-documents-col-row">
                              <div className="pg-confirm__content-documents-col-row-content-3">
                                  <Dropdown
                                      className="pg-confirm__content-documents-col-row-content-number"
                                      list={data}
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
                                  placeholder="Expiry Date DD/MM/YYYY"
                                />
                            </div>
                          </div>
                        </div>
                        <div className="pg-confirm__content-documents-col pg-confirm__content-documents-drag">
                            <div className="pg-confirm__content-documents-col-row">
                                <div className="pg-confirm__content-documents-col-row-content-2">
                                    Upload your ID Photo
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
                                                    <p className="active">Drag and drop orbrowse files</p>
                                                    <div className="muted">Maximum file size is 20MB</div>
                                                    <div className="muted">Maximum number of files is 5</div>
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
                {success && <p className="pg-confirm__success">{success}</p>}
                <div className="pg-confirm__content-deep">
                    <Button
                        className="pg-confirm__content-phone-deep-button"
                        label="Next"
                        onClick={this.sendDocuments}
                    />
                </div>
            </div>
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
      let formatDay = day ? parseFloat(day) : '';
      formatDay = formatDay === '' || formatDay <= 31 ? formatDay : 31;
      let formatMonth = month ? parseFloat(month) : '';
      formatMonth = formatMonth === '' || formatMonth <= 12 ? formatMonth : 12;
      const formatYear = year ? parseFloat(year) : '';
      if (formatDay && formatMonth && formatYear) {
        return `${formatDay}/${formatMonth}/${formatYear}`;
      } else if (formatDay && formatMonth) {
        return `${formatDay}/${formatMonth}`;
      } else {
        return `${formatDay}`;
      }
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

    // tslint:disable
    private sendDocuments = () => {
        const {
            scan,
            idNumber,
            expiration,
            documentsType,

        }: DocumentsState = this.state;

        if (!scan) {
            return;
        }

        const request = new FormData();

        request.append('upload[]', scan);
        request.append('doc_expire', expiration);
        request.append('doc_type', documentsType);
        request.append('doc_number', idNumber);

        this.props.sendDocuments(request);
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

// tslint:disable-next-line
export const Documents = connect(mapStateToProps, mapDispatchProps)(DocumentsComponent) as any;
