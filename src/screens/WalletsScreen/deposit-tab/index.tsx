import React, { useEffect, useMemo } from 'react';
import { Blur, CurrencyInfo, DepositCrypto, DepositFiat } from 'src/components';
import { formatCCYAddress } from 'src/helpers';
import { useLocalization, useReduxSelector } from 'src/hooks';
import {
    Currency,
    selectUserInfo,
    selectWalletAddress,
    selectWalletsAddressError,
    Wallet,
    walletsAddressFetch,
} from 'src/modules';
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

    const error = getText(
        addressDepositError ? addressDepositError.message[0] : 'page.body.wallets.tabs.deposit.ccy.message.error'
    );

    const walletAddress = formatCCYAddress(currency.name, selectedWalletAddress);

    useEffect(() => {
        dispatch(walletsAddressFetch({ currency: currency.id }));
    }, [currency]);

    const blur = useMemo(() => {
        return currency.deposit_enabled ? null : (
            <Blur text={getText('page.body.wallets.tabs.deposit.disabled.message')} />
        );
    }, [currency]);

    return (
        <React.Fragment>
            <CurrencyInfo wallet={wallet} />
            {wallet.type === 'coin' ? (
                <DepositCrypto
                    currency={wallet.currency}
                    data={walletAddress}
                    error={error}
                    text={getText('page.body.wallets.tabs.deposit.ccy.message.submit', {
                        confirmations: currency.min_confirmations,
                    })}
                    copiableTextFieldText={getText('page.body.wallets.tabs.deposit.ccy.message.address')}
                    copyButtonText={getText('page.body.wallets.tabs.deposit.ccy.message.button')}
                    blur={blur}
                />
            ) : (
                <DepositFiat
                    title={getText('page.body.wallets.tabs.deposit.fiat.message1')}
                    description={getText('page.body.wallets.tabs.deposit.fiat.message2')}
                    uid={user ? user.uid : ''}
                    blur={blur}
                />
            )}
            <WalletHistory label="deposit" type="deposits" currency={currency.id} />
        </React.Fragment>
    );
};
