import cr from 'classnames';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { CustomInput } from '../../../components/CustomInput';
import { Modal } from '../../components/Modal';

export const TwoFactorModalComponent = props => {
    const [code2FA, setCode2FA] = React.useState('');
    const [code2FAFocus, setCode2FAFocus] = React.useState(false);
    const intl = useIntl();

    const handleToggle2FA = shouldFetch => {
        props.handleToggle2FA(code2FA, shouldFetch);
        setCode2FA('');
    };

    const renderModalBody = () => {
        const code2FAClass = cr('cr-email-form__group', {
            'cr-email-form__group--focused': code2FAFocus,
        });

        return (
            <div className="pg-exchange-modal-submit-body pg-exchange-modal-submit-body-2fa">
                <span className="pg-exchange-modal-submit-body-2fa__subtitle">
                    {intl.formatMessage({id: 'page.mobile.twoFactorModal.subtitle'})}
                </span>
                <div className={code2FAClass}>
                    <CustomInput
                        type="text"
                        label="2FA code"
                        placeholder="2FA code"
                        defaultLabel=""
                        handleFocusInput={() => setCode2FAFocus(true)}
                        handleChangeInput={setCode2FA}
                        inputValue={code2FA}
                        classNameLabel="cr-email-form__label"
                        classNameInput="cr-email-form__input"
                        autoFocus={true}
                    />
                </div>
            </div>
        );
    };

    const renderModalFooter = () => {
        const isValid2FA = code2FA.match('^[0-9]{6}$');

        return (
            <div className="pg-exchange-modal-submit-footer">
                <Button
                    block={true}
                    disabled={!isValid2FA}
                    onClick={() => handleToggle2FA(true)}
                    size="lg"
                    variant="primary"
                >
                    {intl.formatMessage({id: 'page.mobile.twoFactorModal.send'})}
                </Button>
            </div>
        );
    };

    return (
        <div className="cr-mobile-two-fa-modal">
            <Modal
                isOpen={props.showModal}
                onClose={() => handleToggle2FA(false)}
                title={intl.formatMessage({ id: 'page.mobile.twoFactorModal.title' })}>
                {renderModalBody()}
                {renderModalFooter()}
            </Modal>
        </div>
    );
};

export const TwoFactorModal = React.memo(TwoFactorModalComponent);
