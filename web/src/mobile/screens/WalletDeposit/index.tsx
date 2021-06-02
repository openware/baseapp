import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { useWalletsFetch } from '../../../hooks';
import {
    selectWallets,
    Wallet,
} from '../../../modules/user/wallets';
import { Subheader, WalletDepositBody, WalletHeader } from '../../components';

const WalletDeposit: React.FC = () => {
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
        blockchain_currencies: [{blockchain_key: '', fee: 0}],
        account_type: '',
    };

    const wallet: Wallet = wallets.find(item => item.currency === currency) || defaultWallet;

    return (
        <React.Fragment>
            <Subheader
                title={intl.formatMessage({ id: 'page.body.wallets.tabs.deposit' })}
                backTitle={intl.formatMessage({ id: 'page.body.wallets.balance' })}
                onGoBack={() => history.push(`/wallets/${currency}/history`)}
            />
            <WalletHeader currency={wallet.currency} name={wallet.name}/>
            <WalletDepositBody wallet={wallet}/>
        </React.Fragment>
    );
};

export {
    WalletDeposit,
};
