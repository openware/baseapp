import { Button } from '@openware/components';
import bch = require('bitcoincashjs');
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { connect, MapDispatchToProps } from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { CurrencyInfo, DepositCrypto, DepositFiat, TabPanel, WalletItemProps, WalletList } from '../../components';
import { ModalWithdrawConfirmation } from '../../containers/ModalWithdrawConfirmation';
import { ModalWithdrawSubmit } from '../../containers/ModalWithdrawSubmit';
import { WalletHistory } from '../../containers/Wallets/History';
import { Withdraw, WithdrawProps } from '../../containers/Wallets/Withdraw';
import { setDocumentTitle } from '../../helpers';
import {
    alertPush,
    RootState,
    selectHistory,
    selectMobileWalletUi,
    selectUserInfo,
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
}

interface DispatchProps {
    fetchWallets: typeof walletsFetch;
    fetchAddress: typeof walletsAddressFetch;
    clearWallets: () => void;
    walletsWithdrawCcy: typeof walletsWithdrawCcyFetch;
    fetchSuccess: typeof alertPush;
    setMobileWalletUi: typeof setMobileWalletUi;
}

interface WalletsState {
    activeIndex: number;
    otpCode: string;
    amount: number;
    rid: string;
    selectedWalletIndex: number;
    withdrawSubmitModal: boolean;
    withdrawConfirmModal: boolean;
    bchAddress?: string;
    filteredWallets?: WalletItemProps[] | null;
    tab: string;
    withdrawDone: boolean;
    total: number;
    currentTabIndex: number;
}

type Props = ReduxProps & DispatchProps & RouterProps & InjectedIntlProps;

