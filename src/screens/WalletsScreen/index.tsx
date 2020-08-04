import classnames from 'classnames';
import * as React from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToProps } from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { Blur, CurrencyInfo, DepositCrypto, DepositFiat, TabPanel, WalletItemProps, WalletList } from '../../components';
import { Withdraw, WithdrawProps } from '../../containers';
import { ModalWithdrawConfirmation } from '../../containers/ModalWithdrawConfirmation';
import { ModalWithdrawSubmit } from '../../containers/ModalWithdrawSubmit';
import { EstimatedValue } from '../../containers/Wallets/EstimatedValue';
import { WalletHistory } from '../../containers/Wallets/History';
import { formatCCYAddress, setDocumentTitle } from '../../helpers';
import {IntlProps} from '../../index';
import {
    alertPush,
    beneficiariesFetch,
    Beneficiary,
    currenciesFetch,
    Currency,
    RootState,
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
    User,
    WalletHistoryList,
    walletsAddressFetch,
    walletsData,
    walletsFetch,
    walletsWithdrawCcyFetch,
} from '../../modules';
import { CommonError } from '../../modules/types';


interface ReduxProps {
    user: User;
    wallets: WalletItemProps[];
    withdrawSuccess: boolean;
    addressDepositError?: CommonError;
    walletsLoading?: boolean;
    historyList: WalletHistoryList;
    mobileWalletChosen: string;
    selectedWalletCurrency: string;
    selectedWalletAddress: string;
    beneficiariesActivateSuccess: boolean;
    beneficiariesDeleteSuccess: boolean;
    currencies: Currency[];
}

interface DispatchProps {
    fetchBeneficiaries: typeof beneficiariesFetch;
    fetchWallets: typeof walletsFetch;
    fetchAddress: typeof walletsAddressFetch;
    clearWallets: () => void;
    walletsWithdrawCcy: typeof walletsWithdrawCcyFetch;
    fetchSuccess: typeof alertPush;
    setMobileWalletUi: typeof setMobileWalletUi;
    currenciesFetch: typeof currenciesFetch;
}

const defaultBeneficiary: Beneficiary = {
    id: 0,
    currency: '',
    name: '',
    state: '',
    data: {
        address: '',
    },
};

interface WalletsState {
    activeIndex: number;
    otpCode: string;
    amount: string;
    beneficiary: Beneficiary;
    selectedWalletIndex: number;
    withdrawSubmitModal: boolean;
    withdrawConfirmModal: boolean;
    bchAddress?: string;
    filteredWallets?: WalletItemProps[] | null;
    tab: string;
    withdrawDone: boolean;
    total: string;
    currentTabIndex: number;
    generateAddressTriggered: boolean;
}

interface OwnProps {
    walletsError: {
        message: string;
    };
}

type Props = ReduxProps & DispatchProps & RouterProps & IntlProps & OwnProps;

