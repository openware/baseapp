import { Button, Modal } from '@openware/components';
import * as React from 'react';
import {
    FormattedMessage,
    InjectedIntlProps,
    injectIntl,
} from 'react-intl';

interface ModalWithdrawSubmitProps {
    currency: string;
    onSubmit: () => void;
    show: boolean;
}

type Props = ModalWithdrawSubmitProps & InjectedIntlProps;

class ModalWithdrawSubmitComponent extends React.Component<Props> {
    public translate = (e: string) => {
        return this.props.intl.formatMessage({id: e});
    };

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
                <FormattedMessage id="page.modal.withdraw.success" />
            </div>
        );
    };

    private renderBodyModalSubmit = () => {
        return (
            <div className="pg-exchange-modal-submit-body modal-body__withdraw-submit">
                <FormattedMessage id="page.modal.withdraw.success.message.content" />
            </div>
        );
    };

    private renderFooterModalSubmit = () => {
        return (
            <div className="pg-exchange-modal-submit-footer modal-footer__withdraw-submit">
                <Button
                    className="pg-exchange-modal-submit-footer__button-inverse"
                    label={this.translate('page.modal.withdraw.success.button')}
                    onClick={this.props.onSubmit}
                />
            </div>
        );
    };
}

export const ModalWithdrawSubmit = injectIntl(ModalWithdrawSubmitComponent);
