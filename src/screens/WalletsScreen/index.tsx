import classnames from 'classnames';
import { WalletRouteParams } from 'lib/url';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { useLocalization, useReduxSelector } from 'src/hooks';

import {
    Blur,
    CurrencyInfo,
    DepositCrypto,
    DepositFiat,
    TabPanel,
    WalletItemProps,
    WalletList,
} from '../../components';
import { DEFAULT_CCY_PRECISION } from '../../constants';
import { Withdraw } from '../../containers';
import { ModalWithdrawConfirmation } from '../../containers/ModalWithdrawConfirmation';
import { ModalWithdrawSubmit } from '../../containers/ModalWithdrawSubmit';
import { EstimatedValue } from '../../containers/Wallets/EstimatedValue';
import { WalletHistory } from '../../containers/Wallets/History';
import { formatCCYAddress } from '../../helpers';
import {
    alertPush,
    beneficiariesFetch,
    Beneficiary,
    currenciesFetch,
    selectBeneficiariesActivateSuccess,
    selectBeneficiariesDeleteSuccess,
    selectCurrencies,
    selectHistory,
    selectMobileWalletUi,
    selectUserInfo,
    selectWalletAddress,
    selectWalletCurrency,
    selectWallets,
    selectWalletsAddressError,
    selectWalletsLoading,
    selectWithdrawSuccess,
    setMobileWalletUi,
    walletsAddressFetch,
    walletsData,
    walletsFetch,
    walletsWithdrawCcyFetch,
} from '../../modules';

const defaultBeneficiary: Beneficiary = {
    id: 0,
    currency: '',
    name: '',
    state: '',
    data: {
        address: '',
    },
};

interface Props {
    walletsError: {
        message: string;
    };
}

