import {
    Button,
    DepositCrypto,
    DepositFiat,
    FilterInput,
    TabPanel,
    WalletItemProps,
    WalletList,
    Withdraw,
    WithdrawProps,
} from '@openware/components';
import * as React from 'react';
import { connect, MapDispatchToProps } from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { RootState, selectUserInfo, User } from '../../modules';
import { CommonError } from '../../modules/types';
import {
    selectWallets,
    selectWalletsError,
    selectWalletsLoading,
    selectWithdrawSuccess,
    walletsAddressFetch,
    walletsData,
    walletsFetch,
    walletsWithdrawCcyFetch,
} from '../../modules/wallets';
import { ModalWithdrawConfirmation } from '../ModalWithdrawConfirmation';
import { ModalWithdrawSubmit } from '../ModalWithdrawSubmit';

import bch = require('bitcoincashjs');

interface ReduxProps {
    user: User;
    wallets: WalletItemProps[];
    withdrawSuccess: boolean;
    walletsError?: CommonError;
    walletsLoading?: boolean;
}

interface DispatchProps {
    fetchWallets: typeof walletsFetch;
    fetchAddress: typeof walletsAddressFetch;
    clearWallets: () => void;
    walletsWithdrawCcy: typeof walletsWithdrawCcyFetch;
}

interface WalletsState {
    otpCode: string;
    amount: number;
    rid: string;
    selectedWalletIndex: number;
    withdrawSubmitModal: boolean;
    withdrawConfirmModal: boolean;
    bchAddress?: string;
    filteredWallets?: WalletItemProps[] | null;
}

type Props = ReduxProps & DispatchProps & RouterProps;

const title = 'You can deposit in bank on this credential';
const description = 'Please use information below ' +
    'to complete you bank payment. Your deposit will' +
    ' be reflected in your account within two business days.';
const bankData = [
    {
        key: 'Bank Name',
        value: 'Diamant Bank',
    },
    {
        key: 'Account number',
        value: '10120212',
    },
    {
        key: 'Account name',
        value: 'name',
    },
    {
        key: 'Phone Number',
        value: '+3 8093 1212 12 12',
    },
    {
        key: 'Your reference code',
        value: '8374982374',
    },
];

class WalletsComponent extends React.Component<Props, WalletsState> {
    public state = {
        selectedWalletIndex: -1,
        withdrawSubmitModal: false,
        withdrawConfirmModal: false,
        otpCode: '',
        amount: 0,
        rid: '',
    };

    public componentDidMount() {
        this.props.fetchWallets();
        if (this.state.selectedWalletIndex === -1 && this.props.wallets.length) {
            this.setState({
                selectedWalletIndex: 0,
            });
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
        }

        if (!this.props.withdrawSuccess && next.withdrawSuccess) {
            this.toggleSubmitModal();
        }
    }

    public render() {
        const wallets = this.props.wallets;
        const {
            amount,
            rid,
            selectedWalletIndex,
            filteredWallets,
            withdrawSubmitModal,
            withdrawConfirmModal,
        }: WalletsState = this.state;

        const formattedWallets = wallets.map((wallet: WalletItemProps) => ({
            ...wallet,
            currency: wallet.currency.toUpperCase(),
        }));

        const maybeNoResults = filteredWallets && !filteredWallets.length
            ? 'No results...'
            : null;

        const selectedCurrency = (wallets[selectedWalletIndex] || { currency: '' }).currency;
        const selectedBalance = (wallets[selectedWalletIndex] || { balance: 0 }).balance;
        const selectedLocked = (wallets[selectedWalletIndex] || { locked: 0 }).locked;

        const maybeSelectedTab = selectedWalletIndex !== -1 && (
            <div>
                {this.renderSingle(selectedCurrency, selectedBalance, selectedLocked)}
                <TabPanel panels={this.renderTabs(selectedWalletIndex)} />
            </div>
        );

        return (
            <div className="pg-wallet pg-container">
                <FilterInput
                    filter={this.handleFilter}
                    onFilter={this.searchCallback}
                    data={formattedWallets}
                />
                <p className="pg-wallet__no-results">
                    {maybeNoResults}
                </p>
                <div className="pg-wallet__tabs-content">
                    <WalletList
                        onWalletSelectionChange={this.onWalletSelectionChange}
                        walletItems={filteredWallets || formattedWallets}
                    />
                    <div className="pg-wallet__tabs">
                        {maybeSelectedTab}
                    </div>
                </div>
                <ModalWithdrawSubmit
                  show={withdrawSubmitModal}
                  currency={selectedCurrency}
                  onSubmit={this.toggleSubmitModal}
                />
                <ModalWithdrawConfirmation
                    show={withdrawConfirmModal}
                    amount={amount}
                    currency={selectedCurrency}
                    rid={rid}
                    onSubmit={this.handleWithdraw}
                    onDismiss={this.toggleConfirmModal}
                />
            </div>
        );
    }

    private renderSingle = (currency: string, balance: number, lockedAmount?: number) => {
        const locked = (
            <div>
                <div className="cr-wallet-item__amount-locked">
                    Locked
                </div>
                <span className="cr-wallet-item__balance-locked">
                    {lockedAmount ? lockedAmount : 0}
                </span>
            </div>);
        const displayBalance = (
            <div>
                <span className="cr-wallet-item__balance">
                    {currency.toUpperCase()} Balance
                </span>&nbsp;
                <span className="cr-wallet-item__balance-amount">
                    {balance}
                </span>
            </div>);
        return (
            <div className="cr-wallet-item__single">
                <div>
                    <span className="cr-wallet-item__icon-code"> {currency.toLocaleUpperCase()}</span>
                </div>
                <div className="cr-wallet-item__single-balance">
                    {locked}
                    {displayBalance}
                </div>
            </div>
        );
    }

