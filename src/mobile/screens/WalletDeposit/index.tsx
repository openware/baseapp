import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { selectWallets, walletsAddressFetch, walletsFetch } from '../../../modules/user/wallets';
import { WalletDepositBody, WalletHeader } from '../../components';

const WalletDeposit = () => {
    const [generateAddressTriggered, setGenerateAddressTriggered] = React.useState(false);
    const dispatch = useDispatch();
    const { currency = '' } = useParams();
    const wallets = useSelector(selectWallets) || [];

    const wallet = wallets.find(item => item.currency === currency) || { name: '', currency: '', balance: '', type: '', address: '' };
    const isAccountActivated = wallet.type === 'fiat' || wallet.balance;


    const handleGenerateAddress = () => {
        if (!wallet.address && wallets.length && wallet.type !== 'fiat') {
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