export const WalletsScreen: React.FC<Props> = ({ walletsError }) => {
    const getText = useLocalization();
    const dispatch = useDispatch();
    const history = useHistory();
    const { currency } = useParams<WalletRouteParams>();

    const [activeIndex, setActiveIndex] = useState(0);
    const [selectedWalletIndex, setSelectedWalletIndex] = useState(-1);
    const [withdrawSubmitModal, setWithdrawSubmitModal] = useState(false);
    const [withdrawConfirmModal, setWithdrawConfirmModal] = useState(false);
    const [otpCode, setOtpCode] = useState('');
    const [amount, setAmount] = useState('');
    const [beneficiary, setBeneficiary] = useState(defaultBeneficiary);
    const [filteredWallets, setFilteredWallets] = useState<WalletItemProps[] | null>(null);
    const [tab, setTab] = useState(getText('page.body.wallets.tabs.deposit'));
    const [withdrawDone, setWithdrawDone] = useState(false);
    const [total, setTotal] = useState('');
    const [currentTabIndex, setCurrentTabIndex] = useState(0);

    const user = useReduxSelector(selectUserInfo);
    const wallets = useReduxSelector(selectWallets);
    const walletsLoading = useReduxSelector(selectWalletsLoading);
    const addressDepositError = useReduxSelector(selectWalletsAddressError);
    const withdrawSuccess = useReduxSelector(selectWithdrawSuccess);
    const historyList = useReduxSelector(selectHistory);
    const mobileWalletChosen = useReduxSelector(selectMobileWalletUi);
    const selectedWalletAddress = useReduxSelector(selectWalletAddress);
    const selectedWalletCurrency = useReduxSelector(selectWalletCurrency);
    const beneficiariesActivateSuccess = useReduxSelector(selectBeneficiariesActivateSuccess);
    const beneficiariesDeleteSuccess = useReduxSelector(selectBeneficiariesDeleteSuccess);
    const currencies = useReduxSelector(selectCurrencies);

    useEffect(() => {
        if (wallets.length === 0) {
            dispatch(walletsFetch());
        }

        if (wallets.length > 0) {
            dispatch(beneficiariesFetch());
        }

        if (!currencies.length) {
            dispatch(currenciesFetch());
        }

        return () => {
            dispatch(walletsData([]));
        };
    }, []);

    useEffect(() => {
        if (wallets.length) {
            const index = selectedWalletIndex >= 0 ? selectedWalletIndex : 0;
            const { type, balance, currency } = wallets[0];
            if (type === 'coin' && balance) {
                dispatch(walletsAddressFetch({ currency }));
            }
        }
    }, [wallets, selectedWalletIndex]);

    useEffect(() => {
        if (beneficiariesActivateSuccess && beneficiariesDeleteSuccess) {
            dispatch(beneficiariesFetch());
        }
    }, [beneficiariesActivateSuccess, beneficiariesDeleteSuccess]);

    useEffect(() => {
        if (withdrawSuccess) {
            toggleSubmitModal();
        }
    }, [withdrawSuccess]);

    const onTabChange = useCallback((index, label) => setTab(label), []);

    const onActiveIndexChange = useCallback((index) => setActiveIndex(index), []);

    const onCurrentTabChange = useCallback((index) => setCurrentTabIndex(index), []);

    const toggleSubmitModal = useCallback(() => {
        setWithdrawSubmitModal(!withdrawSubmitModal);
        setWithdrawDone(true);
    }, [withdrawSubmitModal]);

    const toggleConfirmModal = useCallback(
        (amount?: string, total?: string, beneficiary?: Beneficiary, otpCode?: string) => {
            setAmount(amount || '');
            setBeneficiary(beneficiary ? beneficiary : defaultBeneficiary);
            setOtpCode(otpCode ? otpCode : '');
            setWithdrawConfirmModal(!withdrawConfirmModal);
            setTotal(total || '');
            setWithdrawDone(false);
        },
        [withdrawConfirmModal]
    );

    const renderTabs = useCallback(() => {
        if (selectedWalletIndex === -1) {
            return [{ content: null, label: '' }];
        }

        const showWithdraw = wallets[selectedWalletIndex].type === 'fiat' || wallets[selectedWalletIndex].balance;

        return [
            {
                content: tab === getText('page.body.wallets.tabs.deposit') ? renderDeposit(!!showWithdraw) : null,
                label: getText('page.body.wallets.tabs.deposit'),
            },
            {
                content: tab === getText('page.body.wallets.tabs.withdraw') ? renderWithdraw() : null,
                label: getText('page.body.wallets.tabs.withdraw'),
                disabled: !showWithdraw,
            },
        ];
    }, [wallets, tab, selectedWalletIndex]);

    const handleWithdraw = useCallback(() => {
        if (selectedWalletIndex === -1) {
            return;
        }

        const { currency } = wallets[selectedWalletIndex];

        dispatch(
            walletsWithdrawCcyFetch({
                amount,
                currency: currency.toLowerCase(),
                otp: otpCode,
                beneficiary_id: String(beneficiary.id),
            })
        );

        toggleConfirmModal();
    }, [selectedWalletIndex, otpCode, amount, beneficiary, wallets]);

    const handleOnCopy = useCallback(() => {
        dispatch(alertPush({ message: ['page.body.wallets.tabs.deposit.ccy.message.success'], type: 'success' }));
    }, []);

    const renderDeposit = useCallback(
        (isAccountActivated: boolean) => {
            const currency = (wallets[selectedWalletIndex] || { currency: '' }).currency;

            const currencyItem = (currencies && currencies.find((item) => item.id === currency)) || {
                min_confirmations: 6,
                deposit_enabled: false,
            };

            const text = getText('page.body.wallets.tabs.deposit.ccy.message.submit', {
                confirmations: currencyItem.min_confirmations,
            });

            const error = addressDepositError
                ? getText(addressDepositError.message[0])
                : getText('page.body.wallets.tabs.deposit.ccy.message.error');

            const walletAddress =
                selectedWalletCurrency === currency ? formatCCYAddress(currency, selectedWalletAddress) : '';

            if (wallets[selectedWalletIndex].type === 'coin') {
                return (
                    <React.Fragment>
                        <CurrencyInfo wallet={wallets[selectedWalletIndex]} />
                        {currencyItem && !currencyItem.deposit_enabled ? (
                            <Blur
                                className={classnames('pg-blur-deposit-crypto', {
                                    'pg-blur-deposit-crypto--active': isAccountActivated,
                                })}
                                text={getText('page.body.wallets.tabs.deposit.disabled.message')}
                            />
                        ) : null}
                        <DepositCrypto
                            currency={currency}
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
                        <CurrencyInfo wallet={wallets[selectedWalletIndex]} />
                        {currencyItem && !currencyItem.deposit_enabled ? (
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
        },
        [
            addressDepositError,
            currencies,
            selectedWalletAddress,
            selectedWalletCurrency,
            user,
            wallets,
            selectedWalletIndex,
        ]
    );

    const renderWithdraw = useCallback(() => {
        const currency = (wallets[selectedWalletIndex] || { currency: '' }).currency;
        const currencyItem = currencies && currencies.find((item) => item.id === currency);

        return (
            <React.Fragment>
                <CurrencyInfo wallet={wallets[selectedWalletIndex]} />
                {walletsError && <p className="pg-wallet__error">{walletsError.message}</p>}
                {currencyItem && !currencyItem.withdrawal_enabled ? (
                    <Blur
                        className="pg-blur-withdraw"
                        text={getText('page.body.wallets.tabs.withdraw.disabled.message')}
                    />
                ) : null}
                {renderWithdrawContent()}
                {user.otp && currency && <WalletHistory label="withdraw" type="withdraws" currency={currency} />}
            </React.Fragment>
        );
    }, [currencies, user, wallets, walletsError, selectedWalletIndex]);

    const renderWithdrawContent = useCallback(() => {
        if (selectedWalletIndex === -1) {
            return [{ content: null, label: '' }];
        }
        const { level, otp } = user;

        const wallet = wallets[selectedWalletIndex];
        const { currency, fee, type } = wallet;
        const fixed = (wallet || { fixed: 0 }).fixed;

        return otp ? (
            <Withdraw
                withdrawDone={withdrawDone}
                currency={currency}
                fee={fee}
                onClick={toggleConfirmModal}
                twoFactorAuthRequired={isTwoFactorAuthRequired(level, otp)}
                fixed={fixed}
                type={type}
                withdrawAmountLabel={getText('page.body.wallets.tabs.withdraw.content.amount')}
                withdraw2faLabel={getText('page.body.wallets.tabs.withdraw.content.code2fa')}
                withdrawFeeLabel={getText('page.body.wallets.tabs.withdraw.content.fee')}
                withdrawTotalLabel={getText('page.body.wallets.tabs.withdraw.content.total')}
                withdrawButtonLabel={getText('page.body.wallets.tabs.withdraw.content.button')}
            />
        ) : (
            isOtpDisabled()
        );
    }, [withdrawDone, selectedWalletIndex, wallets, user]);

    const isOtpDisabled = () => {
        return (
            <React.Fragment>
                <p className="pg-wallet__enable-2fa-message">
                    {getText('page.body.wallets.tabs.withdraw.content.enable2fa')}
                </p>
                <Button block={true} onClick={redirectToEnable2fa} size="lg" variant="primary">
                    {getText('page.body.wallets.tabs.withdraw.content.enable2faButton')}
                </Button>
            </React.Fragment>
        );
    };

    const redirectToEnable2fa = useCallback(() => history.push('/security/2fa', { enable2fa: true }), []);

    const isTwoFactorAuthRequired = useCallback((level: number, is2faEnabled: boolean) => {
        return level > 1 || (level === 1 && is2faEnabled);
    }, []);

    const onWalletSelectionChange = useCallback(
        ({ address, type, currency }: WalletItemProps) => {
            const depositTab = { label: renderTabs()[0].label, index: 0 };

            if (!address && wallets.length && type !== 'fiat') {
                dispatch(walletsAddressFetch({ currency }));
            } else if (tab !== depositTab.label && type !== 'fiat') {
                onTabChange(depositTab.index, depositTab.label);
                onCurrentTabChange(depositTab.index);
            }

            const nextWalletIndex = wallets.findIndex(
                (wallet) => wallet.currency.toLowerCase() === currency.toLowerCase()
            );

            setSelectedWalletIndex(nextWalletIndex);
            setWithdrawDone(false);

            dispatch(setMobileWalletUi(wallets[nextWalletIndex].name));
        },
        [wallets, tab]
    );

    // Render

    const formattedWallets = wallets.map((wallet: WalletItemProps) => ({
        ...wallet,
        currency: wallet.currency.toUpperCase(),
        iconUrl: wallet.iconUrl ? wallet.iconUrl : '',
    }));

    const selectedCurrency = (wallets[selectedWalletIndex] || { currency: '' }).currency;

    let confirmationAddress = '';
    let selectedWalletPrecision = DEFAULT_CCY_PRECISION;

    if (wallets[selectedWalletIndex]) {
        selectedWalletPrecision = wallets[selectedWalletIndex].fixed;
        confirmationAddress =
            wallets[selectedWalletIndex].type === 'fiat'
                ? beneficiary.name
                : beneficiary.data
                ? (beneficiary.data.address as string)
                : '';
    }

    return (
        <React.Fragment>
            {wallets.length && <EstimatedValue wallets={wallets} />}
            <div className="pg-container pg-wallet">
                <div className="text-center">{walletsLoading && <Spinner animation="border" variant="primary" />}</div>
                <div
                    className={`row no-gutters pg-wallet__tabs-content ${
                        !historyList.length && 'pg-wallet__tabs-content-height'
                    }`}>
                    <div className={`col-md-5 col-sm-12 col-12 ${mobileWalletChosen && 'd-none d-md-block'}`}>
                        <WalletList
                            onWalletSelectionChange={onWalletSelectionChange}
                            walletItems={filteredWallets || formattedWallets}
                            activeIndex={activeIndex}
                            onActiveIndexChange={onActiveIndexChange}
                        />
                    </div>
                    <div
                        className={`pg-wallet__tabs col-md-7 col-sm-12 col-12 ${
                            !mobileWalletChosen && 'd-none d-md-block'
                        }`}>
                        <TabPanel
                            panels={renderTabs()}
                            onTabChange={onTabChange}
                            currentTabIndex={currentTabIndex}
                            onCurrentTabChange={onCurrentTabChange}
                        />
                    </div>
                </div>
                <ModalWithdrawSubmit
                    show={withdrawSubmitModal}
                    currency={selectedCurrency}
                    onSubmit={toggleSubmitModal}
                />
                <ModalWithdrawConfirmation
                    show={withdrawConfirmModal}
                    amount={total}
                    currency={selectedCurrency}
                    rid={confirmationAddress}
                    onSubmit={handleWithdraw}
                    onDismiss={toggleConfirmModal}
                    precision={selectedWalletPrecision}
                />
            </div>
        </React.Fragment>
    );
};
