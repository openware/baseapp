import * as React from 'react';
import {
    InjectedIntlProps,
    injectIntl,
} from 'react-intl';
import { Modal } from '../../components';
import { Button } from '../../components/atoms/Button/Button';

interface ModalWithdrawConfirmationProps {
    amount: number;
    currency: string;
    onSubmit: () => void;
    onDismiss: () => void;
    rid: string;
    show: boolean;
}

type Props = ModalWithdrawConfirmationProps & InjectedIntlProps;

class ModalWithdraw extends React.Component<Props> {
    public translate = (e: string) => {
        return this.props.intl.formatMessage({id: e});
    };
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
                {this.translate('page.body.wallets.tabs.withdraw.modal.confirmation')}
            </div>
        );
    };

    private renderBody = () => {
        const { amount, currency, rid } = this.props;
        const formattedCurrency = currency.toUpperCase();
        return (
            <div className="pg-exchange-modal-submit-body modal-body__withdraw-confirm">
                <p>
                    {this.translate('page.body.wallets.tabs.withdraw.modal.message1')}
                    {amount} {formattedCurrency}
                    {this.translate('page.body.wallets.tabs.withdraw.modal.message2')} {rid}
                </p>
            </div>
        );
    };

    private renderFooter = () => {
        return (
            <div className="pg-exchange-modal-submit-footer modal-footer__withdraw-confirm">
                <Button
                    className="pg-exchange-modal-submit-footer__button-inverse"
                    label={this.translate('page.body.wallets.tabs.withdraw.modal.button.cancel')}
                    onClick={this.props.onDismiss}
                />
                <Button
                    className="pg-exchange-modal-submit-footer__button-inverse"
                    label={this.translate('page.body.wallets.tabs.withdraw.modal.button.withdraw')}
                    onClick={this.props.onSubmit}
                />
            </div>
        );
    };
}

// tslint:disable-next-line
export const ModalWithdrawConfirmation = injectIntl(ModalWithdraw);
