import { BaseModal, ModalWrapper } from 'lib/modal';
import { NDecimal } from 'lib/ndecimal';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { format } from 'react-string-format';
import { ModalNames } from 'src/constants';
import { useLocalization } from 'src/hooks';
import { walletsWithdrawCcyFetch } from 'src/modules';

export interface WithdrawConfirmationModalOptions {
    amount: string;
    currency: string;
    rid: string;
    precision: number;
    otpCode: string;
    beneficiaryId: string;
}

interface Props {
    isMobileDevice?: boolean;
}

const ModalBody: React.FC<Props & WithdrawConfirmationModalOptions> = ({
    currency,
    rid,
    precision,
    amount,
    otpCode,
    beneficiaryId    
}) => {
    const dispatch = useDispatch();
    const getText = useLocalization();
    const handleOk = useCallback(() => {
        dispatch(
            walletsWithdrawCcyFetch({
                amount,
                currency: currency.toLowerCase(),
                otp: otpCode,
                beneficiary_id: beneficiaryId,
            })
        );
    }, []);

    return (
        <BaseModal
            name={ModalNames.WithdrawConfirmation}
            header={getText('page.body.wallets.tabs.withdraw.modal.confirmation')}
            okText={getText('page.body.wallets.tabs.withdraw.modal.button.withdraw')}
            cancelText={getText('page.body.wallets.tabs.withdraw.modal.button.cancel')}
            onOk={handleOk}>
            <p>
                {format(
                    '{0} {1} {2} {3}',
                    getText('page.body.wallets.tabs.withdraw.modal.message1'),
                    <NDecimal fixed={precision} showGroup={true} ending={currency}>
                        {amount}
                    </NDecimal>,
                    getText('page.body.wallets.tabs.withdraw.modal.message2'),
                    rid
                )}
            </p>
        </BaseModal>
    );
};

export const WithdrawConfirmationModal: React.FC<Props> = ({ isMobileDevice }) => {
    return (
        <ModalWrapper name={ModalNames.WithdrawConfirmation}>
            {(options: WithdrawConfirmationModalOptions) => {
                return <ModalBody {...options} isMobileDevice={isMobileDevice} />;
            }}
        </ModalWrapper>
    );
};
