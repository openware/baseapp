import * as React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import {
    selectWallets,
    Wallet,
    walletsAddressFetch,
    walletsFetch,
} from '../../../modules/user/wallets';
import { Subheader, WalletDepositBody, WalletHeader } from '../../components';

const WalletDeposit: React.FC = () => {
    const [generateAddressTriggered, setGenerateAddressTriggered] = React.useState(false);
    const dispatch = useDispatch();
    const intl = useIntl();
    const history = useHistory();
    const { currency = '' } = useParams<{ currency?: string }>();
    const wallets = useSelector(selectWallets) || [];

    const defaultWallet: Wallet = {
        name: '',
        currency: '',
        balance: '',
        type: 'coin',
        fixed: 0,
        fee: 0,
    }

    const wallet: Wallet = wallets.find(item => item.currency === currency) || defaultWallet;
    const isAccountActivated = wallet.type === 'fiat' || wallet.balance;


    const handleGenerateAddress = () => {
        if (!wallet.deposit_address && wallets.length && wallet.type !== 'fiat') {
            dispatch(walletsAddressFetch({ currency }));
            dispatch(walletsFetch());
            setGenerateAddressTriggered(true);
        }
    };


    React.useEffect(() => {
        dispatch(walletsAddressFetch({ currency }));
    }, [dispatch, currency]);

    return (
        <React.Fragment>
            <Subheader
                title={intl.formatMessage({ id: 'page.body.wallets.tabs.deposit' })}
                backTitle={intl.formatMessage({ id: 'page.body.wallets.balance' })}
                onGoBack={() => history.push(`/wallets/${currency}/history`)}
            />
            <WalletHeader currency={wallet.currency} name={wallet.name}/>
            <WalletDepositBody
                wallet={wallet}
                isAccountActivated={isAccountActivated}
                handleGenerateAddress={handleGenerateAddress}
                generateAddressTriggered={generateAddressTriggered}
            />
        </React.Fragment>
    );
};

export {
    WalletDeposit,
};
