import React, { useCallback, useEffect } from 'react';
import { Blur, CurrencyInfo, DepositCrypto, DepositFiat } from 'src/components';
import { formatCCYAddress } from 'src/helpers';
import { useLocalization, useReduxSelector } from 'src/hooks';
import {
    alertPush,
    Currency,
    selectUserInfo,
    selectWalletAddress,
    selectWalletsAddressError,
    Wallet,
    walletsAddressFetch,
} from 'src/modules';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { WalletHistory } from 'src/containers/Wallets/History';

interface Props {
    wallet: Wallet;
    currency: Currency;
}

export const WalletDepositTab: React.FC<Props> = ({ wallet, currency }) => {
    const dispatch = useDispatch();
    const getText = useLocalization();
    const user = useReduxSelector(selectUserInfo);
    const addressDepositError = useReduxSelector(selectWalletsAddressError);
    const selectedWalletAddress = useReduxSelector(selectWalletAddress);

    const handleOnCopy = useCallback(() => {
        dispatch(alertPush({ message: ['page.body.wallets.tabs.deposit.ccy.message.success'], type: 'success' }));
    }, []);

    const text = getText('page.body.wallets.tabs.deposit.ccy.message.submit', {
        confirmations: currency.min_confirmations,
    });

    const error = addressDepositError
        ? getText(addressDepositError.message[0])
        : getText('page.body.wallets.tabs.deposit.ccy.message.error');

    const walletAddress = formatCCYAddress(currency.name, selectedWalletAddress);

    useEffect(() => {
        dispatch(walletsAddressFetch({ currency: currency.id }));
    }, [currency]);

    if (wallet.type === 'coin') {
        return (
            <React.Fragment>
                <CurrencyInfo wallet={wallet} />
                {!currency.deposit_enabled ? (
                    <Blur
                        className={classNames('pg-blur-deposit-crypto', {
                            'pg-blur-deposit-crypto--active': !!wallet.balance,
                        })}
                        text={getText('page.body.wallets.tabs.deposit.disabled.message')}
                    />
                ) : null}
                <DepositCrypto
                    currency={wallet.currency}
                    data={walletAddress}
                    handleOnCopy={handleOnCopy}
                    error={error}
                    text={text}
                    disabled={walletAddress === ''}
                    copiableTextFieldText={getText('page.body.wallets.tabs.deposit.ccy.message.address')}
                    copyButtonText={getText('page.body.wallets.tabs.deposit.ccy.message.button')}
                />
                {currency && <WalletHistory label="deposit" type="deposits" currency={currency} />}
            </React.Fragment>
        );
    } else {
        return (
            <React.Fragment>
                <CurrencyInfo wallet={wallet} />
                {currency.deposit_enabled ? (
                    <Blur
                        className="pg-blur-deposit-fiat"
                        text={getText('page.body.wallets.tabs.deposit.disabled.message')}
                    />
                ) : null}
                <DepositFiat
                    title={getText('page.body.wallets.tabs.deposit.fiat.message1')}
                    description={getText('page.body.wallets.tabs.deposit.fiat.message2')}
                    uid={user ? user.uid : ''}
                />
                {currency && <WalletHistory label="deposit" type="deposits" currency={currency} />}
            </React.Fragment>
        );
    }
};
