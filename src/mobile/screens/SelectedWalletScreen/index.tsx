import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';

import { useWalletsFetch } from '../../../hooks';
import { selectWallets } from '../../../modules/user/wallets';
import { Subheader, WalletBanner, WalletHeader, WalletsButtons } from '../../components';
import { WalletsHistory } from '../WalletsHistory';

const SelectedWalletMobileScreen = () => {
    const { currency } = useParams();
    const intl = useIntl();
    const history = useHistory();
    const wallets = useSelector(selectWallets) || [];

    const wallet = wallets.find((item) => item.currency === currency) || { name: '', currency: '' };

    useWalletsFetch();

    return (
        <React.Fragment>
            <Subheader
                title={intl.formatMessage({ id: 'page.body.wallets.balance' })}
                backTitle={intl.formatMessage({ id: 'page.mobile.wallets.title' })}
                onGoBack={() => history.push('/wallets')}
            />
            <WalletHeader currency={wallet.currency} name={wallet.name} />
            <WalletBanner wallet={wallet} />
            <WalletsHistory />
            <WalletsButtons currency={wallet.currency} />
        </React.Fragment>
    );
};

export { SelectedWalletMobileScreen };
