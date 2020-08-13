import classnames from 'classnames';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import {
    Beneficiaries,
    CustomInput,
    SummaryField,
} from '../../components';
import { Decimal } from '../../components/Decimal';
import { cleanPositiveFloatInput, precisionRegExp } from '../../helpers';
import { Beneficiary } from '../../modules';

export interface WithdrawProps {
    currency: string;
    fee: number;
    onClick: (amount: string, total: string, beneficiary: Beneficiary, otpCode: string) => void;
    fixed: number;
    className?: string;
    type: 'fiat' | 'coin';
    twoFactorAuthRequired?: boolean;
    withdrawAmountLabel?: string;
    withdraw2faLabel?: string;
    withdrawFeeLabel?: string;
    withdrawTotalLabel?: string;
    withdrawButtonLabel?: string;
    withdrawDone: boolean;
    isMobile?: boolean;
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
            className,
            currency,
            type,
            twoFactorAuthRequired,
            withdrawAmountLabel,
            withdrawFeeLabel,
            withdrawTotalLabel,
            withdrawButtonLabel,
            isMobile,
        } = this.props;

        const cx = classnames('cr-withdraw', className);
        const lastDividerClassName = classnames('cr-withdraw__divider', {
            'cr-withdraw__divider-one': twoFactorAuthRequired,
            'cr-withdraw__divider-two': !twoFactorAuthRequired,
        });

        const withdrawAmountClass = classnames('cr-withdraw__group__amount', {
          'cr-withdraw__group__amount--focused': withdrawAmountFocused,
        });

        return (
            <div className={cx}>
                <div className="cr-withdraw-column">
                    <div className="cr-withdraw__group__address">
                        <Beneficiaries
                            currency={currency}
                            type={type}
                            onChangeValue={this.handleChangeBeneficiary}
                        />
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
                    {!isMobile && twoFactorAuthRequired && this.renderOtpCodeInput()}
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
                    {isMobile && twoFactorAuthRequired && this.renderOtpCodeInput()}
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
        );
    }

    private handleCheckButtonDisabled = (total: string, beneficiary: Beneficiary, otpCode: string) => {
        const isPending = beneficiary.state && beneficiary.state.toLowerCase() === 'pending';

        return Number(total) <= 0 || !Boolean(beneficiary.id) || isPending || !Boolean(otpCode);
    };

    private renderFee = () => {
        const { fee, fixed, currency } = this.props;

        return (
            <span>
                <Decimal fixed={fixed}>{fee.toString()}</Decimal> {currency.toUpperCase()}
            </span>
        );
    };

    private renderTotal = () => {
        const total = this.state.total;
        const { fixed, currency } = this.props;

        return total ? (
            <span>
                <Decimal fixed={fixed}>{total.toString()}</Decimal> {currency.toUpperCase()}
            </span>
        ) : <span>0 {currency.toUpperCase()}</span>;
    };

    private renderOtpCodeInput = () => {
        const { otpCode, withdrawCodeFocused } = this.state;
        const { withdraw2faLabel } = this.props;
        const withdrawCodeClass = classnames('cr-withdraw__group__code', {
          'cr-withdraw__group__code--focused': withdrawCodeFocused,
        });

        return (
            <React.Fragment>
              <div className={withdrawCodeClass}>
                  <CustomInput
                      type="number"
                      label={withdraw2faLabel || '2FA code'}
                      placeholder={withdraw2faLabel || '2FA code'}
                      defaultLabel="2FA code"
                      handleChangeInput={this.handleChangeInputOtpCode}
                      inputValue={otpCode}
                      handleFocusInput={() => this.handleFieldFocus('code')}
                      classNameLabel="cr-withdraw__label"
                      classNameInput="cr-withdraw__input"
                      autoFocus={false}
                  />
              </div>
              <div className="cr-withdraw__divider cr-withdraw__divider-two" />
            </React.Fragment>
        );
    };

    private handleClick = () => this.props.onClick(
        this.state.amount,
        this.state.total,
        this.state.beneficiary,
        this.state.otpCode,
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
        const { fixed } = this.props;
        const convertedValue = cleanPositiveFloatInput(String(value));

        if (convertedValue.match(precisionRegExp(fixed))) {
            const amount = (convertedValue !== '') ? Number(parseFloat(convertedValue).toFixed(fixed)) : '';
            const total = (amount !== '') ? (amount - this.props.fee).toFixed(fixed) : '';

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
