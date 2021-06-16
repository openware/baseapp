import React, { useState, useEffect, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { TabPanel } from '../../../components';
import { CurrencyInfo } from '../../../components/CurrencyInfo';
import { DepositCrypto } from '../../../components/DepositCrypto';
import { DepositFiat } from '../../../components/DepositFiat';
import { selectUserInfo } from '../../../modules/user/profile';
import {
    Currency,
    selectCurrencies,
    walletsAddressFetch
} from '../../../modules';

const WalletDepositBodyComponent = props => {
    const { wallet } = props;
    const intl = useIntl();
    const dispatch = useDispatch();

    const currencies: Currency[] = useSelector(selectCurrencies);

    const user = useSelector(selectUserInfo);
    const label = React.useMemo(() => intl.formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.message.address' }), [intl]);
    const handleOnCopy = () => ({});

    const currencyItem: Currency | any = (currencies && currencies.find(item => item.id === wallet.currency)) || { min_confirmations: 6, deposit_enabled: false };

    const [tab, setTab] = useState(currencyItem?.networks ? currencyItem?.networks[0]?.blockchain_key : '');
    const [currentTabIndex, setCurrentTabIndex] = useState(0);

    useEffect(() => {
        setTab(currencyItem?.networks ? currencyItem?.networks[0]?.blockchain_key.toUpperCase() : '');
    }, [wallet.currency]);

    const depositAddress = wallet.deposit_addresses?.find(address => address.blockchain_key?.toLowerCase() === tab?.toLowerCase());

    const text = intl.formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.message.submit' },
        { confirmations: currencyItem.min_confirmations });
    const error = intl.formatMessage({id: 'page.body.wallets.tabs.deposit.ccy.message.pending'});

    const title = intl.formatMessage({ id: 'page.body.wallets.tabs.deposit.fiat.message1' });
    const description = intl.formatMessage({ id: 'page.body.wallets.tabs.deposit.fiat.message2' });

    const buttonLabel = `${intl.formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.button.generate' })} ${wallet.currency.toUpperCase()} ${intl.formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.button.address' })}`;

    const handleGenerateAddress = useEffect(() => {
        if (!depositAddress && wallet.type !== 'fiat') {
            dispatch(walletsAddressFetch({ currency: wallet.currency, blockchain_key: tab }));
        }
    }, [wallet, walletsAddressFetch, tab]);

    const onTabChange = label => {
        const blockchain = currencyItem.networks?.find(item => item.protocol.toUpperCase() === label);

        setTab(blockchain.blockchain_key);
    };

    const onCurrentTabChange = index => setCurrentTabIndex(index);

    const renderTabs = useMemo(() => {
        return currencyItem.networks?.map(network => {
            return {
                content: tab.toUpperCase() === network.blockchain_key?.toUpperCase() ?
                    <DepositCrypto
                        buttonLabel={buttonLabel}
                        copiableTextFieldText={`${wallet.currency.toUpperCase()} ${label}`}
                        copyButtonText={intl.formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.message.button'} )}
                        error={error}
                        handleGenerateAddress={() => handleGenerateAddress}
                        handleOnCopy={handleOnCopy}
                        text={text}
                        wallet={wallet}
                        network={tab}
                    /> : null,
                label: network.protocol?.toUpperCase(),
            };
        })
    }, [tab, currencyItem]);

    const renderDeposit = () => {
        if (wallet.type === 'coin') {
            return (
                <React.Fragment>
                    <CurrencyInfo wallet={wallet}/>
                    {currencyItem.networks && <TabPanel
                        panels={renderTabs}
                        onTabChange={(_, label) => onTabChange(label)}
                        currentTabIndex={currentTabIndex}
                        onCurrentTabChange={onCurrentTabChange}
                    />}
                </React.Fragment>
            );
        } else {
            return (
                <React.Fragment>
                    <CurrencyInfo wallet={wallet}/>
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
