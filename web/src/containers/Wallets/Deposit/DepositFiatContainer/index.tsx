import React, { useCallback } from 'react';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { CurrencyInfo, DepositFiat } from '../../../../components';
import {
    Wallet,
    User,
    selectWallets,
    selectUserInfo,
} from '../../../../modules';
import { WalletHistory } from '../../History';
import { DEFAULT_WALLET } from '../../../../constants';

interface DepositFiatProps {
    selectedWalletIndex: number;
}

export const DepositFiatContainer = ({selectedWalletIndex}: DepositFiatProps) => {
    const { formatMessage } = useIntl();

    const history = useHistory();

    const wallets: Wallet[] = useSelector(selectWallets);
    const user: User = useSelector(selectUserInfo);

    const translate = useCallback((id: string) => formatMessage({ id }), [formatMessage]);

    const wallet: Wallet = React.useMemo(() => (wallets[selectedWalletIndex] || DEFAULT_WALLET), [wallets, selectedWalletIndex]);

    const title = translate('page.body.wallets.tabs.deposit.fiat.message1');
    const description = translate('page.body.wallets.tabs.deposit.fiat.message2');

    return (
        <React.Fragment>
            <CurrencyInfo
                wallet={wallets[selectedWalletIndex]}
                handleClickTransfer={currency => history.push(`/wallets/transfer/${currency}`)}
            />
            <DepositFiat title={title} description={description} uid={user ? user.uid : ''}/>
            {wallet.currency && <WalletHistory label="deposit" type="deposits" currency={wallet.currency} />}
        </React.Fragment>
    );
}
