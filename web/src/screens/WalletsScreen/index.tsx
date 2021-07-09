import classnames from 'classnames';
import * as React from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToProps } from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { IntlProps } from '../../';
import {
    Blur,
    CurrencyInfo,
    DepositCrypto,
    DepositFiat,
    TabPanel,
    WalletList,
} from '../../components';
import { DEFAULT_CCY_PRECISION } from '../../constants';
import { Withdraw, WithdrawProps } from '../../containers';
import { ModalWithdrawConfirmation } from '../../containers/ModalWithdrawConfirmation';
import { ModalWithdrawSubmit } from '../../containers/ModalWithdrawSubmit';
import { EstimatedValue } from '../../containers/Wallets/EstimatedValue';
import { WalletHistory } from '../../containers/Wallets/History';
import { setDocumentTitle } from '../../helpers';
import {
    alertPush,
    beneficiariesFetch,
    Beneficiary,
    currenciesFetch,
    Currency,
    MemberLevels,
    memberLevelsFetch,
    RootState,
    selectBeneficiariesActivateSuccess,
    selectBeneficiariesCreateSuccess,
    selectBeneficiariesDeleteSuccess,
    selectCurrencies,
    selectHistory,
    selectMemberLevels,
    selectMobileWalletUi,
    selectUserInfo,
    selectWallets,
    selectWalletsLoading,
    selectWithdrawSuccess,
    setMobileWalletUi,
    User,
    Wallet,
    WalletHistoryList,
    walletsAddressFetch,
    walletsData,
    walletsFetch,
    walletsWithdrawCcyFetch,
} from '../../modules';


interface ReduxProps {
    user: User;
    wallets: Wallet[];
    withdrawSuccess: boolean;
    walletsLoading?: boolean;
    historyList: WalletHistoryList;
    mobileWalletChosen: string;
    beneficiariesActivateSuccess: boolean;
    beneficiariesDeleteSuccess: boolean;
    beneficiariesAddSuccess: boolean;
    currencies: Currency[];
    memberLevels?: MemberLevels;
}

