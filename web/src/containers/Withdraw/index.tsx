import classnames from 'classnames';
import * as React from 'react';
import { Button, OverlayTrigger } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { compose } from 'redux';
import { IntlProps } from 'src';
import { platformCurrency } from 'src/api';
import { RadioButton } from '../../assets/images/RadioButton';
import { TipIcon } from '../../assets/images/TipIcon';
import { Beneficiaries, InputWithButton, SummaryField, Tooltip } from '../../components';
import { Decimal } from '../../components/Decimal';
import { DEFAULT_FIAT_PRECISION } from '../../constants';
import { cleanPositiveFloatInput, precisionRegExp } from '../../helpers';
import { Beneficiary, BlockchainCurrencies } from '../../modules';
import { UserWithdrawalLimits } from './UserWithdrawalLimits';

export interface WithdrawProps {
    currency: string;
    fee: number;
    balance: string;
    onClick: (amount: string, total: string, beneficiary: Beneficiary, otpCode: string, fee: string) => void;
    fixed: number;
    className?: string;
    type: 'fiat' | 'coin';
    price: string;
    name: string;
    twoFactorAuthRequired?: boolean;
    withdrawAmountLabel?: string;
    withdraw2faLabel?: string;
    withdrawFeeLabel?: string;
    withdrawTotalLabel?: string;
    withdrawButtonLabel?: string;
    withdrawDone: boolean;
    networks: BlockchainCurrencies[];
    isMobileDevice?: boolean;
    withdrawAllButtonLabel?: string;
}

const defaultBeneficiary: Beneficiary = {
    id: 0,
    currency: '',
    name: '',
    blockchain_key: '',
    blockchain_name: '',
    state: '',
    data: {
        address: '',
    },
};

interface WithdrawState {
    amount: string;
    beneficiary: Beneficiary;
    otpCode: string;
    withdrawAmountFocused: boolean;
    withdrawCodeFocused: boolean;
    total: string;
}

type Props = WithdrawProps & IntlProps;

class WithdrawComponent extends React.Component<Props, WithdrawState> {
    public state = {
        amount: '',
        beneficiary: defaultBeneficiary,
        otpCode: '',
        withdrawAmountFocused: false,
        withdrawCodeFocused: false,
        total: '',
    };

    public UNSAFE_componentWillReceiveProps(nextProps) {
        const { currency, withdrawDone } = this.props;

        if ((nextProps && nextProps.currency !== currency) || (nextProps.withdrawDone && !withdrawDone)) {
            this.clearFields(this.state.beneficiary);
        }
    }

    public translate = (id: string) => this.props.intl.formatMessage({ id });

