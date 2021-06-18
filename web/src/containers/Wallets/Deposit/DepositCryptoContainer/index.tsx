import { OverlayTrigger } from 'react-bootstrap';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { TipIcon } from '../../../../assets/images/TipIcon';
import {
    CurrencyInfo,
    DepositCrypto,
    TabPanel,
    Tooltip,
    WarningMessage,
} from '../../../../components';
import {
    Wallet,
    Currency,
    selectWallets,
    selectCurrencies,
    walletsAddressFetch,
    alertPush,
    selectMemberLevels,
    selectUserInfo,
    User,
} from '../../../../modules';
import { WalletHistory } from '../../History';
import { DEFAULT_WALLET } from '../../../../constants';

interface DepositCryptoProps {
    selectedWalletIndex: number;
}

export const DepositCryptoContainer = React.memo((props: DepositCryptoProps) => {
    const {
        selectedWalletIndex,
    } = props;

    const { formatMessage } = useIntl();

    const history = useHistory();
    const dispatch = useDispatch();

    const wallets: Wallet[] = useSelector(selectWallets);
    const currencies: Currency[] = useSelector(selectCurrencies);
    const memberLevels = useSelector(selectMemberLevels);
    const user: User = useSelector(selectUserInfo);

    const wallet: Wallet = (wallets[selectedWalletIndex] || DEFAULT_WALLET);
    const currencyItem: Currency | any = (currencies && currencies.find(item => item.id === wallet.currency)) || { min_confirmations: 6, deposit_enabled: false };

    const [tab, setTab] = useState(currencyItem?.networks ? currencyItem?.networks[0]?.blockchain_key : '')
    const [currentTabIndex, setCurrentTabIndex] = useState(0);

    const blockchain = currencyItem.networks?.find(item => item.blockchain_key?.toLowerCase() === tab?.toLowerCase());

    useEffect(() => {
        setTab(currencyItem?.networks ? currencyItem?.networks[0]?.blockchain_key?.toUpperCase() : '');
    }, [wallet.currency]);

    const depositAddress = wallet.deposit_addresses?.find(address => address.blockchain_key?.toLowerCase() === tab?.toLowerCase());

    const translate = useCallback((id: string) => formatMessage({ id }), [formatMessage]);

    const text = formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.message.submit' },
                                                   { confirmations: currencyItem.min_confirmations });

    const error = translate('page.body.wallets.tabs.deposit.ccy.message.pending');
    const buttonLabel = `${translate('page.body.wallets.tabs.deposit.ccy.button.generate')} ${wallet.currency.toUpperCase()} ${translate('page.body.wallets.tabs.deposit.ccy.button.address')}`;

    const handleGenerateAddress = () => {
            if (!depositAddress && wallets.length && wallet.type !== 'fiat' &&
                currencyItem?.networks && blockchain?.status !==' disabled' &&
                tab?.toLowerCase() === blockchain?.blockchain_key?.toLowerCase()) {
                dispatch(walletsAddressFetch({ currency: wallets[selectedWalletIndex].currency, blockchain_key: tab }));
            }
        };

    const handleOnCopy = () => dispatch(alertPush({ message: ['page.body.wallets.tabs.deposit.ccy.message.success'], type: 'success'}));

    const onTabChange = label => {
        const blockchainItem = currencyItem.networks?.find(item => item.protocol?.toUpperCase() === label || item.blockchgain_key?.toUpperCase() === label);

        setTab(blockchainItem.blockchain_key);
    };

    const onCurrentTabChange = index => setCurrentTabIndex(index);

    const renderTabs = useMemo(() => {
        return currencyItem?.networks?.map(network => {
            return {
                content: tab?.toUpperCase() === network.blockchain_key?.toUpperCase() ?
                    <DepositCrypto
                        buttonLabel={buttonLabel}
                        copiableTextFieldText={translate('page.body.wallets.tabs.deposit.ccy.message.address')}
                        copyButtonText={translate('page.body.wallets.tabs.deposit.ccy.message.button')}
                        error={error}
                        handleGenerateAddress={handleGenerateAddress}
                        handleOnCopy={handleOnCopy}
                        text={text}
                        wallet={wallet}
                        disabled={blockchain?.status === 'disabled'}
                        network={tab}
                    /> : null,
                label: network.protocol?.toUpperCase() || network.blockchain_key?.toUpperCase(),
            };
        })
    }, [currencyItem, tab])


    const renderWarningNoNetworks = useMemo(() => (
        <span>{translate('page.body.wallets.warning.deposit.disabled')}
            <span className="cr-warning-message--bold">{translate('page.body.wallets.warning.no.networks')}</span>
        </span>), []);

    const renderWithdrawWarningKYC = useMemo(() => {
        return (
            <React.Fragment>
                <span>{translate('page.body.wallets.warning.deposit.verification')}</span>
                <Link to="/confirm" className="cr-warning-message--button">
                    <span>{translate('page.body.wallets.warning.deposit.verification.button')}</span>
                    <div className="cr-warning-message--arrow" />
                </Link>
            </React.Fragment>
        );
    }, []);

    const renderWarning = useMemo(() => {
        return (
            <div>
                {!currencyItem?.networks?.length && <WarningMessage children={renderWarningNoNetworks} hint="Lorem ipsum"/>}
                {user.level < memberLevels?.deposit.minimum_level && <WarningMessage children={renderWithdrawWarningKYC} hint="Lorem ipsum"/>}
            </div>
        );
    }, [currencyItem, memberLevels]);

    return (
        <React.Fragment>
            <CurrencyInfo
                wallet={wallets[selectedWalletIndex]}
                handleClickTransfer={currency => history.push(`/wallets/transfer/${currency}`)}
            />
            {currencyItem?.networks?.length && user.level > memberLevels?.deposit.minimum_level ?
                <div className="cr-deposit-crypto-tabs">
                    <h3>{translate('page.body.wallets.tabs.deposit.ccy.details')}</h3>
                    <div className="cr-deposit-crypto-tabs__card">
                        <div className="cr-deposit-crypto-tabs__card-title">
                            <h5>{translate('page.body.wallets.tabs.deposit.ccy.blockchain.networks')}</h5>
                            <OverlayTrigger
                                placement="right"
                                delay={{ show: 250, hide: 300 }}
                                overlay={<Tooltip title="page.body.wallets.tabs.deposit.ccy.tip" />}>
                                <div className="cr-deposit-crypto-tabs__card-title-tip">
                                    <TipIcon />
                                </div>
                            </OverlayTrigger>
                        </div>
                        <TabPanel
                            panels={renderTabs}
                            onTabChange={(_, label) => onTabChange(label)}
                            currentTabIndex={currentTabIndex}
                            onCurrentTabChange={onCurrentTabChange}
                        />
                    </div>
                </div> : null}
            {renderWarning}
            {wallet.currency && <WalletHistory label="deposit" type="deposits" currency={wallet.currency} />}
        </React.Fragment>
    );
});
