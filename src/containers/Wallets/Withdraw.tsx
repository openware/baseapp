import { Button, Decimal, Input, SummaryField } from '@openware/components';
import classnames from 'classnames';
import * as React from 'react';

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
    total: number;
}

class Withdraw extends React.Component<WithdrawProps, WithdrawState> {
    public state = {
        address: '',
        amount: '',
        otpCode: '',
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
            otpCode,
        } = this.state;
        const {
            borderItem,
            className,
            currency,
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

        const formattedCurrency = currency.toUpperCase();
        return (
            <div className={cx}>
                <div className="cr-withdraw-column">
                    <form>
                        <fieldset className="cr-withdraw__input">
                            <legend>
                                {formattedCurrency} {withdrawAddressLabel ? withdrawAddressLabel : 'Withdrawal Address'}
                            </legend>
                            <Input
                                className="cr-input-block__input"
                                type="text"
                                placeholder={withdrawAddressLabelPlaceholder ? withdrawAddressLabelPlaceholder : 'Address'}
                                value={address}
                                onChangeValue={this.handleChangeInputAddress}
                            />
                        </fieldset>
                    </form>
                    <div className="cr-withdraw__divider cr-withdraw__divider-one" />
                    <form>
                        <fieldset className="cr-withdraw__input">
                            <legend>
                                {withdrawAmountLabel ? withdrawAmountLabel : 'Withdrawal Amount'}
                            </legend>
                            <Input
                                className="cr-input-block__input"
                                type="number"
                                placeholder="0"
                                value={amount}
                                onChangeValue={this.handleChangeInputAmount}
                            />
                        </fieldset>
                    </form>
                    <div className={lastDividerClassName} />
                    {twoFactorAuthRequired && this.renderOtpCodeInput()}
                </div>
                <div className="cr-withdraw-column">
                    <div>
                        <SummaryField
                            className="cr-withdraw__summary-field "
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
        const { otpCode } = this.state;
        const { withdraw2faLabel } = this.props;
        return (
            <React.Fragment>
                <form>
                    <fieldset className="cr-withdraw__input">
                        <legend>
                            {withdraw2faLabel ? withdraw2faLabel : '6-digit GAuthenticator Code'}
                        </legend>
                        <Input
                            type="text"
                            className="cr-input-block__input"
                            placeholder="XXXXXX"
                            value={otpCode}
                            onChangeValue={this.handleChangeInputOtpCode}
                        />
                    </fieldset>
                </form>
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

    private handleChangeInputAmount = (text: string) => {
        const { fixed } = this.props;
        const value: number = Number(parseFloat(text).toFixed(fixed));
        const total: number = value - this.props.fee;
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
