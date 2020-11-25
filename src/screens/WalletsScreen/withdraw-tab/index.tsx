import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocalization, useReduxSelector } from 'src/hooks';
import { Beneficiary, selectUserInfo, selectWithdrawSuccess, Wallet } from 'src/modules';
import { useDispatch } from 'react-redux';
import { Withdraw } from 'src/containers';
import { Button } from 'react-bootstrap';
import { useHistory } from 'react-router';
import { generalShowDialog } from 'src/modules/general';
import { ModalNames } from 'src/constants';
import { WithdrawConfirmationModal, WithdrawConfirmationModalOptions } from '../modals/confirmation';
import { WithdrawSubmitModal } from '../modals/sibmit';

interface Props {
    wallet: Wallet;
}

export const WalletWithdrawTab: React.FC<Props> = ({ wallet }) => {
    const dispatch = useDispatch();
    const getText = useLocalization();
    const user = useReduxSelector(selectUserInfo);
    const history = useHistory();

    const { level, otp } = user;

    const { currency, fee, type } = wallet;
    const fixed = (wallet || { fixed: 0 }).fixed;

    const redirectToEnable2fa = useCallback(() => history.push('/security/2fa', { enable2fa: true }), []);

    const withdrawSuccess = useReduxSelector(selectWithdrawSuccess);

    const handleConfirm = useCallback(
        (amount?: string, total?: string, beneficiary?: Beneficiary, otpCode?: string) => {            
            const confirmationAddress = wallet.type === 'fiat' ? beneficiary.name : beneficiary.data?.address;
            const options: WithdrawConfirmationModalOptions = {
                amount: total,
                currency: wallet.currency,
                otpCode: otpCode,
                beneficiaryId: String(beneficiary.id),
                rid: confirmationAddress,
                precision: wallet.fixed,
            };

            dispatch(generalShowDialog(ModalNames.WithdrawConfirmation, options));

            // setAmount(amount || '');
            // setBeneficiary(beneficiary ? beneficiary : defaultBeneficiary);
            // setOtpCode(otpCode ? otpCode : '');
            // setWithdrawConfirmModal(!withdrawConfirmModal);
            // setTotal(total || '');
            // setWithdrawDone(false);
        },
        [wallet]
    );

    const isTwoFactorAuthRequired = useMemo(() => {
        return level > 1 || (level === 1 && otp);
    }, [level, otp]);

    return otp ? (
        <>
            <Withdraw
                withdrawDone={withdrawSuccess}
                currency={currency}
                fee={fee}
                onClick={handleConfirm}
                twoFactorAuthRequired={isTwoFactorAuthRequired}
                fixed={fixed}
                type={type}
                withdrawAmountLabel={getText('page.body.wallets.tabs.withdraw.content.amount')}
                withdraw2faLabel={getText('page.body.wallets.tabs.withdraw.content.code2fa')}
                withdrawFeeLabel={getText('page.body.wallets.tabs.withdraw.content.fee')}
                withdrawTotalLabel={getText('page.body.wallets.tabs.withdraw.content.total')}
                withdrawButtonLabel={getText('page.body.wallets.tabs.withdraw.content.button')}
            />
            <WithdrawConfirmationModal />
            <WithdrawSubmitModal />
        </>
    ) : (
        <React.Fragment>
            <p className="pg-wallet__enable-2fa-message">
                {getText('page.body.wallets.tabs.withdraw.content.enable2fa')}
            </p>
            <Button block={true} onClick={redirectToEnable2fa} size="lg" variant="primary">
                {getText('page.body.wallets.tabs.withdraw.content.enable2faButton')}
            </Button>
        </React.Fragment>
    );
};