    public render() {
        const { amount, beneficiary, total, withdrawAmountFocused, otpCode } = this.state;
        const {
            networks,
            className,
            currency,
            type,
            twoFactorAuthRequired,
            withdrawAmountLabel,
            withdrawFeeLabel,
            withdrawTotalLabel,
            withdrawButtonLabel,
            withdrawAllButtonLabel,
            fixed,
            price,
            name,
        } = this.props;

        const blockchainItem = networks?.find((item) => item.blockchain_key === beneficiary.blockchain_key);

        const cx = classnames('cr-withdraw', className);
        const lastDividerClassName = classnames('cr-withdraw__divider', {
            'cr-withdraw__divider-one': twoFactorAuthRequired,
            'cr-withdraw__divider-two': !twoFactorAuthRequired,
        });

        const withdrawAmountClass = classnames('cr-withdraw__group__amount', {
            'cr-withdraw__group__amount--focused': withdrawAmountFocused,
        });

        const estimatedValueFee = +price * +blockchainItem?.withdraw_fee;

        return (
            <React.Fragment>
                <h3 className="cr-withdraw-title">{this.translate('page.body.wallets.withdraw.details')}</h3>
                <div className={cx}>
                    <div className="cr-withdraw__group">
                        <div className="cr-withdraw-column">
                            <div className="cr-withdraw__group__address">
                                <Beneficiaries
                                    currency={currency}
                                    type={type}
                                    onChangeValue={this.handleChangeBeneficiary}
                                />
                            </div>
                            {beneficiary.blockchain_key ? (
                                <div>
                                    <div className="cr-withdraw__group__warning">
                                        <OverlayTrigger
                                            placement="right"
                                            delay={{ show: 250, hide: 300 }}
                                            overlay={
                                                <Tooltip title="page.body.wallets.tabs.withdraw.min.amount.tip" />
                                            }>
                                            <div className="cr-withdraw__group__warning-tip">
                                                <TipIcon />
                                            </div>
                                        </OverlayTrigger>
                                        <span>
                                            {this.translate('page.body.wallets.beneficiaries.min.withdraw')}
                                            &nbsp;
                                            <span className="cr-withdraw__group__warning-currency">
                                                <Decimal fixed={fixed} thousSep=",">
                                                    {blockchainItem?.min_withdraw_amount?.toString()}
                                                </Decimal>
                                                &nbsp;{currency.toUpperCase()}
                                            </span>
                                        </span>
                                    </div>
                                    <div className="cr-withdraw__group__network">
                                        <h5>{this.translate('page.body.wallets.withdraw.blockchain.network')}</h5>
                                        <OverlayTrigger
                                            placement="right"
                                            delay={{ show: 250, hide: 300 }}
                                            overlay={<Tooltip title="page.body.wallets.tabs.withdraw.ccy.tip" />}>
                                            <div className="cr-deposit-crypto-tabs__card-title-tip">
                                                <TipIcon />
                                            </div>
                                        </OverlayTrigger>
                                    </div>
                                    <div className="cr-withdraw__group__blockchain-item">
                                        <div className="cr-withdraw-blockchain-item">
                                            <RadioButton />
                                            <div className="cr-withdraw-blockchain-item__group">
                                                <div className="cr-withdraw-blockchain-item-block">
                                                    <h3 className="cr-withdraw-blockchain-item__blockchain_key">
                                                        {name} ({currency.toUpperCase()})
                                                    </h3>
                                                    <div className="cr-withdraw-blockchain-item__withdraw">
                                                        {blockchainItem?.protocol?.toUpperCase()}
                                                    </div>
                                                </div>
                                                <div className="cr-withdraw-blockchain-item-block">
                                                    <div className="cr-withdraw-blockchain-item__fee">
                                                        <span>
                                                            {this.translate('page.body.wallets.beneficiaries.fee')}
                                                            &nbsp;
                                                        </span>
                                                        <Decimal fixed={fixed} thousSep=",">
                                                            {blockchainItem?.withdraw_fee?.toString()}
                                                        </Decimal>{' '}
                                                        {currency.toUpperCase()}
                                                    </div>
                                                    <div className="cr-withdraw-blockchain-item__estimated-value">
                                                        ≈
                                                        <Decimal fixed={DEFAULT_FIAT_PRECISION} thousSep=",">
                                                            {estimatedValueFee.toString()}
                                                        </Decimal>{' '}
                                                        {platformCurrency()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                            <div className="cr-withdraw__divider cr-withdraw__divider-one" />
                            <div className={withdrawAmountClass}>
                                <InputWithButton
                                    type="number"
                                    value={amount}
                                    label={withdrawAmountLabel || 'Withdrawal Amount'}
                                    handleChangeInput={this.handleChangeInputAmount}
                                    className="cr-withdraw__input"
                                    buttonText={withdrawAllButtonLabel}
                                    handleClickButton={this.handleClickAllAmount}
                                />
                            </div>
                            <div className={lastDividerClassName} />
                        </div>
                        <div className="cr-withdraw-column">
                            <div>
                                <SummaryField
                                    className="cr-withdraw__summary-field"
                                    message={withdrawFeeLabel ? withdrawFeeLabel : 'Fee'}
                                    content={this.renderFee()}
                                />
                                <SummaryField
                                    className="cr-withdraw__summary-field"
                                    message={withdrawTotalLabel ? withdrawTotalLabel : 'Total Withdraw Amount'}
                                    content={this.renderTotal()}
                                />
                            </div>
                            <div className="cr-withdraw__deep">
                                <Button
                                    variant="primary"
                                    size="lg"
                                    onClick={this.handleClick}
                                    disabled={this.handleCheckButtonDisabled(total, beneficiary, otpCode)}>
                                    {withdrawButtonLabel ? withdrawButtonLabel : 'Withdraw'}
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="cr-withdraw__group__limits">
                        <UserWithdrawalLimits currencyId={currency} fixed={fixed} price={price} />
                    </div>
                </div>
            </React.Fragment>
        );
    }

    private clearFields = (beneficiary?: Beneficiary) => {
        this.setState({
            amount: '',
            otpCode: '',
            total: '',
            beneficiary: beneficiary || defaultBeneficiary,
        });
    };

    private handleCheckButtonDisabled = (total: string, beneficiary: Beneficiary, otpCode: string) => {
        const isPending = beneficiary.state && beneficiary.state.toLowerCase() === 'pending';

        return Number(total) <= 0 || !Boolean(beneficiary.id) || isPending;
    };

    private renderFee = () => {
        const { networks, fixed, currency } = this.props;
        const { beneficiary } = this.state;

        const blockchainItem = networks?.find((item) => item.blockchain_key === beneficiary.blockchain_key);

        return (
            <span>
                <Decimal fixed={fixed} thousSep=",">
                    {blockchainItem?.withdraw_fee?.toString()}
                </Decimal>{' '}
                {currency.toUpperCase()}
            </span>
        );
    };

    private renderTotal = () => {
        const total = this.state.total;
        const { fixed, currency } = this.props;

        return total ? (
            <span>
                <Decimal fixed={fixed} thousSep=",">
                    {total.toString()}
                </Decimal>{' '}
                {currency.toUpperCase()}
            </span>
        ) : (
            <span>0 {currency.toUpperCase()}</span>
        );
    };

    private handleClick = () => {
        const { networks } = this.props;
        const { beneficiary } = this.state;

        const blockchainItem = networks.find((item) => item.blockchain_key === beneficiary.blockchain_key);

        this.props.onClick(
            this.state.amount,
            this.state.total,
            this.state.beneficiary,
            this.state.otpCode,
            blockchainItem.withdraw_fee?.toString(),
        );

        this.clearFields(beneficiary);
    };

    private handleChangeInputAmount = (value: string) => {
        const { beneficiary } = this.state;
        const { fixed, networks } = this.props;
        const convertedValue = cleanPositiveFloatInput(String(value));
        const blockchainItem = networks.find((item) => item.blockchain_key === beneficiary.blockchain_key);

        if (convertedValue.match(precisionRegExp(fixed))) {
            const amount = convertedValue !== '' ? Number(parseFloat(convertedValue).toFixed(fixed)) : '';
            const total = amount !== '' ? (amount - +blockchainItem.withdraw_fee).toFixed(fixed) : '';

            if (Number(total) <= 0) {
                this.setTotal((0).toFixed(fixed));
            } else {
                this.setTotal(total);
            }

            this.setState({
                amount: convertedValue,
            });
        }
    };

    private handleClickAllAmount = () => {
        this.setState({ amount: Decimal.format(this.props.balance, this.props.fixed) });
        this.handleChangeInputAmount(this.props.balance);
    };

    private setTotal = (value: string) => {
        this.setState({ total: value });
    };

    private handleChangeBeneficiary = (value: Beneficiary) => {
        this.setState({
            beneficiary: value,
        });
    };
}

export const Withdraw = compose(injectIntl)(WithdrawComponent) as any; // tslint:disable-this-line:no-any