class WalletsComponent extends React.Component<Props, WalletsState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            activeIndex: 0,
            selectedWalletIndex: -1,
            withdrawSubmitModal: false,
            withdrawConfirmModal: false,
            otpCode: '',
            amount: 0,
            rid: '',
            tab: this.translate('page.body.wallets.tabs.deposit'),
            withdrawDone: false,
            total: 0,
            currentTabIndex: 0,
        };
    }

    //tslint:disable member-ordering
    public translate = (id: string) => this.props.intl.formatMessage({ id });

    private title = this.translate('page.body.wallets.tabs.deposit.fiat.message1');
    private description = this.translate('page.body.wallets.tabs.deposit.fiat.message2');

    public componentDidMount() {
        setDocumentTitle('Wallets');
        if (this.props.wallets.length === 0) {
            this.props.fetchWallets();
        } else {
            this.props.fetchAddress({ currency: this.props.wallets[0].currency });
        }

        if (this.state.selectedWalletIndex === -1 && this.props.wallets.length) {
            this.setState({ selectedWalletIndex: 0 });
        }
    }

    public componentWillUnmount() {
        this.props.clearWallets();
    }

    public componentWillReceiveProps(next: Props) {
        if (this.props.wallets.length === 0 && next.wallets.length > 0) {
            this.setState({
                selectedWalletIndex: 0,
            });
            this.props.fetchAddress({ currency: next.wallets[0].currency });
        }

        if (!this.props.withdrawSuccess && next.withdrawSuccess) {
            this.toggleSubmitModal();
        }
    }

    public render() {
        const { wallets, historyList, mobileWalletChosen } = this.props;
        const {
            total,
            rid,
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

        return (
            <div className="pg-container pg-wallet">
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
                            panels={this.renderTabs(selectedWalletIndex)}
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
                    rid={rid}
                    onSubmit={this.handleWithdraw}
                    onDismiss={this.toggleConfirmModal}
                />
            </div>
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

    private toggleConfirmModal = (amount?: number, total?: number, rid?: string, otpCode?: string) => {
        this.setState((state: WalletsState) => ({
            amount: amount ? amount : 0,
            rid: rid ? rid : '',
            otpCode: otpCode ? otpCode : '',
            withdrawConfirmModal: !state.withdrawConfirmModal,
            total: total ? total : 0,
        }));
    };

    private renderTabs(walletIndex: WalletsState['selectedWalletIndex']) {
        const { tab, withdrawDone } = this.state;

        if (walletIndex === -1) {
            return [{ content: null, label: '' }];
        }
        const { user: { level, otp }, wallets } = this.props;
        const wallet = wallets[walletIndex];
        const { currency, fee, type } = wallet;
        const fixed = (wallet || { fixed: 0 }).fixed;

        const withdrawProps: WithdrawProps = {
            withdrawDone,
            currency,
            fee,
            onClick: this.toggleConfirmModal,
            borderItem: 'empty-circle',
            twoFactorAuthRequired: this.isTwoFactorAuthRequired(level, otp),
            fixed,
            withdrawAddressLabel: this.props.intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.address' }),
            withdrawAmountLabel: this.props.intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.amount' }),
            withdraw2faLabel: this.props.intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.code2fa' }),
            withdrawFeeLabel: this.props.intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.fee' }),
            withdrawTotalLabel: this.props.intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.total' }),
            withdrawButtonLabel: this.props.intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.button' }),
            withdrawAddressLabelPlaceholder: this.props.intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.addressPlaceholder' }),
        };
        return [
            {
                content: tab === this.translate('page.body.wallets.tabs.deposit') ? this.renderDeposit(wallet) : null,
                label: this.translate('page.body.wallets.tabs.deposit'),
            },
            {
                content: tab === this.translate('page.body.wallets.tabs.withdraw') ? this.renderWithdraw(withdrawProps, type) : null,
                label: this.translate('page.body.wallets.tabs.withdraw'),
            },
        ];
    }

    private handleWithdraw = () => {
        const { selectedWalletIndex, otpCode, amount, rid } = this.state;
        if (selectedWalletIndex === -1) {
            return;
        }

        const { currency } = this.props.wallets[selectedWalletIndex];
        const withdrawRequest = { amount, currency: currency.toLowerCase(), otp: otpCode, rid };
        this.props.walletsWithdrawCcy(withdrawRequest);
        this.toggleConfirmModal();
    };

    private handleOnCopy = () => {
        this.props.fetchSuccess({ message: ['page.body.wallets.tabs.deposit.ccy.message.success'], type: 'success'});
    };

    private renderDeposit(wallet: WalletItemProps) {
        const { addressDepositError, wallets } = this.props;
        const { selectedWalletIndex } = this.state;
        const currency = (wallets[selectedWalletIndex] || { currency: '' }).currency;
        const text = this.props.intl.formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.message.submit' });
        const error = addressDepositError ?
            this.props.intl.formatMessage({id: addressDepositError.message}) :
            this.props.intl.formatMessage({id: 'page.body.wallets.tabs.deposit.ccy.message.error'});

        const walletAddress = wallet.currency === 'BCH' && wallet.address
            ? bch.Address(wallet.address).toString(bch.Address.CashAddrFormat)
            : wallet.address || '';

        if (wallet.type === 'coin') {
            return (
                <React.Fragment>
                    <CurrencyInfo wallet={wallets[selectedWalletIndex]}/>
                    <DepositCrypto
                        data={walletAddress}
                        handleOnCopy={this.handleOnCopy}
                        error={error}
                        text={text}
                        disabled={walletAddress === ''}
                        copiableTextFieldText={this.translate('page.body.wallets.tabs.deposit.ccy.message.address')}
                        copyButtonText={this.translate('page.body.wallets.tabs.deposit.ccy.message.button')}
                    />
                    {currency && <WalletHistory label="deposit" type="deposits" currency={currency} />}
                </React.Fragment>
            );
        } else {
            return (
                <React.Fragment>
                    <CurrencyInfo wallet={wallets[selectedWalletIndex]}/>
                    <DepositFiat title={this.title} description={this.description} />
                    {currency && <WalletHistory label="deposit" type="deposits" currency={currency} />}
                </React.Fragment>
            );
        }
    }

    private renderWithdraw(withdrawProps: WithdrawProps, type: string) {
        const { walletsError, user, wallets } = this.props;
        const { selectedWalletIndex } = this.state;
        const currency = (wallets[selectedWalletIndex] || { currency: '' }).currency;
        if (type === 'fiat') {
            return (
                <p className="pg-wallet__enable-2fa-message">
                    {this.translate('page.body.wallets.tabs.deposit.fiat.admin')}
                </p>
            );
        }
        return (
            <React.Fragment>
                <CurrencyInfo wallet={wallets[selectedWalletIndex]}/>
                {walletsError && <p className="pg-wallet__error">{walletsError.message}</p>}
                {user.otp ? <Withdraw {...withdrawProps} /> : this.isOtpDisabled()}
                {user.otp && currency && <WalletHistory label="withdraw" type="withdraws" currency={currency} />}
            </React.Fragment>
        );
    }

    private isOtpDisabled = () => {
        return (
            <React.Fragment>
                <p className="pg-wallet__enable-2fa-message">
                    {this.translate('page.body.wallets.tabs.withdraw.content.enable2fa')}
                </p>
                <Button
                    className="pg-wallet__button-2fa"
                    label={this.translate('page.body.wallets.tabs.withdraw.content.enable2faButton')}
                    onClick={this.redirectToEnable2fa}
                />
            </React.Fragment>
        );
    };


    private redirectToEnable2fa = () => this.props.history.push('/security/2fa', { enable2fa: true });


    private isTwoFactorAuthRequired(level: number, is2faEnabled: boolean) {
        return level > 1 || level === 1 && is2faEnabled;
    }

    private onWalletSelectionChange = (value: WalletItemProps) => {
        const { wallets } = this.props;
        if (!value.address && !this.props.walletsLoading && value.type !== 'fiat') {
            this.props.fetchAddress({ currency: value.currency });
        }
        const nextWalletIndex = this.props.wallets.findIndex(
            wallet => wallet.currency.toLowerCase() === value.currency.toLowerCase(),
        );
        this.setState({ selectedWalletIndex: nextWalletIndex, withdrawDone: false });
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
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = dispatch => ({
    fetchWallets: () => dispatch(walletsFetch()),
    fetchAddress: ({ currency }) => dispatch(walletsAddressFetch({ currency })),
    walletsWithdrawCcy: params => dispatch(walletsWithdrawCcyFetch(params)),
    clearWallets: () => dispatch(walletsData([])),
    fetchSuccess: payload => dispatch(alertPush(payload)),
    setMobileWalletUi: payload => dispatch(setMobileWalletUi(payload)),
});

// tslint:disable-next-line:no-any
export const WalletsScreen = injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(WalletsComponent) as any));
