import * as React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { useWalletsFetch } from '../../../hooks';
import { selectWallets } from '../../../modules/user/wallets';
import { WalletHeader, WalletWithdrawBody } from '../../components';

const WalletWithdraw = () => {
    const { currency = '' } = useParams();
    const wallets = useSelector(selectWallets) || [];
    const wallet = wallets.find(item => item.currency === currency) || { name: '', currency: '', balance: '', type: '', address: '', fee: '' };

    useWalletsFetch();

    return (
        <div className="cr-mobile-wallet-withdraw">
            <WalletHeader currency={wallet.currency} name={wallet.name}/>
            <WalletWithdrawBody wallet={wallet}/>
        </div>
    );
};

export {
    WalletWithdraw,
};
