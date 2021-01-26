import classnames from 'classnames';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { Blur } from '../../../components/Blur';
import { CurrencyInfo } from '../../../components/CurrencyInfo';
import { DepositCrypto } from '../../../components/DepositCrypto';
import { DepositFiat } from '../../../components/DepositFiat';
import { selectCurrencies } from '../../../modules/public/currencies';
import { selectUserInfo } from '../../../modules/user/profile';

const WalletDepositBodyComponent = props => {
    const intl = useIntl();
    const currencies = useSelector(selectCurrencies);
    const user = useSelector(selectUserInfo);
    const label = React.useMemo(() => intl.formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.message.address' }), [intl]);
    const handleOnCopy = () => ({});
    const renderDeposit = () => {
        const { wallet } = props;
        const isAccountActivated = wallet.type === 'fiat' || wallet.balance;
        const currencyItem = (currencies && currencies.find(item => item.id === wallet.currency)) || { min_confirmations: 6, deposit_enabled: false };
        const text = intl.formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.message.submit' },
            { confirmations: currencyItem.min_confirmations });
        const error = intl.formatMessage({id: 'page.body.wallets.tabs.deposit.ccy.message.pending'});

        const title = intl.formatMessage({ id: 'page.body.wallets.tabs.deposit.fiat.message1' });
        const description = intl.formatMessage({ id: 'page.body.wallets.tabs.deposit.fiat.message2' });
        const blurCryptoClassName = classnames('pg-blur-deposit-crypto', {
            'pg-blur-deposit-crypto--active': isAccountActivated,
        });

        const buttonLabel = `${intl.formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.button.generate' })} ${wallet.currency.toUpperCase()} ${intl.formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.button.address' })}`;

        if (wallet.type === 'coin') {
            return (
                <React.Fragment>
                    <CurrencyInfo wallet={wallet}/>
                    {currencyItem && !currencyItem.deposit_enabled ? (
                        <Blur
                            className={blurCryptoClassName}
                            text={intl.formatMessage({ id: 'page.body.wallets.tabs.deposit.disabled.message' })}
                        />
                    ) : null}
                    <DepositCrypto
                        buttonLabel={buttonLabel}
                        copiableTextFieldText={`${wallet.currency.toUpperCase()} ${label}`}
                        copyButtonText={intl.formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.message.button'} )}
                        error={error}
                        handleGenerateAddress={props.handleGenerateAddress}
                        handleOnCopy={handleOnCopy}
                        text={text}
                        wallet={wallet}
                    />
                </React.Fragment>
            );
        } else {
            return (
                <React.Fragment>
                    <CurrencyInfo wallet={wallet}/>
                    {currencyItem && !currencyItem.deposit_enabled ? (
                        <Blur
                            className="pg-blur-deposit-fiat"
                            text={intl.formatMessage({ id: 'page.body.wallets.tabs.deposit.disabled.message' })}
                        />
                    ) : null}
                    <DepositFiat title={title} description={description} uid={user ? user.uid : ''}/>
                </React.Fragment>
            );
        }
    };

    return (
        <div className="cr-mobile-wallet-deposit-body">
            {renderDeposit()}
        </div>
    );
};

const WalletDepositBody = React.memo(WalletDepositBodyComponent);

export {
    WalletDepositBody,
};
