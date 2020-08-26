import * as React from 'react';
import { Button } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { CopyableTextField } from '../../../components';
import { copy } from '../../../helpers';
import { WarningIcon } from '../../assets/images/WarningIcon';
import { Modal } from '../../components/Modal';

export const CreatedApiKeyModalComponent = props => {
    const [apiKey, setApiKey] = React.useState({ kid: '', secret: '' });
    const intl = useIntl();

    React.useEffect(() => {
        if (props.apiKey) {
            setApiKey(props.apiKey);
        }
    }, [props.apiKey]);

    const renderModalBody = () => {
        return (
            <div className="cr-mobile-modal__body">
                <div className="cr-mobile-modal__body__fieldset">
                    <fieldset onClick={() => copy('access-key-id')}>
                        <CopyableTextField
                            className="pg-copyable-text-field__input"
                            fieldId={'access-key-id'}
                            value={apiKey.kid || ''}
                            copyButtonText={intl.formatMessage({ id: 'page.body.profile.content.copyLink' })}
                            label={intl.formatMessage({ id: 'page.body.profile.apiKeys.modal.access_key' })}
                        />
                    </fieldset>
                </div>
                <div className="cr-mobile-modal__body__fieldset">
                    <fieldset onClick={() => copy('secret-key-id')}>
                        <CopyableTextField
                            className="pg-copyable-text-field__input"
                            fieldId={'secret_key-id'}
                            value={apiKey.secret || ''}
                            copyButtonText={intl.formatMessage({ id: 'page.body.profile.content.copyLink' })}
                            label={intl.formatMessage({ id: 'page.body.profile.apiKeys.modal.secret_key' })}
                        />
                    </fieldset>
                </div>
                <div className="cr-mobile-modal__body__title">
                    <WarningIcon />
                    <span>{intl.formatMessage({ id: 'page.body.profile.apiKeys.modal.secret_key' })}</span>
                </div>
                <div className="cr-mobile-modal__body__note">
                    <p>
                        {intl.formatMessage({ id: 'page.body.profile.apiKeys.modal.secret_key_info' })}&nbsp;
                        {intl.formatMessage({ id: 'page.body.profile.apiKeys.modal.secret_key_store' })}
                    </p>
                    <p>
                        {intl.formatMessage({ id: 'page.body.profile.apiKeys.modal.note' })}&nbsp;
                        {intl.formatMessage({ id: 'page.body.profile.apiKeys.modal.note_content' })}
                    </p>
                </div>
            </div>
        );
    };

    const renderModalFooter = () => {
        return (
            <div className="cr-mobile-modal__footer">
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
