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
    const intl = useIntl();

    const translate = (e: string) => {
        return intl.formatMessage({id: e});
    };

    const renderHeader = () => {
        return (
            <div className="pg-exchange-modal-submit-header">
                {translate('page.mobile.wallet.withdraw.modal.confirmation')}
            </div>
        );
    };

    const renderBody = () => {
        const { amount, currency, precision, rid } = props;
        const formattedCurrency = currency.toUpperCase();

        return (
            <div className="pg-exchange-modal-submit-body mobile-modal-body__withdraw-confirm">
                <div className="mobile-modal-body__withdraw-confirm--block">
                    <span className="mobile-modal-body__withdraw-confirm--light">
                        {translate('page.mobile.wallet.withdraw.modal.confirmation.warning')}
                    </span>
                </div>
                <div className="mobile-modal-body__withdraw-confirm--block">
                    <span className="mobile-modal-body__withdraw-confirm--mute">
                        {translate('page.mobile.wallet.withdraw.modal.confirmation.message1')}
                    </span>
                    <span className="mobile-modal-body__withdraw-confirm--light">
                        {Decimal.format(amount, precision, ',')}  {formattedCurrency}
                    </span>
                </div>
                <div className="mobile-modal-body__withdraw-confirm--block">
                    <span className="mobile-modal-body__withdraw-confirm--mute">
                        {translate('page.mobile.wallet.withdraw.modal.confirmation.message2')}
                    </span>
                    <span className="mobile-modal-body__withdraw-confirm--light">{rid}</span>
                </div>
            </div>
        );
    };

    const renderFooter = () => {
        return (
            <div className="pg-exchange-modal-submit-footer modal-footer__withdraw-confirm">
                <Button
                    block={true}
                    className="btn-block mr-1 mt-1 btn-lg"
                    onClick={props.onDismiss}
                    size="lg"
                    variant="danger"
                >
                    {translate('page.body.wallets.tabs.withdraw.modal.button.cancel')}
                </Button>
                <Button
                    block={true}
                    className="btn-block mr-1 mt-1 btn-lg"
                    onClick={props.onSubmit}
                    size="lg"
                    variant="primary"
                >
                    {translate('page.body.wallets.tabs.withdraw.modal.button.withdraw')}
                </Button>
            </div>
        );
    };

    return (
        <Modal title={renderHeader()} onClose={props.onDismiss} isOpen={props.show}>
            {renderBody()}
            {renderFooter()}
        </Modal>
    );
};

export const ModalWithdrawConfirmation = React.memo(ModalWithdraw);
