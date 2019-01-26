import { Button, Modal } from '@openware/components';
import * as React from 'react';

interface ModalWithdrawConfirmationProps {
    amount: number;
    currency: string;
    onSubmit: () => void;
    onDismiss: () => void;
    rid: string;
    show: boolean;
}

class ModalWithdrawConfirmation extends React.Component<ModalWithdrawConfirmationProps> {
    public render() {
        const { show } = this.props;
        return (
            <Modal
                show={show}
                header={this.renderHeader()}
                content={this.renderBody()}
                footer={this.renderFooter()}
            />
        );
    }

    private renderHeader = () => {
        return (
            <div className="pg-exchange-modal-submit-header">
                Confirmation
            </div>
        );
    };

    private renderBody = () => {
        const {
            amount,
            currency,
            rid,
        } = this.props;
        const formattedCurrency = currency.toUpperCase();
        const text = `
            You are withdrawing ${amount} ${formattedCurrency} on ${rid} address.
            Are you sure?
        `;
        return (
            <div className="pg-exchange-modal-submit-body">
                {text}
            </div>
        );
    };

    private renderFooter = () => {
        return (
            <div className="pg-exchange-modal-submit-footer">
                <Button
                    className="pg-exchange-modal-submit-footer__button-inverse"
                    label="Cancel"
                    onClick={this.props.onDismiss}
                />
                <Button
                    className="pg-exchange-modal-submit-footer__button-inverse"
                    label="Withdraw"
                    onClick={this.props.onSubmit}
                />
            </div>
        );
    };
}

export {
    ModalWithdrawConfirmation,
};
