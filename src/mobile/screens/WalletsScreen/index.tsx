import * as React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { useWalletsFetch } from '../../../hooks';
import { selectWallets } from '../../../modules/user/wallets';
import { EstimatedValueMobile, WalletItem } from '../../components';

const WalletsMobileScreen = () => {
    const wallets = useSelector(selectWallets) || [];
    const history = useHistory();

    useWalletsFetch();

    return <div>
        <EstimatedValueMobile/>
        {wallets.map((wallet, index) =>
            <WalletItem
                onClick={c => history.push(`/wallets/${c}/history`)}
                wallet={wallet}
                key={index}
            />)}
    </div>;
};

export {
    WalletsMobileScreen,
};