interface DispatchProps {
    fetchBeneficiaries: typeof beneficiariesFetch;
    fetchAddress: typeof walletsAddressFetch;
    fetchWallets: typeof walletsFetch;
    clearWallets: () => void;
    walletsWithdrawCcy: typeof walletsWithdrawCcyFetch;
    fetchSuccess: typeof alertPush;
    setMobileWalletUi: typeof setMobileWalletUi;
    currenciesFetch: typeof currenciesFetch;
    memberLevelsFetch: typeof memberLevelsFetch;
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

const defaultWallet: Wallet = {
    name: '',
    currency: '',
    balance: '',
    type: 'coin',
    fixed: 0,
    fee: 0,
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
    filteredWallets?: Wallet[] | null;
    tab: string;
    withdrawDone: boolean;
    total: string;
    currentTabIndex: number;
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
        };
    }

    //tslint:disable member-ordering
    public translate = (id: string) => this.props.intl.formatMessage({ id });

    private title = this.translate('page.body.wallets.tabs.deposit.fiat.message1');
    private description = this.translate('page.body.wallets.tabs.deposit.fiat.message2');

    public componentDidMount() {
        setDocumentTitle('Wallets');
        const { wallets, memberLevels } = this.props;
        const { selectedWalletIndex } = this.state;

        if (this.props.wallets.length === 0) {
            this.props.fetchWallets();
        }

        if (selectedWalletIndex === -1 && wallets.length) {
            this.setState({ selectedWalletIndex: 0 });
            wallets[0]?.currency && this.props.fetchBeneficiaries({ currency_id: wallets[0].currency.toLowerCase() });
        }

        if (!this.props.currencies.length) {
            this.props.currenciesFetch();
        }

        if (!memberLevels) {
            this.props.memberLevelsFetch();
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
            beneficiariesAddSuccess,
        } = this.props;
        const { selectedWalletIndex } = this.state;

        if (!wallets.length && next.wallets.length) {
            this.setState({ selectedWalletIndex: 0 });
            next.wallets[0]?.currency && this.props.fetchBeneficiaries({ currency_id:  next.wallets[0].currency.toLowerCase() });
        }

        if (!withdrawSuccess && next.withdrawSuccess) {
            this.toggleSubmitModal();
        }

        if ((next.beneficiariesActivateSuccess && !beneficiariesActivateSuccess) ||
            (next.beneficiariesDeleteSuccess && !beneficiariesDeleteSuccess) ||
            (next.beneficiariesAddSuccess && !beneficiariesAddSuccess)) {
            const selectedCurrency = (next.wallets[selectedWalletIndex] || { currency: '' }).currency;

            this.props.fetchBeneficiaries({ currency_id: selectedCurrency.toLowerCase() });
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
        const formattedWallets = wallets.map((wallet: Wallet) => ({
            ...wallet,
            currency: wallet.currency.toUpperCase(),
            iconUrl: wallet.iconUrl ? wallet.iconUrl : '',
        }));
        const selectedCurrency = (wallets[selectedWalletIndex] || { currency: '' }).currency;
        let confirmationAddress = '';
        let selectedWalletPrecision = DEFAULT_CCY_PRECISION;

        if (wallets[selectedWalletIndex]) {
            selectedWalletPrecision = wallets[selectedWalletIndex].fixed;
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
                                onTabChange={(_, label) => this.onTabChange(label)}
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
                        precision={selectedWalletPrecision}
                    />
                </div>
            </React.Fragment>
        );
    }

    private onTabChange = label => this.setState({ tab: label });
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

        const wallet: Wallet = wallets[selectedWalletIndex] || defaultWallet;

        if (!wallet.deposit_address && wallets.length && wallet.type !== 'fiat') {
            this.props.fetchAddress({ currency: wallets[selectedWalletIndex].currency });
        }
    };

    private renderDeposit = (isAccountActivated: boolean) => {
        const {
            currencies,
            user,
            wallets,
            memberLevels,
        } = this.props;
        const { selectedWalletIndex } = this.state;
        const wallet: Wallet = (wallets[selectedWalletIndex] || defaultWallet);
        const currencyItem = (currencies && currencies.find(item => item.id === wallet.currency)) || { min_confirmations: 6, deposit_enabled: false };
        const text = this.props.intl.formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.message.submit' },
                                                   { confirmations: currencyItem.min_confirmations });
        const error = this.props.intl.formatMessage({id: 'page.body.wallets.tabs.deposit.ccy.message.pending'});

        const blurClassName = classnames(`pg-blur-deposit-${wallets[selectedWalletIndex].type}`, {
            'pg-blur-deposit-coin--active': isAccountActivated && wallets[selectedWalletIndex].type === 'coin',
            'pg-blur-deposit-fiat--active': isAccountActivated && wallets[selectedWalletIndex].type === 'fiat',
        });

        const buttonLabel = `${this.translate('page.body.wallets.tabs.deposit.ccy.button.generate')} ${wallet.currency.toUpperCase()} ${this.translate('page.body.wallets.tabs.deposit.ccy.button.address')}`;

        const blurIfNotEnoughLevel = (
            <Blur
                className={blurClassName}
                text={this.translate('page.body.wallets.warning.deposit.verification')}
                onClick={() => this.props.history.push("/confirm")}
                linkText={this.translate('page.body.wallets.warning.deposit.verification.button')}
            />
        );

        const blurIfDepositDisabled = (
            <Blur
                className={blurClassName}
                text={this.translate('page.body.wallets.tabs.deposit.disabled.message')}
            />
        );

        if (wallets[selectedWalletIndex].type === 'coin') {
            return (
                <React.Fragment>
                    <CurrencyInfo wallet={wallets[selectedWalletIndex]}/>
                    {currencyItem && !currencyItem.deposit_enabled ? blurIfDepositDisabled : null}
                    {user.level < memberLevels?.deposit.minimum_level ? blurIfNotEnoughLevel : null}
                    <DepositCrypto
                        buttonLabel={buttonLabel}
                        copiableTextFieldText={this.translate('page.body.wallets.tabs.deposit.ccy.message.address')}
                        copyButtonText={this.translate('page.body.wallets.tabs.deposit.ccy.message.button')}
                        error={error}
                        handleGenerateAddress={this.handleGenerateAddress}
                        handleOnCopy={this.handleOnCopy}
                        text={text}
                        wallet={wallet}
                    />
                    {wallet.currency && <WalletHistory label="deposit" type="deposits" currency={wallet.currency} />}
                </React.Fragment>
            );
        } else {
            return (
                <React.Fragment>
                    <CurrencyInfo wallet={wallets[selectedWalletIndex]}/>
                    {currencyItem && !currencyItem.deposit_enabled ? blurIfDepositDisabled : null}
                    {user.level < memberLevels?.deposit.minimum_level ? blurIfNotEnoughLevel : null}
                    <DepositFiat title={this.title} description={this.description} uid={user ? user.uid : ''}/>
                    {wallet.currency && <WalletHistory label="deposit" type="deposits" currency={wallet.currency} />}
                </React.Fragment>
            );
        }
    };

    private renderWithdraw = () => {
        const { currencies, user, wallets, walletsError, withdrawSuccess, memberLevels } = this.props;
        const { selectedWalletIndex } = this.state;
        const wallet = (wallets[selectedWalletIndex] || defaultWallet);
        const currencyItem = (currencies && currencies.find(item => item.id === wallet.currency));

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
                {user.level < memberLevels?.withdraw.minimum_level ? (
                    <Blur
                        className={`pg-blur-withdraw pg-blur-withdraw-${currencyItem?.type}`}
                        text={this.translate('page.body.wallets.warning.withdraw.verification')}
                        onClick={() => this.props.history.push("/confirm")}
                        linkText={this.translate('page.body.wallets.warning.withdraw.verification.button')}
                    />
                ) : null}
                {!user.otp ? (
                    <Blur
                        className={`pg-blur-withdraw pg-blur-withdraw-${currencyItem?.type}`}
                        text={this.translate('page.body.wallets.warning.withdraw.2fa')}
                        onClick={() => this.props.history.push('/security/2fa', { enable2fa: true })}
                        linkText={this.translate('page.body.wallets.warning.withdraw.2fa.button')}
                    />
                ) : null}
                {this.renderWithdrawContent()}
                {user.otp && wallet.currency && <WalletHistory label="withdraw" type="withdraws" currency={wallet.currency} withdrawSuccess={withdrawSuccess} />}
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

    private onWalletSelectionChange = (value: Wallet) => {
        const { wallets } = this.props;

        const nextWalletIndex = this.props.wallets.findIndex(
            wallet => wallet.currency.toLowerCase() === value.currency.toLowerCase()
        );

        this.setState({
            selectedWalletIndex: nextWalletIndex,
            withdrawDone: false,
        });

        this.props.fetchBeneficiaries({ currency_id: value.currency.toLowerCase() });
        this.props.setMobileWalletUi(wallets[nextWalletIndex].name);
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    user: selectUserInfo(state),
    wallets: selectWallets(state),
    walletsLoading: selectWalletsLoading(state),
    withdrawSuccess: selectWithdrawSuccess(state),
    historyList: selectHistory(state),
    mobileWalletChosen: selectMobileWalletUi(state),
    beneficiariesActivateSuccess: selectBeneficiariesActivateSuccess(state),
    beneficiariesDeleteSuccess: selectBeneficiariesDeleteSuccess(state),
    currencies: selectCurrencies(state),
    beneficiariesAddSuccess: selectBeneficiariesCreateSuccess(state),
    memberLevels: selectMemberLevels(state),
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = dispatch => ({
    fetchBeneficiaries: params => dispatch(beneficiariesFetch(params)),
    fetchWallets: () => dispatch(walletsFetch()),
    fetchAddress: ({ currency }) => dispatch(walletsAddressFetch({ currency })),
    walletsWithdrawCcy: params => dispatch(walletsWithdrawCcyFetch(params)),
    clearWallets: () => dispatch(walletsData([])),
    fetchSuccess: payload => dispatch(alertPush(payload)),
    setMobileWalletUi: payload => dispatch(setMobileWalletUi(payload)),
    currenciesFetch: () => dispatch(currenciesFetch()),
    memberLevelsFetch: () => dispatch(memberLevelsFetch()),
});

export const WalletsScreen = compose(
    injectIntl,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps),
)(WalletsComponent) as React.ComponentClass;
