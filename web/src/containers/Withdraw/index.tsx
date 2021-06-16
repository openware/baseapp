import classnames from 'classnames';
import * as React from 'react';
import { Button, OverlayTrigger } from 'react-bootstrap';
import {
    Beneficiaries,
    CustomInput,
    SummaryField,
    Tooltip,
} from '../../components';
import { Decimal } from '../../components/Decimal';
import { cleanPositiveFloatInput, precisionRegExp } from '../../helpers';
import { Beneficiary, BlockchainCurrencies } from '../../modules';
import { TipIcon } from '../../assets/images/TipIcon';
import { RadioButton } from '../../assets/images/RadioButton';

export interface WithdrawProps {
    currency: string;
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
    blockchain_currencies: BlockchainCurrencies[];
    isMobileDevice?: boolean;
}

const defaultBeneficiary: Beneficiary = {
    id: 0,
    currency: '',
    name: '',
    blockchain_key: '',
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

export class Withdraw extends React.Component<WithdrawProps, WithdrawState> {
    public state = {
        amount: '',
        beneficiary: defaultBeneficiary,
        otpCode: '',
        withdrawAmountFocused: false,
        withdrawCodeFocused: false,
        total: '',
    };

    public componentWillReceiveProps(nextProps) {
        const { currency, withdrawDone } = this.props;

        if ((nextProps && (JSON.stringify(nextProps.currency) !== JSON.stringify(currency))) || (nextProps.withdrawDone && !withdrawDone)) {
            this.setState({
                amount: '',
                otpCode: '',
                total: '',
            });
        }
    }

    public render() {
        const {
            amount,
            beneficiary,
            total,
            withdrawAmountFocused,
            otpCode,
        } = this.state;
        const {
            blockchain_currencies,
            className,
            currency,
            type,
            twoFactorAuthRequired,
            withdrawAmountLabel,
            withdrawFeeLabel,
            withdrawTotalLabel,
            withdrawButtonLabel,
            fixed,
            price,
            name,
        } = this.props;

        const blockchainItem = blockchain_currencies.find(item => item.blockchain_key === beneficiary.blockchain_key);

        const cx = classnames('cr-withdraw', className);
        const lastDividerClassName = classnames('cr-withdraw__divider', {
            'cr-withdraw__divider-one': twoFactorAuthRequired,
            'cr-withdraw__divider-two': !twoFactorAuthRequired,
        });

        const withdrawAmountClass = classnames('cr-withdraw__group__amount', {
          'cr-withdraw__group__amount--focused': withdrawAmountFocused,
        });

        return (
            <React.Fragment>
                <h3 className="cr-withdraw-title">Withdrawal details</h3>
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
                        <div>
                            <div className="cr-withdraw__group__warning">
                                <OverlayTrigger
                                    placement="right"
                                    delay={{ show: 250, hide: 300 }}
                                    overlay={<Tooltip title="page.body.wallets.tabs.deposit.ccy.tip" />}>
                                    <div className="cr-withdraw__group__warning-tip">
                                        <TipIcon />
                                    </div>
                                </OverlayTrigger>
                                <span>
                                    Min withdraw:&nbsp;
                                    <span className="cr-withdraw__group__warning-currency">
                                        <Decimal fixed={fixed} thousSep=",">{blockchainItem?.min_withdraw_amount?.toString()}</Decimal>&nbsp;{currency.toUpperCase()}
                                    </span>
                                </span>
                            </div>
                            <div className="cr-withdraw__group__network">
                                <h5>Blockchain Network</h5>
                                <OverlayTrigger
                                    placement="right"
                                    delay={{ show: 250, hide: 300 }}
                                    overlay={<Tooltip title="page.body.wallets.tabs.deposit.ccy.tip" />}>
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
                                            <h3 className="cr-withdraw-blockchain-item__blockchain_key">{name} ({currency.toUpperCase()})</h3>
                                            <div className="cr-withdraw-blockchain-item__withdraw">{blockchainItem?.protocol?.toUpperCase()}</div>
                                        </div>
                                        <div className="cr-withdraw-blockchain-item-block">
                                            <div className="cr-withdraw-blockchain-item__fee"><span>Fee:&nbsp;</span><Decimal fixed={fixed} thousSep=",">{blockchainItem?.withdraw_fee?.toString()}</Decimal> {currency.toUpperCase()}</div>
                                            <div className="cr-withdraw-blockchain-item__estimated-value">≈{price} USDT</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="cr-withdraw__divider cr-withdraw__divider-one" />
                            <div className={withdrawAmountClass}>
                                <CustomInput
                                    type="number"
                                    label={withdrawAmountLabel || 'Withdrawal Amount'}
                                    defaultLabel="Withdrawal Amount"
                                    inputValue={amount}
                                    placeholder={withdrawAmountLabel || 'Amount'}
                                    classNameInput="cr-withdraw__input"
                                    handleChangeInput={this.handleChangeInputAmount}
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
                                    disabled={this.handleCheckButtonDisabled(total, beneficiary, otpCode)}
                                >
                                    {withdrawButtonLabel ? withdrawButtonLabel : 'Withdraw'}
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div>Limits</div>
                </div>
            </React.Fragment>
        );
    }

    private handleCheckButtonDisabled = (total: string, beneficiary: Beneficiary, otpCode: string) => {
        const isPending = beneficiary.state && beneficiary.state.toLowerCase() === 'pending';

        return Number(total) <= 0 || !Boolean(beneficiary.id) || isPending;
    };

    private renderFee = () => {
        const { blockchain_currencies, fixed, currency } = this.props;
        const { beneficiary } = this.state;

        const blockchainItem = blockchain_currencies.find(item => item.blockchain_key === beneficiary.blockchain_key);

        return (
            <span>
                <Decimal fixed={fixed} thousSep=",">{blockchainItem?.withdraw_fee?.toString()}</Decimal> {currency.toUpperCase()}
            </span>
        );
    };

    private renderTotal = () => {
        const total = this.state.total;
        const { fixed, currency } = this.props;

        return total ? (
            <span>
                <Decimal fixed={fixed} thousSep=",">{total.toString()}</Decimal> {currency.toUpperCase()}
            </span>
        ) : <span>0 {currency.toUpperCase()}</span>;
    };

    private handleClick = () => this.props.onClick(
        this.state.amount,
        this.state.total,
        this.state.beneficiary,
        this.state.otpCode,
        // this.props.fee.toString(),
        '0',
    );

    private handleFieldFocus = (field: string) => {
        switch (field) {
            case 'amount':
                this.setState(prev => ({
                    withdrawAmountFocused: !prev.withdrawAmountFocused,
                }));
                break;
            case 'code':
                this.setState(prev => ({
                    withdrawCodeFocused: !prev.withdrawCodeFocused,
                }));
                break;
            default:
                break;
        }
    };

    private handleChangeInputAmount = (value: string) => {
        const { beneficiary } = this.state;
        const { fixed, blockchain_currencies } = this.props;
        const convertedValue = cleanPositiveFloatInput(String(value));
        const blockchainItem = blockchain_currencies.find(item => item.blockchain_key === beneficiary.blockchain_key);

        if (convertedValue.match(precisionRegExp(fixed))) {
            const amount = (convertedValue !== '') ? Number(parseFloat(convertedValue).toFixed(fixed)) : '';
            const total = (amount !== '') ? (amount - +blockchainItem.withdraw_fee).toFixed(fixed) : '';

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

    private setTotal = (value: string) => {
        this.setState({ total: value });
    };

    private handleChangeBeneficiary = (value: Beneficiary) => {
        this.setState({
            beneficiary: value,
        });
    };

    private handleChangeInputOtpCode = (otpCode: string) => {
        this.setState({ otpCode });
    };
}
