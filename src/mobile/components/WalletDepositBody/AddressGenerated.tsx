import * as React from 'react';
import { useIntl } from 'react-intl';
import { CopyableTextField } from '../../../components/CopyableTextField';
import { QRCode } from '../../../components/QRCode';

const AddressGeneratedComponent = props => {
    const intl = useIntl();

    return (
        <React.Fragment>
            <div className="cr-mobile-wallet-deposit__wrap">
                <div className="cr-mobile-wallet-deposit__address">
                    <span className="cr-mobile-wallet-deposit__address-currency">{props.currency}</span>
                    <span>{intl.formatMessage({id: 'page.body.wallets.tabs.deposit.ccy.message.address'})}</span>
                </div>
                <div className="cr-mobile-wallet-deposit__address-button">
                    <CopyableTextField copyButtonText={intl.formatMessage({id: 'page.mobile.copy.text'})} value={props.address} fieldId="cr-mobile-address" />
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

