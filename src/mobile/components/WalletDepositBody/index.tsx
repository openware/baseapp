import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { formatCCYAddress } from '../../../helpers';
import { selectWalletAddress } from '../../../modules/user/wallets';
import { AddressGenerated } from './AddressGenerated';
import { AddressGenerating } from './AddressGenerating';

const WalletDepositBodyComponent = props => {
    const intl = useIntl();
    const address = useSelector(selectWalletAddress) || 'Generating address...';
    const data = formatCCYAddress(props.currency, address);

    return (
        <div className="cr-mobile-wallet-deposit">
            {props.isAccountActivated || props.generateAddressTriggered ?
                <AddressGenerated
                currency={props.currency}
                addressMessage={intl.formatMessage({id: 'page.body.wallets.tabs.deposit.ccy.message.address'})}
                copyText={intl.formatMessage({id: 'page.mobile.copy.text'})}
                address={address}
                qrMessage={intl.formatMessage({id: 'page.body.wallets.tabs.deposit.ccy.message.submit'}, {confirmations: props.minConfirmations})}
                data={data}
                /> : <AddressGenerating handleGenerateAddress={props.handleGenerateAddress} />
            }
        </div>
    );
};

const WalletDepositBody = React.memo(WalletDepositBodyComponent);

export {
    WalletDepositBody,
};
