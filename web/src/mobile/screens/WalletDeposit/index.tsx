import * as React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { useWalletsFetch } from '../../../hooks';
import {
    selectWallets,
    Wallet,
    walletsAddressFetch,
    walletsFetch,
} from '../../../modules/user/wallets';
import { Subheader, WalletDepositBody, WalletHeader } from '../../components';

const WalletDeposit: React.FC = () => {
    const dispatch = useDispatch();
    const intl = useIntl();
    const history = useHistory();
    const { currency = '' } = useParams<{ currency?: string }>();
    const wallets = useSelector(selectWallets) || [];

    useWalletsFetch();

    const defaultWallet: Wallet = {
        name: '',
        currency: '',
        balance: '',
        type: 'coin',
        fixed: 0,
        fee: 0,
        account_type: '',
    };

    const wallet: Wallet = wallets.find(item => item.currency === currency) || defaultWallet;


    const handleGenerateAddress = () => {
        // if (!wallet.deposit_address && wallets.length && wallet.type !== 'fiat') {
        //     dispatch(walletsAddressFetch({ currency, blockchain_key: "bitcoin" })); //need change
        //     dispatch(walletsFetch());
        // }
    };

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
                handleGenerateAddress={handleGenerateAddress}
            />
        </React.Fragment>
    );
};

export {
    WalletDeposit,
};
