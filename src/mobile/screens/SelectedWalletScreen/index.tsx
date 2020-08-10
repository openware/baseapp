import * as React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { useWalletsFetch } from '../../../hooks';
import { selectWallets } from '../../../modules/user/wallets';
import { WalletBanner, WalletHeader, WalletsHistory } from '../../components';

const SelectedWalletMobileScreen = ()  =>  {
    const { currency } = useParams();
    const wallets = useSelector(selectWallets) || [];

    const wallet = wallets.find(item => item.currency === currency) || { name: '', currency: '' };

    useWalletsFetch();

    return (
        <React.Fragment>
            <WalletHeader
                currency={wallet.currency}
                name={wallet.name}
            />
            <WalletBanner wallet={wallet}/>
            <WalletsHistory />
        </React.Fragment>
    );
};

export {
    SelectedWalletMobileScreen,
};
