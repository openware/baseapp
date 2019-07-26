// tslint:disable:jsx-no-lambda
import { Button, Decimal, Input } from '@openware/components';
import classnames from 'classnames';
import * as React from 'react';
import { CustomInput, SummaryField } from '../../components';

interface WithdrawProps {
    borderItem?: string;
    currency: string;
    fee: number;
    onClick: (amount: number, total: number, rid: string, otpCode: string) => void;
    fixed: number;
    className?: string;
    twoFactorAuthRequired?: boolean;
    withdrawAddressLabelPlaceholder?: string;
    withdrawAddressLabel?: string;
    withdrawAmountLabel?: string;
    withdraw2faLabel?: string;
    withdrawFeeLabel?: string;
    withdrawTotalLabel?: string;
    withdrawButtonLabel?: string;
    withdrawDone: boolean;
}

interface WithdrawState {
    address: string;
    amount: number | string;
    otpCode: string;
    withdrawAddressFocused: boolean;
    withdrawAmountFocused: boolean;
    withdrawCodeFocused: boolean;
    total: number;
}

class Withdraw extends React.Component<WithdrawProps, WithdrawState> {
    public state = {
        address: '',
        amount: '',
        otpCode: '',
        withdrawAddressFocused: false,
        withdrawAmountFocused: false,
        withdrawCodeFocused: false,
        total: 0,
    };

    public componentWillReceiveProps(nextProps) {
        if (this.props.currency !== nextProps.currency || nextProps.withdrawDone) {
            this.setState({ address: '', amount: '', otpCode: '', total: 0 });
        }
    }

    public render() {
        const {
            address,
            amount,
            total,
            withdrawAddressFocused,
            withdrawAmountFocused,
            otpCode,
        } = this.state;
        const {
            borderItem,
            className,
            twoFactorAuthRequired,
            withdrawAddressLabelPlaceholder,
            withdrawAddressLabel,
            withdrawAmountLabel,
            withdrawFeeLabel,
            withdrawTotalLabel,
            withdrawButtonLabel,
        } = this.props;

        const cx = classnames('cr-withdraw', className);
        const lastDividerClassName = classnames('cr-withdraw__divider', {
            'cr-withdraw__divider-one': twoFactorAuthRequired,
            'cr-withdraw__divider-two': !twoFactorAuthRequired,
        });

        const withdrawAddressClass = classnames('cr-withdraw__group__address', {
          'cr-withdraw__group__address--focused': withdrawAddressFocused,
        });

        const withdrawAmountClass = classnames('cr-withdraw__group__amount', {
          'cr-withdraw__group__amount--focused': withdrawAmountFocused,
        });

        return (
            <div className={cx}>
                <div className="cr-withdraw-column">
                    <div className={withdrawAddressClass}>
                        <CustomInput
                            type="text"
                            label={withdrawAddressLabel || 'Withdrawal Addres'}
                            placeholder={withdrawAddressLabelPlaceholder || 'Withdrawal Addres'}
                            defaultLabel="Withdrawal Addres"
                            handleChangeInput={this.handleChangeInputAddress}
                            inputValue={address}
                            handleFocusInput={() => this.handleFieldFocus('address')}
                            classNameLabel="cr-withdraw__label"
                            classNameInput="cr-withdraw__input"
                            autoFocus={false}
                        />
                    </div>
                    <div className="cr-withdraw__divider cr-withdraw__divider-one" />
                    <div className={withdrawAmountClass}>
                        <label className="cr-withdraw__label">
                            {(Number(amount) !== 0 && amount) && (withdrawAmountLabel || 'Withdrawal Amount')}
                        </label>
                        <Input
                            type="number"
                            value={amount}
                            placeholder={withdrawAmountLabel || 'Amount'}
                            className="cr-withdraw__input"
                            onFocus={() => this.handleFieldFocus('amount')}
                            onBlur={() => this.handleFieldFocus('amount')}
                            onChangeValue={this.handleChangeInputAmount}
                        />
                    </div>
                    <div className={lastDividerClassName} />
                    {twoFactorAuthRequired && this.renderOtpCodeInput()}
                </div>
                <div className="cr-withdraw-column">
                    <div>
                        <SummaryField
                            className="cr-withdraw__summary-field"
                            message={withdrawFeeLabel ? withdrawFeeLabel : 'Fee'}
                            content={this.renderFee()}
                            borderItem={borderItem}
                        />
                        <SummaryField
                            className="cr-withdraw__summary-field"
                            message={withdrawTotalLabel ? withdrawTotalLabel : 'Total Withdraw Amount'}
                            content={this.renderTotal()}
                            borderItem={borderItem}
                        />
                    </div>
                    <div className="cr-withdraw__deep">
                        <Button
                            className="cr-withdraw__button"
                            label={withdrawButtonLabel ? withdrawButtonLabel : 'WITHDRAW'}
                            onClick={this.handleClick}
                            disabled={Number(total) <= 0 || !Boolean(address) || !Boolean(otpCode)}
                        />
                    </div>
                </div>
            </div>
        );
    }

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
        parseFloat(this.state.amount),
        this.state.total,
        this.state.address,
        this.state.otpCode,
    );

    private handleFieldFocus = (field: string) => {
        switch (field) {
            case 'amount':
                this.setState(prev => ({
                    withdrawAmountFocused: !prev.withdrawAmountFocused,
                }));
                break;
            case 'address':
                this.setState(prev => ({
                    withdrawAddressFocused: !prev.withdrawAddressFocused,
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

    private handleChangeInputAmount = (text: string) => {
        const { fixed } = this.props;
        const value = (text !== '') ? Number(parseFloat(text).toFixed(fixed)) : '';
        const total = (value !== '') ? value - this.props.fee : 0;
        if (total < 0) {
            this.setTotal(0);
        } else {
            this.setTotal(total);
        }
        this.setState({ amount: value });
    };

    private setTotal = (value: number) => {
        this.setState({ total: value });
    };

    private handleChangeInputAddress = (text: string) => {
        this.setState({ address: text });
    };

    private handleChangeInputOtpCode = (otpCode: string) => {
        this.setState({ otpCode });
    };
}

export {
    Withdraw,
    WithdrawProps,
    WithdrawState,
};