class WalletsComponent extends React.Component<Props, WalletsState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            activeIndex: 0,
            selectedWalletIndex: -1,
            withdrawSubmitModal: false,
            withdrawConfirmModal: false,
            otpCode: '',
            amount: '',
            beneficiary: defaultBeneficiary,
            tab: this.translate('page.body.wallets.tabs.deposit'),
            withdrawDone: false,
            total: '',
            currentTabIndex: 0,
            generateAddressTriggered: false,
        };
    }

    //tslint:disable member-ordering
    public translate = (id: string) => this.props.intl.formatMessage({ id });

    private title = this.translate('page.body.wallets.tabs.deposit.fiat.message1');
    private description = this.translate('page.body.wallets.tabs.deposit.fiat.message2');

    public componentDidMount() {
        setDocumentTitle('Wallets');
        const { wallets, fetchAddress } = this.props;
        const { selectedWalletIndex } = this.state;

        if (this.props.wallets.length === 0) {
            this.props.fetchWallets();
        }

        if (wallets.length > 0) {
            this.props.fetchBeneficiaries();
        }

        if (selectedWalletIndex === -1 && wallets.length) {
            this.setState({ selectedWalletIndex: 0 });
            wallets[0].type === 'coin' && wallets[0].balance && fetchAddress({ currency: wallets[0].currency });
        }

        if (!this.props.currencies.length) {
            this.props.currenciesFetch();
        }
    }

    public componentWillUnmount() {
        this.props.clearWallets();
    }

    public componentWillReceiveProps(next: Props) {
        const {
            wallets,
            beneficiariesActivateSuccess,
            beneficiariesDeleteSuccess,
            withdrawSuccess,
        } = this.props;

        if (wallets.length === 0 && next.wallets.length > 0) {
            this.setState({
                selectedWalletIndex: 0,
            });
            this.props.fetchBeneficiaries();
            next.wallets[0].type === 'coin' && next.wallets[0].balance && this.props.fetchAddress({ currency: next.wallets[0].currency });
        }

        if (!withdrawSuccess && next.withdrawSuccess) {
            this.toggleSubmitModal();
        }

        if ((next.beneficiariesActivateSuccess && !beneficiariesActivateSuccess) ||
            (next.beneficiariesDeleteSuccess && !beneficiariesDeleteSuccess)) {
            this.props.fetchBeneficiaries();
        }
    }

    public render() {
        const { wallets, historyList, mobileWalletChosen, walletsLoading } = this.props;
        const {
            beneficiary,
            total,
            selectedWalletIndex,
            filteredWallets,
            withdrawSubmitModal,
            withdrawConfirmModal,
            currentTabIndex,
        } = this.state;
        const formattedWallets = wallets.map((wallet: WalletItemProps) => ({
            ...wallet,
            currency: wallet.currency.toUpperCase(),
            iconUrl: wallet.iconUrl ? wallet.iconUrl : '',
        }));
        const selectedCurrency = (wallets[selectedWalletIndex] || { currency: '' }).currency;

        let confirmationAddress = '';
        if (wallets[selectedWalletIndex]) {
            confirmationAddress = wallets[selectedWalletIndex].type === 'fiat' ? (
                beneficiary.name
            ) : (
                beneficiary.data ? (beneficiary.data.address as string) : ''
            );
        }

        return (
            <React.Fragment>
                {wallets.length && <EstimatedValue wallets={wallets} />}
                <div className="pg-container pg-wallet">
                    <div className="text-center">
                        {walletsLoading && <Spinner animation="border" variant="primary" />}
                    </div>
                    <div className={`row no-gutters pg-wallet__tabs-content ${!historyList.length && 'pg-wallet__tabs-content-height'}`}>
                        <div className={`col-md-5 col-sm-12 col-12 ${mobileWalletChosen && 'd-none d-md-block'}`}>
                            <WalletList
                                onWalletSelectionChange={this.onWalletSelectionChange}
                                walletItems={filteredWallets || formattedWallets}
                                activeIndex={this.state.activeIndex}
                                onActiveIndexChange={this.onActiveIndexChange}
                            />
                        </div>
                        <div className={`pg-wallet__tabs col-md-7 col-sm-12 col-12 ${!mobileWalletChosen && 'd-none d-md-block'}`}>
                            <TabPanel
                                panels={this.renderTabs()}
                                onTabChange={this.onTabChange}
                                currentTabIndex={currentTabIndex}
                                onCurrentTabChange={this.onCurrentTabChange}
                            />
                        </div>
                    </div>
                    <ModalWithdrawSubmit
                        show={withdrawSubmitModal}
                        currency={selectedCurrency}
                        onSubmit={this.toggleSubmitModal}
                    />
                    <ModalWithdrawConfirmation
                        show={withdrawConfirmModal}
                        amount={total}
                        currency={selectedCurrency}
                        rid={confirmationAddress}
                        onSubmit={this.handleWithdraw}
                        onDismiss={this.toggleConfirmModal}
                    />
                </div>
            </React.Fragment>
        );
    }

    private onTabChange = (index, label) => this.setState({ tab: label });

    private onActiveIndexChange = index => this.setState({ activeIndex: index });

    private onCurrentTabChange = index => this.setState({ currentTabIndex: index });

    private toggleSubmitModal = () => {
        this.setState((state: WalletsState) => ({
            withdrawSubmitModal: !state.withdrawSubmitModal,
            withdrawDone: true,
        }));
    };

    private toggleConfirmModal = (amount?: string, total?: string, beneficiary?: Beneficiary, otpCode?: string) => {
        this.setState((state: WalletsState) => ({
            amount: amount || '',
            beneficiary: beneficiary ? beneficiary : defaultBeneficiary,
            otpCode: otpCode ? otpCode : '',
            withdrawConfirmModal: !state.withdrawConfirmModal,
            total: total || '',
            withdrawDone: false,
        }));
    };

    private renderTabs() {
        const { tab, selectedWalletIndex } = this.state;
        const { wallets } = this.props;

        if (selectedWalletIndex === -1) {
            return [{ content: null, label: '' }];
        }

        const showWithdraw = wallets[selectedWalletIndex].type === 'fiat' || wallets[selectedWalletIndex].balance;

        return [
            {
                content: tab === this.translate('page.body.wallets.tabs.deposit') ? this.renderDeposit(!!showWithdraw) : null,
                label: this.translate('page.body.wallets.tabs.deposit'),
            },
            {
                content: tab === this.translate('page.body.wallets.tabs.withdraw') ? this.renderWithdraw() : null,
                label: this.translate('page.body.wallets.tabs.withdraw'),
                disabled: !showWithdraw,
            },
        ];
    }

    private handleWithdraw = () => {
        const { selectedWalletIndex, otpCode, amount, beneficiary } = this.state;
        if (selectedWalletIndex === -1) {
            return;
        }

        const { currency } = this.props.wallets[selectedWalletIndex];
        const withdrawRequest = {
            amount,
            currency: currency.toLowerCase(),
            otp: otpCode,
            beneficiary_id: String(beneficiary.id),
        };
        this.props.walletsWithdrawCcy(withdrawRequest);
        this.toggleConfirmModal();
    };

    private handleOnCopy = () => {
        this.props.fetchSuccess({ message: ['page.body.wallets.tabs.deposit.ccy.message.success'], type: 'success'});
    };

    private handleGenerateAddress = () => {
        const { selectedWalletIndex } = this.state;
        const { wallets } = this.props;

        if (!wallets[selectedWalletIndex].address && wallets.length && wallets[selectedWalletIndex].type !== 'fiat') {
            this.props.fetchAddress({ currency: wallets[selectedWalletIndex].currency });
            this.props.fetchWallets();
            this.setState({ generateAddressTriggered: true });
        }
    };

    private renderDeposit = (isAccountActivated: boolean) => {
        const {
            addressDepositError,
            currencies,
            selectedWalletAddress,
            selectedWalletCurrency,
            user,
            wallets,
        } = this.props;
        const { generateAddressTriggered, selectedWalletIndex } = this.state;
        const currency = (wallets[selectedWalletIndex] || { currency: '' }).currency;
        const currencyItem = (currencies && currencies.find(item => item.id === currency)) || { min_confirmations: 6, deposit_enabled: false };
        const text = this.props.intl.formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.message.submit' },
                                                   { confirmations: currencyItem.min_confirmations });
        const error = addressDepositError ?
            this.props.intl.formatMessage({id: addressDepositError.message[0]}) :
            this.props.intl.formatMessage({id: 'page.body.wallets.tabs.deposit.ccy.message.error'});

        const walletAddress = (selectedWalletCurrency === currency) ? formatCCYAddress(currency, selectedWalletAddress) : '';

        const buttonLabel = `
            ${this.translate('page.body.wallets.tabs.deposit.ccy.button.generate')} ${currency.toUpperCase()} ${this.translate('page.body.wallets.tabs.deposit.ccy.button.address')}
        `;
        const blurCryptoClassName = classnames('pg-blur-deposit-crypto', {
            'pg-blur-deposit-crypto--active': isAccountActivated,
        });

        if (wallets[selectedWalletIndex].type === 'coin') {
            return (
                <React.Fragment>
                    <CurrencyInfo wallet={wallets[selectedWalletIndex]}/>
                    {currencyItem && !currencyItem.deposit_enabled ? (
                        <Blur
                            className={blurCryptoClassName}
                            text={this.translate('page.body.wallets.tabs.deposit.disabled.message')}
                        />
                    ) : null}
                    <DepositCrypto
                        data={walletAddress}
                        handleOnCopy={this.handleOnCopy}
                        error={error}
                        text={text}
                        disabled={walletAddress === ''}
                        copiableTextFieldText={this.translate('page.body.wallets.tabs.deposit.ccy.message.address')}
                        copyButtonText={this.translate('page.body.wallets.tabs.deposit.ccy.message.button')}
                        handleGenerateAddress={this.handleGenerateAddress}
                        buttonLabel={buttonLabel}
                        isAccountActivated={isAccountActivated}
                        generateAddressTriggered={generateAddressTriggered}
                    />
                    {currency && <WalletHistory label="deposit" type="deposits" currency={currency} />}
                </React.Fragment>
            );
        } else {
            return (
                <React.Fragment>
                    <CurrencyInfo wallet={wallets[selectedWalletIndex]}/>
                    {currencyItem && !currencyItem.deposit_enabled ? (
                        <Blur
                            className="pg-blur-deposit-fiat"
                            text={this.translate('page.body.wallets.tabs.deposit.disabled.message')}
                        />
                    ) : null}
                    <DepositFiat title={this.title} description={this.description} uid={user ? user.uid : ''}/>
                    {currency && <WalletHistory label="deposit" type="deposits" currency={currency} />}
                </React.Fragment>
            );
        }
    };

    private renderWithdraw = () => {
        const { currencies, user, wallets, walletsError } = this.props;
        const { selectedWalletIndex } = this.state;
        const currency = (wallets[selectedWalletIndex] || { currency: '' }).currency;
        const currencyItem = (currencies && currencies.find(item => item.id === currency));

        return (
            <React.Fragment>
                <CurrencyInfo wallet={wallets[selectedWalletIndex]}/>
                {walletsError && <p className="pg-wallet__error">{walletsError.message}</p>}
                {currencyItem && !currencyItem.withdrawal_enabled ? (
                    <Blur
                        className="pg-blur-withdraw"
                        text={this.translate('page.body.wallets.tabs.withdraw.disabled.message')}
                    />
                ) : null}
                {this.renderWithdrawContent()}
                {user.otp && currency && <WalletHistory label="withdraw" type="withdraws" currency={currency} />}
            </React.Fragment>
        );
    };

    private renderWithdrawContent = () => {
        const { withdrawDone, selectedWalletIndex } = this.state;

        if (selectedWalletIndex === -1) {
            return [{ content: null, label: '' }];
        }
        const { user: { level, otp }, wallets } = this.props;
        const wallet = wallets[selectedWalletIndex];
        const { currency, fee, type } = wallet;
        const fixed = (wallet || { fixed: 0 }).fixed;

        const withdrawProps: WithdrawProps = {
            withdrawDone,
            currency,
            fee,
            onClick: this.toggleConfirmModal,
            twoFactorAuthRequired: this.isTwoFactorAuthRequired(level, otp),
            fixed,
            type,
            withdrawAmountLabel: this.props.intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.amount' }),
            withdraw2faLabel: this.props.intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.code2fa' }),
            withdrawFeeLabel: this.props.intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.fee' }),
            withdrawTotalLabel: this.props.intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.total' }),
            withdrawButtonLabel: this.props.intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.button' }),
        };

        return otp ? <Withdraw {...withdrawProps} /> : this.isOtpDisabled();
    };


    private isOtpDisabled = () => {
        return (
            <React.Fragment>
                <p className="pg-wallet__enable-2fa-message">
                    {this.translate('page.body.wallets.tabs.withdraw.content.enable2fa')}
                </p>
                <Button
                    block={true}
                    onClick={this.redirectToEnable2fa}
                    size="lg"
                    variant="primary"
                >
                    {this.translate('page.body.wallets.tabs.withdraw.content.enable2faButton')}
                </Button>
            </React.Fragment>
        );
    };


    private redirectToEnable2fa = () => this.props.history.push('/security/2fa', { enable2fa: true });


    private isTwoFactorAuthRequired(level: number, is2faEnabled: boolean) {
        return level > 1 || (level === 1 && is2faEnabled);
    }

    private onWalletSelectionChange = (value: WalletItemProps) => {
        const { wallets } = this.props;
        const { tab } = this.state;
        const depositTab = { label: this.renderTabs()[0].label, index: 0 };

        if (!value.address && wallets.length && value.balance && value.type !== 'fiat') {
            this.props.fetchAddress({ currency: value.currency });
        } else if (tab !== depositTab.label && value.type !== 'fiat') {
            this.onTabChange(depositTab.index, depositTab.label);
            this.onCurrentTabChange(depositTab.index);
        }

        const nextWalletIndex = this.props.wallets.findIndex(
            wallet => wallet.currency.toLowerCase() === value.currency.toLowerCase(),
        );

        this.setState({
            selectedWalletIndex: nextWalletIndex,
            generateAddressTriggered: false,
            withdrawDone: false,
        });
        this.props.setMobileWalletUi(wallets[nextWalletIndex].name);
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    user: selectUserInfo(state),
    wallets: selectWallets(state),
    walletsLoading: selectWalletsLoading(state),
    addressDepositError: selectWalletsAddressError(state),
    withdrawSuccess: selectWithdrawSuccess(state),
    historyList: selectHistory(state),
    mobileWalletChosen: selectMobileWalletUi(state),
    selectedWalletAddress: selectWalletAddress(state),
    selectedWalletCurrency: selectWalletCurrency(state),
    beneficiariesActivateSuccess: selectBeneficiariesActivateSuccess(state),
    beneficiariesDeleteSuccess: selectBeneficiariesDeleteSuccess(state),
    currencies: selectCurrencies(state),
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = dispatch => ({
    fetchBeneficiaries: () => dispatch(beneficiariesFetch()),
    fetchWallets: () => dispatch(walletsFetch()),
    fetchAddress: ({ currency }) => dispatch(walletsAddressFetch({ currency })),
    walletsWithdrawCcy: params => dispatch(walletsWithdrawCcyFetch(params)),
    clearWallets: () => dispatch(walletsData([])),
    fetchSuccess: payload => dispatch(alertPush(payload)),
    setMobileWalletUi: payload => dispatch(setMobileWalletUi(payload)),
    currenciesFetch: () => dispatch(currenciesFetch()),
});

// tslint:disable-next-line:no-any
export const WalletsScreen = injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(WalletsComponent) as any)) as any;
