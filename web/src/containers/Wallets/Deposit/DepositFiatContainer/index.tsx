import React, { useCallback } from 'react';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import {
    CurrencyInfo,
    Blur,
    DepositFiat,
} from '../../../../components';
import {
    Wallet,
    Currency,
    User,
    selectWallets,
    selectUserInfo,
    selectCurrencies,
} from '../../../../modules';
import { WalletHistory } from '../../History';

interface DepositFiatProps {
    selectedWalletIndex: number;
}

const defaultWallet: Wallet = {
    name: '',
    currency: '',
    balance: '',
    type: 'coin',
    fixed: 0,
    fee: 0,
    account_type: '',
};

export const DepositFiatContainer = (props: DepositFiatProps) => {
    const { formatMessage } = useIntl();

    const history = useHistory();

    const wallets: Wallet[] = useSelector(selectWallets);
    const user: User = useSelector(selectUserInfo);
    const currencies: Currency[] = useSelector(selectCurrencies);

    const translate = useCallback((id: string) => formatMessage({ id }), [formatMessage]);

    const {
        selectedWalletIndex,
    } = props;

    const wallet: Wallet = (wallets[selectedWalletIndex] || defaultWallet);
    const currencyItem = (currencies && currencies.find(item => item.id === wallet.currency)) || { min_confirmations: 6, deposit_enabled: false };

    const title = translate('page.body.wallets.tabs.deposit.fiat.message1');
    const description = translate('page.body.wallets.tabs.deposit.fiat.message2');

    return (
        <React.Fragment>
            <CurrencyInfo
                wallet={wallets[selectedWalletIndex]}
                handleClickTransfer={currency => history.push(`/wallets/transfer/${currency}`)}
            />
            {currencyItem && !currencyItem.deposit_enabled ? (
                <Blur
                    className="pg-blur-deposit-fiat"
                    text={translate('page.body.wallets.tabs.deposit.disabled.message')}
                />
            ) : null}
            <DepositFiat title={title} description={description} uid={user ? user.uid : ''}/>
            {wallet.currency && <WalletHistory label="deposit" type="deposits" currency={wallet.currency} />}
        </React.Fragment>
    );
}
