import { Button, Modal } from '@openware/components';
import * as React from 'react';

interface ModalWithdrawSubmitProps {
    currency: string;
    onSubmit: () => void;
    show: boolean;
}

class ModalWithdrawSubmit extends React.Component<ModalWithdrawSubmitProps> {
    public render() {
        const { show } = this.props;
        return (
            <Modal
                show={show}
                header={this.renderHeaderModalSubmit()}
                content={this.renderBodyModalSubmit()}
                footer={this.renderFooterModalSubmit()}
            />
        );
    }

    private renderHeaderModalSubmit = () => {
        return (
            <div className="pg-exchange-modal-submit-header">
                Success!
            </div>
        );
    };

    private renderBodyModalSubmit = () => {
        const { currency } = this.props;
        const formattedCurrency = currency.toUpperCase();
        const text = `
            Your ${formattedCurrency} withdrawal has been submitted successfully. Please wait to receive
            few mandatory confirmations for the completion of this transaction.
        `;
        return (
            <div className="pg-exchange-modal-submit-body">
                {text}
            </div>
        );
    };

    private renderFooterModalSubmit = () => {
        return (
            <div className="pg-exchange-modal-submit-footer">
                <Button
                    className="pg-exchange-modal-submit-footer__button-inverse"
                    label="OK"
                    onClick={this.props.onSubmit}
                />
            </div>
        );
    };
}

export {
    ModalWithdrawSubmit,
};
