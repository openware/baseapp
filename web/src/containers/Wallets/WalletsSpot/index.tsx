import * as React from 'react';
import { Spinner } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToProps } from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter, Link } from 'react-router-dom';
import { compose } from 'redux';
import { IntlProps } from 'src';
import {
    CurrencyInfo,
    TabPanel,
    WalletList,
    WarningMessage,
} from 'src/components';
import { DepositCryptoContainer, DepositFiatContainer } from '../';
import { DEFAULT_CCY_PRECISION } from 'src/constants';
import { Withdraw, WithdrawProps } from 'src/containers';
import { ModalWithdrawConfirmation } from 'src/containers/ModalWithdrawConfirmation';
import { ModalWithdrawSubmit } from 'src/containers/ModalWithdrawSubmit';
import { WalletsHeader } from 'src/components/WalletsHeader';
import { WalletHistory } from '../History';
import {
    alertPush,
    beneficiariesFetch,
    Beneficiary,
    Currency,
    Market,
    marketsFetch,
    marketsTickersFetch,
    RootState,
    selectBeneficiariesActivateSuccess,
    selectBeneficiariesCreateSuccess,
    selectBeneficiariesDeleteSuccess,
    selectCurrencies,
    selectHistory,
    selectMarkets,
    selectMarketTickers,
    selectMobileWalletUi,
    selectUserInfo,
    selectWallets,
    selectWalletsLoading,
    selectWithdrawSuccess,
    setMobileWalletUi,
    Ticker,
    User,
    Wallet,
    WalletHistoryList,
    walletsData,
    walletsFetch,
    walletsWithdrawCcyFetch,
    selectMemberLevels,
    MemberLevels,
    memberLevelsFetch,
} from 'src/modules';
import { DEFAULT_WALLET } from '../../../constants';

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
    memberLevels: MemberLevels;
    currencies: Currency[];
    markets: Market[];
    tickers: {
        [key: string]: Ticker,
    };
}

interface DispatchProps {
    fetchMarkets: typeof marketsFetch;
    fetchTickers: typeof marketsTickersFetch;
    fetchBeneficiaries: typeof beneficiariesFetch;
    fetchWallets: typeof walletsFetch;
    clearWallets: () => void;
    walletsWithdrawCcy: typeof walletsWithdrawCcyFetch;
    fetchSuccess: typeof alertPush;
    setMobileWalletUi: typeof setMobileWalletUi;
    memberLevelsFetch: typeof memberLevelsFetch;
}

const defaultBeneficiary: Beneficiary = {
    id: 0,
    currency: '',
    name: '',
    state: '',
    blockchain_key: '',
    blockchain_name: '',
    data: {
        address: '',
    },
};

interface WalletsState {
    activeIndex: number;
    otpCode: string;
    amount: string;
    fee: string;
    beneficiary: Beneficiary;
    selectedWalletIndex: number;
    withdrawSubmitModal: boolean;
    withdrawConfirmModal: boolean;
    nonZeroSelected: boolean;
    bchAddress?: string;
    filterValue: string;
    filteredWallets?: Wallet[];
    tab: string;
    withdrawDone: boolean;
    total: string;
    currentTabIndex: number;
}

interface OwnProps {
    walletsError: {
        message: string;
    };
    currency?: string;
    action?: string;
}

type Props = ReduxProps & DispatchProps & RouterProps & IntlProps & OwnProps;

