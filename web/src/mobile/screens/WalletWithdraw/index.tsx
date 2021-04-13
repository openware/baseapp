import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { RootState } from 'src/modules';
import { useWalletsFetch } from '../../../hooks';
import { selectWallets } from '../../../modules/user/wallets';
import { Subheader, WalletBanner, WalletHeader, WalletWithdrawBody } from '../../components';


const defaultWallet = { name: '', currency: '', balance: '', type: '', address: '', fee: '' };

const WalletWithdraw: React.FC = () => {
    const { currency = '' } = useParams();
    const intl = useIntl();
    const history = useHistory();
    const wallets = useSelector((state: RootState) => selectWallets(state, 'spot')) || [];
    const wallet = wallets.find(item => item.currency === currency) || defaultWallet;

    useWalletsFetch();

    return (
        <div className="cr-mobile-wallet-withdraw">
            <Subheader
                title={intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw' })}
                backTitle={intl.formatMessage({ id: 'page.body.wallets.balance' })}
                onGoBack={() => history.push(`/wallets/${currency}/history`)}
            />
            <WalletHeader currency={wallet.currency} name={wallet.name}/>
            <WalletBanner wallet={wallet} />
            <WalletWithdrawBody wallet={wallet}/>
        </div>
    );
};

export {
    WalletWithdraw,
};
