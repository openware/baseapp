import classnames from 'classnames';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { Modal } from '../../mobile/components/Modal';

interface Props {
    handleToggleFailModal: () => void;
    isMobileDevice?: boolean;
}


const BeneficiariesFailAddModalComponent: React.FC<Props> = (props: Props) => {
    const { formatMessage } = useIntl();
    const { handleToggleFailModal, isMobileDevice } = props;

    const ModalHeader = React.useCallback(() => (
        <div className="cr-email-form__options-group">
            <div className="cr-email-form__option">
                <div className="cr-email-form__option-inner">
                    {formatMessage({ id: 'page.body.wallets.beneficiaries.failAddModal.header' })}
                    <span
                        className="pg-profile-page__close pg-profile-page__pull-right"
                        onClick={handleToggleFailModal}
                    />
                </div>
            </div>
        </div>
    ), [handleToggleFailModal, formatMessage]);

    const ModalBody = React.useCallback(() => (
        <div className="cr-email-form__form-content">
            <span className="cr-email-form__form-content__info">
                {formatMessage({ id: 'page.body.wallets.beneficiaries.failAddModal.content' })}
            </span>
            <div className="cr-email-form__button-wrapper">
                <Link to="/confirm">
                    <Button
                        size="lg"
                        variant="primary"
                        className="cr-email-form__button-wrapper__btn"
                    >
                        {formatMessage({ id: 'page.body.wallets.beneficiaries.failAddModal.button' })}
                    </Button>
                </Link>
            </div>
        </div>
    ), [formatMessage]);

    const renderContent = React.useCallback(() => {
        const className = classnames('beneficiaries-fail-modal', {
            'cr-modal': !isMobileDevice,
        });

        return (
            <div className={className}>
                <div className="cr-email-form">
                    <ModalHeader/>
                    <ModalBody/>
                </div>
            </div>
        );
    }, [isMobileDevice]);

    return (
        props.isMobileDevice ?
            <Modal
                isOpen
                onClose={props.handleToggleFailModal}
                title={formatMessage({ id: 'page.body.wallets.beneficiaries.failAddModal.content' })}>
                {renderContent()}
            </Modal> : renderContent()
    );
};

const BeneficiariesFailAddModal = React.memo(BeneficiariesFailAddModalComponent);

export {
    BeneficiariesFailAddModal,
};
