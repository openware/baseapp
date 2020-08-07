import * as React from 'react';
import { useSelector } from 'react-redux';
import { selectWallets } from '../../../modules/user/wallets';
import { WalletItem, WalletsBanner } from '../../components';
import { useWalletsFetch } from '../../hooks';

const WalletsMobileScreen = () => {
    const wallets = useSelector(selectWallets);

    useWalletsFetch();

    return <div>
        <WalletsBanner/>
        {wallets.map((wallet, index) =>
            <WalletItem
                wallet={wallet}
                key={index}
            />)}
    </div>;
};

export {
    WalletsMobileScreen,
};
