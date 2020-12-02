import classnames from 'classnames';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';

import { Blur } from '../../../components/Blur';
import { CurrencyInfo } from '../../../components/CurrencyInfo';
import { DepositCrypto } from '../../../components/DepositCrypto';
import { DepositFiat } from '../../../components/DepositFiat';
import { formatCCYAddress } from '../../../helpers';
import { selectCurrencies } from '../../../modules/public/currencies';
import { selectUserInfo } from '../../../modules/user/profile';
import { selectWalletAddress } from '../../../modules/user/wallets';

const WalletDepositBodyComponent = (props) => {
    const intl = useIntl();
    const currencies = useSelector(selectCurrencies);
    const user = useSelector(selectUserInfo);
    const selectedWalletAddress = useSelector(selectWalletAddress);
    const label = React.useMemo(
        () => intl.formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.message.address' }),
        [intl]
    );
    
    const renderDeposit = (isAccountActivated: boolean) => {
        const { addressDepositError, wallet } = props;
        const currencyItem = (currencies && currencies.find((item) => item.id === wallet.currency)) || {
            min_confirmations: 6,
            deposit_enabled: false,
        };
        const text = intl.formatMessage(
            { id: 'page.body.wallets.tabs.deposit.ccy.message.submit' },
            { confirmations: currencyItem.min_confirmations }
        );
        const error = addressDepositError
            ? intl.formatMessage({ id: addressDepositError.message[0] })
            : intl.formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.message.error' });

        const walletAddress = formatCCYAddress(wallet.currency, selectedWalletAddress) || '';

        const title = intl.formatMessage({ id: 'page.body.wallets.tabs.deposit.fiat.message1' });
        const description = intl.formatMessage({ id: 'page.body.wallets.tabs.deposit.fiat.message2' });
        const blurCryptoClassName = classnames('pg-blur-deposit-crypto', {
            'pg-blur-deposit-crypto--active': isAccountActivated,
        });

        if (wallet.type === 'coin') {
            return (
                <React.Fragment>
                    <CurrencyInfo wallet={wallet} />
                    {currencyItem && !currencyItem.deposit_enabled ? (
                        <Blur
                            className={blurCryptoClassName}
                            text={intl.formatMessage({ id: 'page.body.wallets.tabs.deposit.disabled.message' })}
                        />
                    ) : null}
                    <DepositCrypto
                        currency={wallet.currency as string}
                        data={walletAddress}
                        error={error}
                        text={text}
                        copiableTextFieldText={`${wallet.currency.toUpperCase()} ${label}`}
                        copyButtonText={intl.formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.message.button' })}
                    />
                </React.Fragment>
            );
        } else {
            return (
                <React.Fragment>
                    <CurrencyInfo wallet={wallet} />
                    {currencyItem && !currencyItem.deposit_enabled ? (
                        <Blur
                            className="pg-blur-deposit-fiat"
                            text={intl.formatMessage({ id: 'page.body.wallets.tabs.deposit.disabled.message' })}
                        />
                    ) : null}
                    <DepositFiat title={title} description={description} uid={user ? user.uid : ''} />
                </React.Fragment>
            );
        }
    };

    return <div className="cr-mobile-wallet-deposit-body">{renderDeposit(props.isAccountActivated)}</div>;
};

const WalletDepositBody = React.memo(WalletDepositBodyComponent);

export { WalletDepositBody };
