import * as React from 'react';
import { Button } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { Modal } from '../../components/Modal';

export const CreatedApiKeyModalComponent = props => {
    const intl = useIntl();

    const renderModalBody = () => {
        return (
            <div className="pg-mobile-created-api-key-modal__body">
                Here will be an info!
            </div>
        );
    };

    const renderModalFooter = () => {
        return (
            <div className="pg-mobile-created-api-key-modal__footer">
                <Button
                    block={true}
                    onClick={props.closeCreatedApiKeyModal}
                    size="lg"
                    variant="primary"
                >
                    {intl.formatMessage({id: 'page.mobile.createdApiKeyModal.confirm'})}
                </Button>
            </div>
        );
    };

    return (
        <div className="pg-mobile-created-api-key-modal">
            <Modal
                isOpen={props.showModal}
                onClose={props.closeCreatedApiKeyModal}
                title={intl.formatMessage({ id: 'page.mobile.createdApiKeyModal.title' })}>
                {renderModalBody()}
                {renderModalFooter()}
            </Modal>
        </div>
    );
};

export const CreatedApiKeyModal = React.memo(CreatedApiKeyModalComponent);