    private toggleSubmitModal = () => {
        this.setState((state: WalletsState) => ({
            withdrawSubmitModal: !state.withdrawSubmitModal,
        }));
    }

    private toggleConfirmModal = (amount?: number, rid?: string, otpCode?: string) => {
        this.setState((state: WalletsState) => ({
            amount: amount ? amount : 0,
            rid: rid ? rid : '',
            otpCode: otpCode ? otpCode : '',
            withdrawConfirmModal: !state.withdrawConfirmModal,
        }));
    }

    private consist(a: string, b: string): boolean {
        return a.toLowerCase().indexOf(b.toLowerCase()) !== -1;
    }

    private handleFilter = (item: WalletItemProps, term: string) => {
        return this.consist(item.currency, term);
    };

    // tslint:disable-next-line
    private searchCallback = (value: any[]) => {
        this.setState({
            filteredWallets: value,
        });
    };

    private renderTabs(walletIndex: WalletsState['selectedWalletIndex']) {
        if (walletIndex === -1) {
            return [
                {
                    content: null,
                    label: '',
                },
            ];
        }
        const wallet = this.props.wallets[walletIndex];
        const { user: { level, otp } } = this.props;
        const { currency, fee, type } = wallet;
        const withdrawProps = {
            currency,
            fee,
            onClick: this.toggleConfirmModal,
            borderItem: 'empty-circle',
            twoFactorAuthRequired: this.isTwoFactorAuthRequired(level, otp),
        };
        return [
            {
                content: this.renderDeposit(wallet),
                label: 'Deposit',
            },
            {
                content: this.renderWithdraw(withdrawProps, type),
                label: 'Withdraw',
            },
        ];
    }

    private handleWithdraw = () => {
        const {
            selectedWalletIndex,
            otpCode,
            amount,
            rid,
        } = this.state;

        if (selectedWalletIndex === -1) {
            return;
        }

        const { currency } = this.props.wallets[selectedWalletIndex];
        const withdrawRequest = {
            amount,
            currency: currency.toLowerCase(),
            otp: otpCode,
            rid,
        };
        this.props.walletsWithdrawCcy(withdrawRequest);
        this.toggleConfirmModal();
    };

    private renderDeposit(wallet: WalletItemProps) {
        const { walletsError } = this.props;
        const text = 'Please submit a ' +
            'deposit payment using one of the ' +
            'following options. You deposit will be' +
            ' reflected in your account ofter 6 confirmation';
        const { type } = wallet;
        const error = walletsError
            ? walletsError.message
            : '';

        const walletAddress = wallet.currency === 'BCH' && wallet.address
            ? bch.Address(wallet.address).toString(bch.Address.CashAddrFormat)
            : wallet.address || '';

        if (type === 'coin') {
            return (
                <DepositCrypto
                    data={walletAddress}
                    error={error}
                    text={text}
                />
            );
        }

        if (type === 'fiat') {
            return (
                <DepositFiat
                    title={title}
                    description={description}
                    data={bankData}
                />
            );
        }

        return null;
    }

    private renderWithdraw(withdrawProps: WithdrawProps, type: string) {
        const {
            walletsError,
            user,
        } = this.props;

        if (type === 'fiat') {
            return (
                <React.Fragment>
                    <p className="pg-wallet__enable-2fa-message">
                        If you want to make fiat withdraw, please contact administrator!
                    </p>
                </React.Fragment>
            );
        }

        return (
            <React.Fragment>
                {walletsError && <p className="pg-wallet__error">{walletsError.message}</p>}
                {user.otp ? <Withdraw {...withdrawProps} /> : this.isOtpDisabled()}
            </React.Fragment>
        );
    }

    private isOtpDisabled = () => {
        return (
            <React.Fragment>
                <p className="pg-wallet__enable-2fa-message">
                    You should enable 2fa for having abitity to withdraw!
                </p>
                <Button
                    className="pg-wallet__button-2fa"
                    label="Enable 2fa"
                    onClick={this.redirectToEnable2fa}
                />
            </React.Fragment>
        );
    };

    // tslint:disable-next-line:no-any
    private redirectToEnable2fa = (e: any) => {
        this.props.history.push('/security/2fa', { enable2fa: true });
    };

    private isTwoFactorAuthRequired(level: number, is2faEnabled: boolean) {
        return level > 1 || level === 1 && is2faEnabled;
    }

    private onWalletSelectionChange = (value: WalletItemProps) => {
        if (!value.address && !this.props.walletsLoading && value.type !== 'fiat') {
            this.props.fetchAddress({ currency: value.currency });
        }
        const nextWalletIndex = this.props.wallets.findIndex(
            wallet => wallet.currency.toLowerCase() === value.currency.toLowerCase(),
        );
        this.setState({
            selectedWalletIndex: nextWalletIndex,
        });
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    user: selectUserInfo(state),
    wallets: selectWallets(state),
    walletsError: selectWalletsError(state),
    walletsLoading: selectWalletsLoading(state),
    withdrawSuccess: selectWithdrawSuccess(state),
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = dispatch => ({
    fetchWallets: () => dispatch(walletsFetch()),
    fetchAddress: ({ currency }) => dispatch(walletsAddressFetch({ currency })),
    walletsWithdrawCcy: params => dispatch(walletsWithdrawCcyFetch(params)),
    clearWallets: () => dispatch(walletsData([])),
});

// tslint:disable-next-line:no-any
export const Wallets = withRouter(connect(mapStateToProps, mapDispatchToProps)(WalletsComponent) as any);
