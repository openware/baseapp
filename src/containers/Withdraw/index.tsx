import classnames from 'classnames';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from 'react-bootstrap';

import { Beneficiaries, CustomInput, SummaryField } from '../../components';
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
    isMobileDevice?: boolean;
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

export const Withdraw: React.FC<WithdrawProps> = ({
    className,
    currency,
    fee,
    fixed,
    type,
    twoFactorAuthRequired,
    withdrawAmountLabel,
    withdrawFeeLabel,
    withdrawTotalLabel,
    withdrawButtonLabel,
    isMobileDevice,
    withdrawDone,
    withdraw2faLabel,
    onClick,
}) => {
    const [amount, setAmount] = useState('');
    const [beneficiary, setBeneficiary] = useState(defaultBeneficiary);
    const [otpCode, setOptCode] = useState('');
    const [withdrawAmountFocused, setWithdrawAmountFocused] = useState(false);
    const [withdrawCodeFocused, setWithdrawCodeFocused] = useState(false);
    const [total, setTotal] = useState('');

    useEffect(() => {
        setAmount('');
        setOptCode('');
        setTotal('');
    }, [currency]);

    useEffect(() => {
        if (!withdrawDone) {
            setAmount('');
            setOptCode('');
            setTotal('');
        }
    }, [withdrawDone]);

    const checkButtonDisabled = useMemo(() => {
        const isPending = beneficiary.state && beneficiary.state.toLowerCase() === 'pending';
        return Number(total) <= 0 || !Boolean(beneficiary.id) || isPending || !Boolean(otpCode);
    }, [total, beneficiary, otpCode]);

    const feeContent = useMemo(() => {
        return (
            <Decimal fixed={fixed} thousSep="," end={currency.toUpperCase()}>
                {fee}
            </Decimal>
        );
    }, [fee, fixed, currency]);

    const renderTotal = useMemo(() => {
        return (
            <Decimal fixed={fixed} thousSep="," end={currency.toUpperCase()}>
                {total || 0}
            </Decimal>
        );
    }, [fixed, currency, total]);

    const handleChangeInputOtpCode = useCallback((otpCode: string) => {
        setOptCode(otpCode);
    }, []);

    const handleChangeBeneficiary = useCallback((value: Beneficiary) => {
        setBeneficiary(value);
    }, []);

    const handleChangeInputAmount = useCallback(
        (value: string) => {
            const convertedValue = cleanPositiveFloatInput(String(value));

            if (convertedValue.match(precisionRegExp(fixed))) {
                const amount = convertedValue !== '' ? Number(parseFloat(convertedValue).toFixed(fixed)) : '';
                const total = amount !== '' ? (amount - fee).toFixed(fixed) : '';
                setTotal(Number(total) <= 0 ? (0).toFixed(fixed) : total);
                setAmount(convertedValue);
            }
        },
        [fixed, fee]
    );

    const handleFieldFocus = useCallback((field: string) => {
        switch (field) {
            case 'amount':
                setWithdrawAmountFocused(!withdrawAmountFocused);
                break;
            case 'code':
                setWithdrawCodeFocused(!withdrawCodeFocused);
                break;
            default:
                break;
        }
    }, []);

    const handleClick = useCallback(() => {
        onClick(amount, total, beneficiary, otpCode);
    }, [amount, total, beneficiary, setOptCode]);

    const otpCodeInput = useMemo(() => {
        return (
            twoFactorAuthRequired && (
                <>
                    <div
                        className={classnames('cr-withdraw__group__code', {
                            'cr-withdraw__group__code--focused': withdrawCodeFocused,
                        })}>
                        <CustomInput
                            type="number"
                            label={withdraw2faLabel || '2FA code'}
                            placeholder={withdraw2faLabel || '2FA code'}
                            defaultLabel="2FA code"
                            handleChangeInput={handleChangeInputOtpCode}
                            inputValue={otpCode}
                            handleFocusInput={() => handleFieldFocus('code')}
                            classNameLabel="cr-withdraw__label"
                            classNameInput="cr-withdraw__input"
                            autoFocus={false}
                        />
                    </div>
                    <div className="cr-withdraw__divider cr-withdraw__divider-two" />
                </>
            )
        );
    }, [twoFactorAuthRequired, withdraw2faLabel, withdrawCodeFocused, otpCode]);

    return (
        <div className={classnames('cr-withdraw', className)}>
            <div className="cr-withdraw-column">
                <div className="cr-withdraw__group__address">
                    <Beneficiaries currency={currency} type={type} onChangeValue={handleChangeBeneficiary} />
                </div>
                <div className="cr-withdraw__divider cr-withdraw__divider-one" />
                <div
                    className={classnames('cr-withdraw__group__amount', {
                        'cr-withdraw__group__amount--focused': withdrawAmountFocused,
                    })}>
                    <CustomInput
                        type="number"
                        label={withdrawAmountLabel || 'Withdrawal Amount'}
                        defaultLabel="Withdrawal Amount"
                        inputValue={amount}
                        placeholder={withdrawAmountLabel || 'Amount'}
                        classNameInput="cr-withdraw__input"
                        handleChangeInput={handleChangeInputAmount}
                    />
                </div>
                <div
                    className={classnames('cr-withdraw__divider', {
                        'cr-withdraw__divider-one': twoFactorAuthRequired,
                        'cr-withdraw__divider-two': !twoFactorAuthRequired,
                    })}
                />
                {!isMobileDevice && otpCodeInput}
            </div>
            <div className="cr-withdraw-column">
                <div>
                    <SummaryField
                        className="cr-withdraw__summary-field"
                        message={withdrawFeeLabel ? withdrawFeeLabel : 'Fee'}
                        content={feeContent}
                    />
                    <SummaryField
                        className="cr-withdraw__summary-field"
                        message={withdrawTotalLabel ? withdrawTotalLabel : 'Total Withdraw Amount'}
                        content={renderTotal}
                    />
                </div>
                {isMobileDevice && otpCodeInput}
                <div className="cr-withdraw__deep">
                    <Button variant="primary" size="lg" onClick={handleClick} disabled={checkButtonDisabled}>
                        {withdrawButtonLabel ? withdrawButtonLabel : 'Withdraw'}
                    </Button>
                </div>
            </div>
        </div>
    );
};
