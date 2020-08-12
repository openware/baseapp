import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { selectCurrencies } from '../../../modules/public/currencies';
import { selectWallets, walletsAddressFetch, walletsFetch } from '../../../modules/user/wallets';
import { WalletDepositBody, WalletHeader } from '../../components';

const WalletDeposit = () => {
    const [generateAddressTriggered, setGenerateAddressTriggered] = React.useState(false);
    const dispatch = useDispatch();
    const { currency = '' } = useParams();
    const wallets = useSelector(selectWallets) || [];
    const currencies = useSelector(selectCurrencies);

    const wallet = wallets.find(item => item.currency === currency) || { name: '', currency: '', balance: '', type: '', address: '' };
    const isAccountActivated = wallet.type === 'fiat' || wallet.balance;
    const currencyItem = (currencies && currencies.find(item => item.id === currency)) || { min_confirmations: 6, deposit_enabled: false };


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
                currency={wallet.currency}
                minConfirmations={currencyItem.min_confirmations}
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
