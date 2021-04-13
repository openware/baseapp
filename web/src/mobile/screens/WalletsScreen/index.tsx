import * as React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { RootState } from 'src/modules';
import { useCurrenciesFetch, useDocumentTitle, useWalletsFetch } from '../../../hooks';
import { selectWallets } from '../../../modules/user/wallets';
import { EstimatedValueMobile, WalletItem } from '../../components';

const WalletsMobileScreen: React.FC = () => {
    const wallets = useSelector((state: RootState) => selectWallets(state, 'spot')) || [];
    const history = useHistory();

    useWalletsFetch();
    useCurrenciesFetch();
    useDocumentTitle('Wallets');

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
