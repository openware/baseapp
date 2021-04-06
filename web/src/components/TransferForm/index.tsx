import cr from 'classnames';
import * as React from 'react';
import { FC, useCallback, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { DEFAULT_CCY_PRECISION } from 'src/constants';
import { cleanPositiveFloatInput, precisionRegExp } from 'src/helpers';
import { CustomInput, Decimal, PercentageButton } from '..';
import { Wallet } from '../../modules';

interface ParentProps {
    wallet?: Wallet;
    handleSubmit: (currency: string, amount: string) => void;
}

type Props = ParentProps;

/**
 * Component for displaying transfer for Wallets Transfers tab
 */
export const TransferForm: FC<Props> = (props: Props) => {
    const [amount, setAmount] = useState<string>('');
    const [isFocused, setIsFocused] = useState<boolean>(false); 
    const [showError, setShowError] = useState<boolean>(false);
    const [amountError, setAmountError] = useState<string>('');

    const { wallet } = props;

    const intl = useIntl();
    const amountPercentageArray = [0.25, 0.5, 0.75, 1];

    const handleAmountChange = useCallback((value: string) => {
        const convertedValue = cleanPositiveFloatInput(String(value));

        if (convertedValue.match(precisionRegExp(wallet?.fixed || DEFAULT_CCY_PRECISION))) {
            setAmount(convertedValue);
        }

        defineAmountError(convertedValue);
    }, [wallet]);

    const handleChangeAmountByButton = useCallback((value: number) => {
        const newAmount = wallet?.balance ? (
            Decimal.format(+wallet.balance * value, wallet.fixed || DEFAULT_CCY_PRECISION)
        ) : '';
        setAmount(newAmount);
        defineAmountError(newAmount);
    }, [wallet]);

    const fieldsetFocusedClass = React.useCallback((error: string) => cr('cr-transfer-form__input--fieldset', {
        'cr-transfer-form__input--fieldset cr-transfer-form__input--fieldset--focused': isFocused,
        'cr-transfer-form__input--errored': showError && error,
    }), [isFocused, showError]);

    const defineAmountError = React.useCallback((value: string) => {
        let error = '';
    
        if (!value) {
            error = intl.formatMessage({ id: 'page.body.p2p.error.empty.amount' });
        } else if (Number(value) <= 0) {
            error = intl.formatMessage({ id: 'page.body.p2p.error.greater.than.0.amount' });
        } else if (wallet && (Number(value) > Number(wallet.balance))) {
            error = intl.formatMessage({ id: 'page.body.p2p.error.insufficient.funds' });
        }

        setAmountError(error);
    }, [intl, wallet]);

    const handleOnClick = React.useCallback(() => {
        if (!amount || Number(amount) <= 0 || Number(amount) > Number(wallet.balance)) {
            setShowError(true);
            defineAmountError(amount);
        } else {
            props.handleSubmit(wallet.currency, amount);
            setAmount('');
        }
    }, [wallet, props.handleSubmit, amount]);

    return (
        <div className="cr-transfer-form">
            <fieldset className={fieldsetFocusedClass(amountError)}>
                <CustomInput
                    type="number"
                    inputValue={amount}
                    handleChangeInput={handleAmountChange}
                    placeholder=""
                    label={intl.formatMessage({ id: 'page.body.wallets.transfers.form.amount' })}
                    labelVisible={true}
                    defaultLabel={intl.formatMessage({ id: 'page.body.wallets.transfers.form.amount' })}
                    handleFocusInput={() => setIsFocused(!isFocused)}
                />
            </fieldset>
            {showError && <span className="error">{amountError}</span>}
            <div className="cr-transfer-form__percentage-buttons">
                {
                    amountPercentageArray.map((value, index) => <PercentageButton
                        value={value}
                        key={index}
                        onClick={handleChangeAmountByButton}
                    />)
                }
            </div>
            <div className="cr-transfer-form__total">
                <label className="cr-transfer-form__total__label">
                    {intl.formatMessage({ id: 'page.body.wallets.transfers.form.total' })}
                </label>
                <div className="cr-transfer-form__total__content">
                    <span className="cr-transfer-form__total__content__amount">
                        {Decimal.format(amount, wallet?.fixed || DEFAULT_CCY_PRECISION, ',')}&nbsp;
                    </span>
                    <span className="cr-transfer-form__total__content__currency">
                        {wallet?.currency?.toUpperCase()}
                    </span>
                </div>
            </div>
            <div className="cr-transfer-form__available">
                <label className="cr-transfer-form__available__label">
                    {intl.formatMessage({ id: 'page.body.wallets.transfers.form.available' })}
                </label>
                <div className="cr-transfer-form__available__content">
                    <span className="cr-transfer-form__available__content__amount">
                        {wallet ? Decimal.format(wallet.balance, wallet.fixed, ',') : ''}&nbsp;
                    </span>
                    <span className="cr-transfer-form__available__content__currency">
                        {wallet?.currency?.toUpperCase()}
                    </span>
                </div>
            </div>
            <div className="cr-transfer-form__btn-wrapper">
                <Button
                    block={true}
                    className="btn-block mr-1 mt-1 btn-lg"
                    disabled={!wallet}
                    onClick={handleOnClick}
                    size="lg"
                    variant="primary"
                >
                    {intl.formatMessage({ id: 'page.body.wallets.transfers.form.confirm' })}
                </Button>
            </div>
        </div>
    );
};
