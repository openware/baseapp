import * as React from 'react';
import { Button } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { ModalWithdrawSubmit, Withdraw } from '../../../containers';
import { useBeneficiariesFetch } from '../../../hooks';
import { selectCurrencies } from '../../../modules/public/currencies';
import { Beneficiary } from '../../../modules/user/beneficiaries';
import { selectUserInfo } from '../../../modules/user/profile';
import { selectWithdrawSuccess, walletsWithdrawCcyFetch } from '../../../modules/user/wallets';
import { ModalWithdrawConfirmation } from '../../components';

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

const WalletWithdrawBodyComponent = props => {
    const [withdrawSubmitModal, setWithdrawSubmitModal] = React.useState(false);
    const [withdrawData, setWithdrawData] = React.useState({
        amount: '',
        beneficiary: defaultBeneficiary,
        otpCode: '',
        withdrawConfirmModal: false,
        total: '',
        withdrawDone: false,
    });

    const intl = useIntl();
    const history = useHistory();
    const dispatch = useDispatch();
    const user = useSelector(selectUserInfo);
    const currencies = useSelector(selectCurrencies);
    const withdrawSuccess = useSelector(selectWithdrawSuccess);
    const { currency, type } = props.wallet;
    const fixed = (props.wallet || { fixed: 0 }).fixed;
    const withdrawAmountLabel = React.useMemo(() => intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.amount' }), [intl]);
    const withdraw2faLabel = React.useMemo(() => intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.code2fa' }), [intl]);
    const withdrawFeeLabel = React.useMemo(() => intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.fee' }), [intl]);
    const withdrawTotalLabel = React.useMemo(() => intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.total' }), [intl]);
    const withdrawButtonLabel = React.useMemo(() => intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.button' }), [intl]);
    const currencyItem = (currencies && currencies.find(item => item.id === currency));

    const isTwoFactorAuthRequired = (level: number, is2faEnabled: boolean) => {
        return level > 1 || (level === 1 && is2faEnabled);
    };

    const getConfirmationAddress = () => {
        let confirmationAddress = '';

        if (props.wallet) {
            confirmationAddress = props.wallet.type === 'fiat' ? (
                withdrawData.beneficiary.name
            ) : (
                withdrawData.beneficiary.data ? (withdrawData.beneficiary.data.address as string) : ''
            );
        }

        return confirmationAddress;
    };

    const toggleConfirmModal = (amount?: string, total?: string, beneficiary?: Beneficiary, otpCode?: string) => {
        setWithdrawData((state: any) => ({
            amount: amount || '',
            beneficiary: beneficiary || defaultBeneficiary,
            otpCode: otpCode || '',
            withdrawConfirmModal: !state.withdrawConfirmModal,
            total: total || '',
            withdrawDone: false,
        }));
    };

    const toggleSubmitModal = () => {
        setWithdrawSubmitModal(state => !state);
        setWithdrawData(state => ({ ...state, withdrawDone: true }));
    };

    const handleWithdraw = () => {
        const { otpCode, amount, beneficiary } = withdrawData;
        if (!props.wallet) {
            return;
        }

        const withdrawRequest = {
            amount,
            currency: currency.toLowerCase(),
            otp: otpCode,
            beneficiary_id: String(beneficiary.id),
        };
        dispatch(walletsWithdrawCcyFetch(withdrawRequest));
        toggleConfirmModal();
    };

    const renderOtpDisabled = () => {
        return (
            <div className="cr-mobile-wallet-withdraw__otp-disabled">
                <span className="cr-mobile-wallet-withdraw__otp-disabled__text">
                    {intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.enable2fa' })}
                </span>
                <Button
                    block={true}
                    onClick={() => history.push('/profile/2fa')}
                    size="lg"
                    variant="primary"
                >
                    {intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.enable2faButton'})}
                </Button>
            </div>
        );
    };

    useBeneficiariesFetch();

    React.useEffect(() => {
        if (withdrawSuccess) {
            toggleSubmitModal();
        }
    }, [withdrawSuccess]);

    if (!user.otp) {
        return renderOtpDisabled();
    }

    return (
        <div className="cr-mobile-wallet-withdraw-body">
            <Withdraw
                networks={currencyItem.networks}
                isMobileDevice
                price={currencyItem.price}
                name={currencyItem.name}
                type={type}
                fixed={fixed}
                currency={currency}
                onClick={toggleConfirmModal}
                withdrawAmountLabel={withdrawAmountLabel}
                withdraw2faLabel={withdraw2faLabel}
                withdrawFeeLabel={withdrawFeeLabel}
                withdrawTotalLabel={withdrawTotalLabel}
                withdrawDone={withdrawData.withdrawDone}
                withdrawButtonLabel={withdrawButtonLabel}
                twoFactorAuthRequired={isTwoFactorAuthRequired(user.level, user.otp)}
            />
            <div className="cr-mobile-wallet-withdraw-body__submit">
                <ModalWithdrawSubmit
                    isMobileDevice
                    show={withdrawSubmitModal}
                    currency={currency}
                    onSubmit={toggleSubmitModal}
                />
            </div>
            <div className="cr-mobile-wallet-withdraw-body__confirmation">
                <ModalWithdrawConfirmation
                    show={withdrawData.withdrawConfirmModal}
                    amount={withdrawData.total}
                    currency={currency}
                    precision={currencyItem ? currencyItem.precision : 0}
                    rid={getConfirmationAddress()}
                    onSubmit={handleWithdraw}
                    onDismiss={toggleConfirmModal}
                />
            </div>
        </div>
    );
};

const WalletWithdrawBody = React.memo(WalletWithdrawBodyComponent);

export {
    WalletWithdrawBody,
};
