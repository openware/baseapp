// tslint:disable:jsx-no-lambda
import { Button, Decimal, Input } from '@openware/components';
import classnames from 'classnames';
import * as React from 'react';
import { CustomInput, SummaryField } from '../../components';

interface WithdrawLiteProps {
    openModal: () => void;
}

class WithdrawLite extends React.Component<WithdrawLiteProps> {
    public render() {
        const lastDividerClassName = classnames('cr-withdraw__divider', {
            'cr-withdraw__divider-one': true,
            'cr-withdraw__divider-two': false,
        });

        const withdrawAddressClass = classnames('cr-withdraw__group__address', {
            'cr-withdraw__group__address--focused': false,
        });

        const withdrawAmountClass = classnames('cr-withdraw__group__amount', {
            'cr-withdraw__group__amount--focused': false,
        });

        return (
            <div className={'cr-withdraw'}>
                <div className="cr-withdraw-column">
                    <div className={withdrawAddressClass}>
                        <CustomInput
                            type="email"
                            label={'Withdrawal Addres'}
                            placeholder={'Withdrawal Addres'}
                            defaultLabel="Withdrawal Addres"
                            handleChangeInput={this.handleChangeInputAddress}
                            inputValue={''}
                            handleFocusInput={this.handleFieldFocus}
                            classNameLabel="cr-withdraw__label"
                            classNameInput="cr-withdraw__input"
                        />
                    </div>
                    <div className="cr-withdraw__divider cr-withdraw__divider-one" />
                    <div className={withdrawAmountClass}>
                        <label className="cr-withdraw__label">Withdrawal Amount</label>
                        <Input
                            type="number"
                            value={0}
                            placeholder={'Amount'}
                            className="cr-withdraw__input"
                            onFocus={this.handleFieldFocus}
                            onChangeValue={this.handleChangeInputAmount}
                        />
                    </div>
                    <div className={lastDividerClassName} />
                    {this.renderOtpCodeInput()}
                </div>
                <div className="cr-withdraw-column">
                    <div>
                        <SummaryField
                            className="cr-withdraw__summary-field"
                            message={'Fee'}
                            content={this.renderFee()}
                            borderItem={'empty-circle'}
                        />
                        <SummaryField
                            className="cr-withdraw__summary-field"
                            message={'Total Withdraw Amount'}
                            content={this.renderTotal()}
                            borderItem={'empty-circle'}
                        />
                    </div>
                    <div className="cr-withdraw__deep">
                        <Button
                            className="cr-withdraw__button"
                            label={'WITHDRAW'}
                            onClick={this.handleClick}
                        />
                    </div>
                </div>
            </div>
        );
    }

    private renderFee = () => <span><Decimal fixed={0}>{0}</Decimal> ETH</span>;

    private renderTotal = () => <span>0 ETH</span>;

    private renderOtpCodeInput = () => {
        const withdrawCodeClass = classnames('cr-withdraw__group__code', {
            'cr-withdraw__group__code--focused': false,
        });
        return (
            <React.Fragment>
                <div className={withdrawCodeClass}>
                    <CustomInput
                        type="number"
                        label={'2FA code'}
                        placeholder={'2FA code'}
                        defaultLabel="2FA code"
                        handleChangeInput={this.handleChangeInputOtpCode}
                        inputValue={''}
                        handleFocusInput={() => this.handleFieldFocus()}
                        classNameLabel="cr-withdraw__label"
                        classNameInput="cr-withdraw__input"
                        autoFocus={false}
                    />
                </div>
                <div className="cr-withdraw__divider cr-withdraw__divider-two" />
            </React.Fragment>
        );
    };

    private handleClick = () => this.props.openModal();

    private handleFieldFocus = () => this.props.openModal();

    private handleChangeInputAmount = () => this.props.openModal();

    private handleChangeInputAddress = () => this.props.openModal();

    private handleChangeInputOtpCode = () => this.props.openModal();
}

export {
    WithdrawLite,
};