class WalletsSpotComponent extends React.Component<Props, WalletsState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            activeIndex: 0,
            selectedWalletIndex: -1,
            withdrawSubmitModal: false,
            withdrawConfirmModal: false,
            otpCode: '',
            amount: '',
            fee: '',
            beneficiary: defaultBeneficiary,
            tab: this.translate('page.body.wallets.tabs.deposit'),
            withdrawDone: false,
            total: '',
            currentTabIndex: 0,
            filterValue: '',
            filteredWallets: [],
            nonZeroSelected: false,
        };
    }

    //tslint:disable member-ordering
    public translate = (id: string) => this.props.intl.formatMessage({ id });
    public tabMapping = ['deposit', 'withdraw'];

    public componentDidMount() {
        const { wallets, currency, action, markets, tickers, memberLevels } = this.props;
        const { currentTabIndex, selectedWalletIndex } = this.state;

        if (!memberLevels) {
            this.props.memberLevelsFetch();
        }

        if (this.props.wallets.length === 0) {
            this.props.fetchWallets();
        }

        if (wallets.length && selectedWalletIndex === -1) {
            const walletToSet = wallets.find(i => i.currency?.toLowerCase() === currency?.toLowerCase()) || wallets[0];

            this.setState({
                selectedWalletIndex: wallets.indexOf(walletToSet),
                activeIndex: wallets.indexOf(walletToSet),
                filteredWallets: wallets,
            });

            walletToSet?.currency && this.props.fetchBeneficiaries({ currency_id: walletToSet.currency?.toLowerCase() });

            if (walletToSet?.currency && currency !== walletToSet?.currency) {
                this.props.history.push(`/wallets/spot/${walletToSet.currency.toLowerCase()}/${this.tabMapping[currentTabIndex]}`);
            }

            const tabIndex = this.tabMapping.indexOf(action);

            if (tabIndex !== -1 && tabIndex !== currentTabIndex) {
                this.onTabChange(this.translate(`page.body.wallets.tabs.${action}`))
                this.onCurrentTabChange(tabIndex);
            }
        }

        if (!markets.length) {
            this.props.fetchMarkets();
        }

        if (!tickers.length) {
            this.props.fetchTickers();
        }
    }

    public componentWillReceiveProps(next: Props) {
        const {
            wallets,
            beneficiariesActivateSuccess,
            beneficiariesDeleteSuccess,
            withdrawSuccess,
            beneficiariesAddSuccess,
            currency,
            action,
        } = this.props;
        const { selectedWalletIndex, currentTabIndex } = this.state;

        if (!wallets.length && next.wallets.length && selectedWalletIndex === -1) {
            const walletToSet = next.wallets.find(i => i.currency?.toLowerCase() === currency?.toLowerCase()) || next.wallets[0];

            this.setState({
                selectedWalletIndex: next.wallets.indexOf(walletToSet),
                activeIndex: next.wallets.indexOf(walletToSet),
                filteredWallets: next.wallets,
            });

            walletToSet?.currency && this.props.fetchBeneficiaries({ currency_id: walletToSet.currency?.toLowerCase() });

            if (walletToSet?.currency && currency !== walletToSet?.currency) {
                this.props.history.push(`/wallets/spot/${walletToSet.currency.toLowerCase()}/${this.tabMapping[currentTabIndex]}`);
            }
            const tabIndex = this.tabMapping.indexOf(action);

            if (tabIndex !== -1 && tabIndex !== currentTabIndex) {
                this.onTabChange(this.translate(`page.body.wallets.tabs.${action}`))
                this.onCurrentTabChange(tabIndex);
            }
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
        const {
            wallets,
            currencies,
            markets,
            tickers,
            historyList,
            mobileWalletChosen,
            walletsLoading,
        } = this.props;
        const {
            amount,
            fee,
            otpCode,
            beneficiary,
            total,
            selectedWalletIndex,
            withdrawSubmitModal,
            withdrawConfirmModal,
            currentTabIndex,
            nonZeroSelected,
        } = this.state;
        const selectedCurrency = (wallets[selectedWalletIndex] || { currency: '' }).currency;
        const currencyType = (wallets[selectedWalletIndex] || { currency: '' }).type;
        let confirmationAddress = '';
        let selectedWalletPrecision = DEFAULT_CCY_PRECISION;

        if (wallets[selectedWalletIndex]) {
            selectedWalletPrecision = wallets[selectedWalletIndex].fixed;

            if (wallets[selectedWalletIndex].type === 'fiat') {
                confirmationAddress = beneficiary.name;
            } else if (beneficiary.data) {
                confirmationAddress = beneficiary.data.address as string;
            }
        }

        return (
            <React.Fragment>
                <div className="pg-wallet">
                    <div className="text-center">
                        {walletsLoading && <Spinner animation="border" variant="primary" />}
                    </div>
                    <div className={`row no-gutters pg-wallet__tabs-content ${!historyList.length && 'pg-wallet__tabs-content-height'}`}>
                        <div className={`col-md-3 col-sm-12 col-12 ${mobileWalletChosen && 'd-none d-md-block'}`}>
                            <WalletsHeader
                                wallets={wallets}
                                nonZeroSelected={nonZeroSelected}
                                setFilterValue={this.setFilterValue}
                                setFilteredWallets={this.handleFilter}
                                handleClickCheckBox={this.handleToggleCheckbox}
                            />
                            <WalletList
                                onWalletSelectionChange={this.onWalletSelectionChange}
                                walletItems={this.formattedWallets()}
                                activeIndex={this.state.activeIndex}
                                onActiveIndexChange={this.onActiveIndexChange}
                                currencies={currencies}
                                markets={markets}
                                tickers={tickers}
                            />
                        </div>
                        <div className={`pg-wallet__tabs col-md-9 col-sm-12 col-12 ${!mobileWalletChosen && 'd-none d-md-block'}`}>
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
                        beneficiary={beneficiary}
                        otpCode={otpCode}
                        show={withdrawConfirmModal}
                        type={currencyType}
                        amount={amount}
                        fee={fee}
                        total={total}
                        currency={selectedCurrency}
                        rid={confirmationAddress}
                        onSubmit={this.handleWithdraw}
                        onDismiss={this.toggleConfirmModal}
                        handleChangeCodeValue={this.handleChangeCodeValue}
                        precision={selectedWalletPrecision}
                    />
                </div>
            </React.Fragment>
        );
    }

    private formattedWallets = () => {
        const { nonZeroSelected, filteredWallets } = this.state;

        const list = nonZeroSelected ? filteredWallets.filter(i => i.balance && Number(i.balance) > 0) : filteredWallets;

        return list.map((wallet: Wallet) => ({
            ...wallet,
            currency: wallet.currency.toUpperCase(),
            iconUrl: wallet.iconUrl ? wallet.iconUrl : '',
        }));
    }

    private setFilterValue = (value: string) => {
        this.setState({
            filterValue: value,
        });
    };

    private handleFilter = (result: object[]) => {
        this.setState({
            filteredWallets: result as Wallet[],
        });
    };

    private handleToggleCheckbox = () => {
        this.setState(prevState => ({
            nonZeroSelected: !prevState.nonZeroSelected,
        }));
    };

    private onTabChange = label => this.setState({ tab: label });
    private onActiveIndexChange = index => this.setState({ activeIndex: index });
    private onCurrentTabChange = index => {
        const { selectedWalletIndex } = this.state;
        const { wallets } = this.props;

        this.setState({ currentTabIndex: index });
        wallets && wallets[selectedWalletIndex] && this.props.history.push(`/wallets/spot/${wallets[selectedWalletIndex].currency?.toLowerCase()}/${this.tabMapping[index]}`)
    };

    private toggleSubmitModal = () => {
        this.setState((state: WalletsState) => ({
            withdrawSubmitModal: !state.withdrawSubmitModal,
            withdrawDone: true,
        }));
    };

    private toggleConfirmModal = (amount?: string, total?: string, beneficiary?: Beneficiary, otpCode?: string, fee?: string) => {
        this.setState((state: WalletsState) => ({
            amount: amount || '',
            beneficiary: beneficiary ? beneficiary : defaultBeneficiary,
            otpCode: otpCode ? otpCode : '',
            withdrawConfirmModal: !state.withdrawConfirmModal,
            total: total || '',
            fee: fee || '',
            withdrawDone: false,
        }));
    };

    private handleChangeCodeValue = (value: string) => {
        this.setState({
            otpCode: value,
        });
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
                content: tab === this.translate('page.body.wallets.tabs.deposit') ? this.renderDeposit() : null,
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

    private renderDeposit = () => {
        const { selectedWalletIndex } = this.state;
        const {
            wallets,
        } = this.props;

        if (wallets[selectedWalletIndex].type === 'coin') {
            return (
                <DepositCryptoContainer
                    selectedWalletIndex={selectedWalletIndex}
                />
            );
        } else {
            return (
                <DepositFiatContainer selectedWalletIndex={selectedWalletIndex} />
            );
        }
    };

    private renderWithdraw = () => {
        const { user, wallets, walletsError } = this.props;
        const { selectedWalletIndex } = this.state;
        const wallet = (wallets[selectedWalletIndex] || DEFAULT_WALLET);

        return (
            <React.Fragment>
                <CurrencyInfo
                    wallet={wallets[selectedWalletIndex]}
                    handleClickTransfer={currency => this.props.history.push(`/wallets/transfer/${currency}`)}
                />
                {walletsError && <p className="pg-wallet__error">{walletsError.message}</p>}
                {this.renderWithdrawContent()}
                {user.otp && wallet.currency && <WalletHistory label="withdraw" type="withdraws" currency={wallet.currency} />}
            </React.Fragment>
        );
    };

    private renderWithdrawOTP = () => {
        return (
            <React.Fragment>
                <span>{this.translate('page.body.wallets.tabs.withdraw.content.enable2fa')}</span>
                <Link to={{pathname: "/security/2fa", state: {enable2fa: true} }}  className="cr-warning-message--button">
                    <span>{this.translate('page.body.wallets.tabs.withdraw.content.enable2faButton')}</span>
                    <div className="cr-warning-message--arrow" />
                </Link>
            </React.Fragment>
        )
    };

    private renderWithdrawWarningKYC = () => {
        return (
            <React.Fragment>
                <span>{this.translate('page.body.wallets.warning.withdraw.verification')}</span>
                <Link to="/confirm" className="cr-warning-message--button">
                    <span>{this.translate('page.body.wallets.warning.withdraw.verification.button')}</span>
                    <div className="cr-warning-message--arrow" />
                </Link>
            </React.Fragment>
        );
    };

    private renderWithdrawWarningNoNetworks = () => {
        return (
            <span>{this.translate('page.body.wallets.warning.withdraw.disabled')}
                <span className="cr-warning-message--bold">{this.translate('page.body.wallets.warning.withdraw.no.networks')}</span>
            </span>
        );
    };

    private renderWithdrawWarning = () => {
        const { selectedWalletIndex } = this.state;
        const { user: {otp, level}, currencies, wallets, memberLevels } = this.props;

        const wallet = wallets[selectedWalletIndex];
        const currencyItem = (currencies && currencies.find(item => item.id === wallet.currency));

        return (
            <div>
                {!otp && <WarningMessage children={this.renderWithdrawOTP()} hint="page.body.wallets.warning.withdraw.otp.hint"/>}
                {level < memberLevels?.withdraw.minimum_level && <WarningMessage children={this.renderWithdrawWarningKYC()} hint="page.body.wallets.warning.withdraw.verification.hint"/>}
                {!currencyItem?.networks && <WarningMessage children={this.renderWithdrawWarningNoNetworks()} hint="page.body.wallets.warning.withdraw.no.networks.hint"/>}
            </div>
        );
    };

    private renderWithdrawContent = () => {
        const { withdrawDone, selectedWalletIndex } = this.state;

        if (selectedWalletIndex === -1) {
            return [{ content: null, label: '' }];
        }
        const { user: { level, otp }, wallets, currencies, memberLevels } = this.props;
        const wallet = wallets[selectedWalletIndex];
        const { currency, type } = wallet;
        const fixed = (wallet || { fixed: 0 }).fixed;
        const currencyItem = (currencies && currencies.find(item => item.id === wallet.currency));

        const withdrawProps: WithdrawProps = {
            networks: currencyItem.networks,
            withdrawDone,
            price: currencyItem.price,
            name: currencyItem.name,
            currency,
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

        if (!otp || !currencyItem?.networks || level < memberLevels?.withdraw.minimum_level) {
            return this.renderWithdrawWarning();
        }

        return <Withdraw {...withdrawProps} />;
    };

    private isTwoFactorAuthRequired(level: number, is2faEnabled: boolean) {
        return level > 1 || (level === 1 && is2faEnabled);
    }

    private onWalletSelectionChange = (value: Wallet) => {
        const { wallets } = this.props;
        const { currentTabIndex } = this.state;

        const nextWalletIndex = this.props.wallets.findIndex(
            wallet => wallet.currency?.toLowerCase() === value.currency.toLowerCase()
        );

        this.setState({
            selectedWalletIndex: nextWalletIndex,
            withdrawDone: false,
        });

        this.props.fetchBeneficiaries({ currency_id: value.currency.toLowerCase() });
        this.props.history.push(`/wallets/spot/${value.currency.toLowerCase()}/${this.tabMapping[currentTabIndex]}`);
        this.props.setMobileWalletUi(wallets[nextWalletIndex].name);
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    markets: selectMarkets(state),
    tickers: selectMarketTickers(state),
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
    fetchMarkets: () => dispatch(marketsFetch()),
    fetchTickers: () => dispatch(marketsTickersFetch()),
    fetchBeneficiaries: params => dispatch(beneficiariesFetch(params)),
    fetchWallets: () => dispatch(walletsFetch()),
    walletsWithdrawCcy: params => dispatch(walletsWithdrawCcyFetch(params)),
    clearWallets: () => dispatch(walletsData([])),
    fetchSuccess: payload => dispatch(alertPush(payload)),
    setMobileWalletUi: payload => dispatch(setMobileWalletUi(payload)),
    memberLevelsFetch: () => dispatch(memberLevelsFetch()),
});

export const WalletsSpot = compose(
    injectIntl,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps),
)(WalletsSpotComponent) as any; // tslint:disable-this-line:no-any
