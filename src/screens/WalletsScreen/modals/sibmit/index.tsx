import { BaseModal, ModalWrapper } from 'lib/modal';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { ModalNames } from 'src/constants';
import { useLocalization } from 'src/hooks';
import { generalShowDialog } from 'src/modules/general';

interface Props {
    isMobileDevice?: boolean;
}

export const WithdrawSubmitModal: React.FC<Props> = ({ isMobileDevice }) => {
    const dispatch = useDispatch();
    const getText = useLocalization();
    const handleOk = useCallback(() => {
        dispatch(generalShowDialog(ModalNames.WithdrawSubmit, undefined));
    }, []);

    return (
        <ModalWrapper name={ModalNames.WithdrawSubmit}>
            {() => {
                return (
                    <BaseModal
                        name={ModalNames.WithdrawSubmit}
                        header={getText('page.modal.withdraw.success')}
                        hideCancel={true}
                        okText={getText('page.modal.withdraw.success.button')}
                        onOk={handleOk}>
                        {getText('page.modal.withdraw.success.message.content')}
                    </BaseModal>
                );
            }}
        </ModalWrapper>
    );
};
