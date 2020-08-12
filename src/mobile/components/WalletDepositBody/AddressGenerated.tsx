import * as React from 'react';
import { CopyableTextField } from '../../../components/CopyableTextField';
import { QRCode } from '../../../components/QRCode';

const AddressGeneratedComponent = props => {
    return (
        <React.Fragment>
            <div className="cr-mobile-wallet-deposit__wrap">
                <div className="cr-mobile-wallet-deposit__address">
                    <span className="cr-mobile-wallet-deposit__address-currency">{props.currency}</span>
                    <span>{props.addressMessage}</span>
                </div>
                <div className="cr-mobile-wallet-deposit__address-button">
                    <CopyableTextField copyButtonText={props.copyText} value={props.address} fieldId="cr-mobile-address" />
                </div>
            </div>
            <div className="cr-mobile-wallet-deposit__qr">
                <div className="cr-mobile-wallet-deposit__qr-text">
                    {props.qrMessage}
                </div>
                <QRCode dimensions={118} data={props.data}/>
            </div>
        </React.Fragment>
    );
};

const AddressGenerated = React.memo(AddressGeneratedComponent);

export {
    AddressGenerated,
};

