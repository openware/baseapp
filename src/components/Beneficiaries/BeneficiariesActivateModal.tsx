import classnames from 'classnames';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector} from 'react-redux';
import { LetterIcon } from '../../assets/images/LetterIcon';
import { Modal } from '../../mobile/components/Modal';
import {
    beneficiariesActivate,
    Beneficiary,
    selectBeneficiariesActivateError,
    selectBeneficiariesActivateSuccess,
    selectMobileDeviceState,
} from '../../modules';
import { CustomInput } from '../CustomInput';


interface Props {
    beneficiariesAddData: Beneficiary;
    handleToggleConfirmationModal: () => void;
}

export const BeneficiariesActivateModal: React.FC<Props> = (props: Props) => {
    const [confirmationModalCode, setConfirmationModalCode] = React.useState('');

    const beneficiariesActivateError = useSelector(selectBeneficiariesActivateError);
    const beneficiariesActivateSuccess = useSelector(selectBeneficiariesActivateSuccess);
    const isMobileDevice = useSelector(selectMobileDeviceState);

    const dispatch = useDispatch();
    const { formatMessage } = useIntl();
    const { handleToggleConfirmationModal, beneficiariesAddData } = props;

    const handleSubmitConfirmationModal = React.useCallback(() => {
        if (beneficiariesAddData) {
            const payload = {
                pin: confirmationModalCode,
                id: beneficiariesAddData.id,
            };

            dispatch(beneficiariesActivate(payload));
        }
    }, [confirmationModalCode, dispatch, beneficiariesAddData]);

    const renderConfirmationModalBodyItem = React.useCallback((field: string, optional?: boolean) => {
        const focusedClass = classnames('cr-email-form__group', {
            'cr-email-form__group--optional': optional,
        });

        return (
            <div key={field} className={focusedClass}>
                <CustomInput
                    type="text"
                    label={formatMessage({ id: `page.body.wallets.beneficiaries.confirmationModal.body.${field}` })}
                    placeholder={formatMessage({ id: `page.body.wallets.beneficiaries.confirmationModal.body.${field}`})}
                    defaultLabel={field}
                    handleChangeInput={setConfirmationModalCode}
                    inputValue={confirmationModalCode}
                    classNameLabel="cr-email-form__label"
                    classNameInput="cr-email-form__input"
                    autoFocus={true}
                />
            </div>
        );
    }, [confirmationModalCode, formatMessage]);

    const renderConfirmationModalBody = React.useCallback(() => {
        const isDisabled = !confirmationModalCode;

        return (
            <div className="cr-email-form__form-content">
                <div className="confirmation-modal__content">
                    <LetterIcon className="confirmation-modal__content__icon" />
                    <span className="confirmation-modal__content__text">{formatMessage({ id: 'page.body.wallets.beneficiaries.confirmationModal.body.text' })}</span>
                </div>
                {renderConfirmationModalBodyItem('confirmationModalCode')}
                <div className="cr-email-form__button-wrapper">
                    <Button
                        disabled={isDisabled}
                        onClick={handleSubmitConfirmationModal}
                        size="lg"
                        variant="primary"
                    >
                        {formatMessage({ id: 'page.body.wallets.beneficiaries.confirmationModal.body.button' })}
                    </Button>
                </div>
            </div>
        );
    }, [confirmationModalCode, formatMessage, handleSubmitConfirmationModal, renderConfirmationModalBodyItem]);

    const handleClickToggleConfirmationModal = React.useCallback((clear?: boolean) => () => {
        handleToggleConfirmationModal();

        if (clear) {
            setConfirmationModalCode('');
        }
    }, [handleToggleConfirmationModal]);

    const renderConfirmationModalHeader = React.useCallback(() => {
        return (
            <div className="cr-email-form__options-group">
                <div className="cr-email-form__option">
                    <div className="cr-email-form__option-inner">
                        {formatMessage({ id: 'page.body.wallets.beneficiaries.confirmationModal.header' })}
                        <span
                            className="pg-profile-page__close pg-profile-page__pull-right"
                            onClick={handleClickToggleConfirmationModal(true)}
                        />
                    </div>
                </div>
            </div>
        );
    }, [formatMessage, handleClickToggleConfirmationModal]);

    const renderContent = React.useCallback(() => {
        const className = classnames('beneficiaries-confirmation-modal', {
            'cr-modal': !isMobileDevice,
        });

        return (
            <div className={className}>
                <div className="cr-email-form">
                    {renderConfirmationModalHeader()}
                    {renderConfirmationModalBody()}
                </div>
            </div>
        );
    }, [isMobileDevice, renderConfirmationModalBody, renderConfirmationModalHeader]);

    React.useEffect(() => {
        handleToggleConfirmationModal();
        setConfirmationModalCode('');
    }, [beneficiariesActivateSuccess, handleToggleConfirmationModal, beneficiariesActivateError]);


    return (
        isMobileDevice ?
            <Modal
                onClose={props.handleToggleConfirmationModal}
                title={formatMessage({ id: 'page.mobile.wallet.withdraw.modal.new.account' })}
                isOpen>
                {renderContent()}
            </Modal> : renderContent()
    );
};
