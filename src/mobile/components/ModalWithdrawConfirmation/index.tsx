import * as React from 'react';
import { Button } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { Decimal } from '../../../components';
import { Modal } from '../../components';

interface ModalWithdrawConfirmationProps {
    amount: string;
    currency: string;
    onSubmit: () => void;
    onDismiss: () => void;
    rid: string;
    show: boolean;
    precision: number;
}

const ModalWithdraw = (props: ModalWithdrawConfirmationProps) => {
    const { formatMessage } = useIntl();
    const { amount, currency, precision, rid } = props;

    const renderHeader = React.useCallback(() => {
        return (
            <div className="pg-exchange-modal-submit-header">
                {formatMessage({ id: 'page.mobile.wallet.withdraw.modal.confirmation' })}
            </div>
        );
    }, [formatMessage]);

    const renderBody = React.useCallback(() => {
        return (
            <div className="pg-exchange-modal-submit-body mobile-modal-body__withdraw-confirm">
                <div className="mobile-modal-body__withdraw-confirm--block">
                    <span className="mobile-modal-body__withdraw-confirm--light">
                        {formatMessage({ id: 'page.mobile.wallet.withdraw.modal.confirmation.warning' })}
                    </span>
                </div>
                <div className="mobile-modal-body__withdraw-confirm--block">
                    <span className="mobile-modal-body__withdraw-confirm--mute">
                        {formatMessage({ id: 'page.mobile.wallet.withdraw.modal.confirmation.message1' })}
                    </span>
                    <span className="mobile-modal-body__withdraw-confirm--light">
                        {Decimal.format(amount, precision, ',')}  {currency.toUpperCase()}
                    </span>
                </div>
                <div className="mobile-modal-body__withdraw-confirm--block">
                    <span className="mobile-modal-body__withdraw-confirm--mute">
                        {formatMessage({ id: 'page.mobile.wallet.withdraw.modal.confirmation.message2' })}
                    </span>
                    <span className="mobile-modal-body__withdraw-confirm--light">{rid}</span>
                </div>
            </div>
        );
    }, [formatMessage, amount, currency, precision, rid]);

    const renderFooter = React.useCallback(() => {
        return (
            <div className="pg-exchange-modal-submit-footer modal-footer__withdraw-confirm">
                <Button
                    block={true}
                    className="btn-block mr-1 mt-1 btn-lg"
                    onClick={props.onDismiss}
                    size="lg"
                    variant="danger"
                >
                    {formatMessage({ id: 'page.body.wallets.tabs.withdraw.modal.button.cancel' })}
                </Button>
                <Button
                    block={true}
                    className="btn-block mr-1 mt-1 btn-lg"
                    onClick={props.onSubmit}
                    size="lg"
                    variant="primary"
                >
                    {formatMessage({ id: 'page.body.wallets.tabs.withdraw.modal.button.withdraw' })}
                </Button>
            </div>
        );
    }, [formatMessage]);

    return (
        <Modal title={renderHeader()} onClose={props.onDismiss} isOpen={props.show}>
            {renderBody()}
            {renderFooter()}
        </Modal>
    );
};

export const ModalWithdrawConfirmation = React.memo(ModalWithdraw);
