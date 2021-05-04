import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { CloseIcon } from 'src/assets/images/CloseIcon';
import { P2POrder } from 'src/modules';
import { Decimal, Modal } from 'src/components';
import { ConfirmationIcon } from 'src/assets/images/ConfirmationIcon';

interface ParentProps {
    precissionQuote: number;
    precissionBase: number;
    order: P2POrder;
    show: boolean;
    closeModal: () => void;
}

type Props = ParentProps;

const P2POrderConfirmModal: FC<Props> = (props: Props): ReactElement => {
    const {
        precissionQuote,
        precissionBase,
        show,
        order,
        order: { side },
    } = props;

    const { formatMessage } = useIntl();
    const translate = useCallback((id: string, value?: any) => formatMessage({ id }, { ...value }), [formatMessage]);

    const handleCloseModal = useCallback(() => {
        props.closeModal();
    }, []);

    const header = useCallback(() => (
        <React.Fragment>
            <span className="cr-modal__container-header-title">{translate(`page.body.p2p.order.modal.header.${side}Order`)}</span>
            <div onClick={handleCloseModal} className="cr-modal__container-header-close">
                <CloseIcon className="close-icon" />
            </div>
        </React.Fragment>
    ), [side]);

    const body = useCallback(() => {
        return (
            <React.Fragment>
                <div className="cr-modal__container-content-icon">
                    <ConfirmationIcon />
                </div>
                <div className="cr-modal__container-content-block">
                    <div className="detail">
                        <div className="detail-block">
                            <div className="detail-block-label">{translate('page.body.p2p.order.modal.body.amount')}</div>
                            <div className="detail-block-value">
                                {order ? Decimal.format(+order.amount * +order?.offer?.price, precissionQuote, ',') : '-'}&nbsp;{order?.offer?.quote?.toUpperCase()}
                            </div>
                        </div>
                        <div className="detail-block">
                            <div className="detail-block-label">{translate('page.body.p2p.order.modal.body.price')}</div>
                            <div className="detail-block-value">
                                {order ? Decimal.format(order?.offer?.price, precissionQuote, ',') : '-'}&nbsp;{order?.offer?.quote?.toUpperCase()}
                            </div>
                        </div>
                        <div className="detail-block">
                            <div className="detail-block-label">{translate('page.body.p2p.order.modal.body.quantity')}</div>
                            <div className="detail-block-value">
                                {order ? Decimal.format(order.amount, precissionBase, ',') : '-'}&nbsp;{order?.offer?.base?.toUpperCase()}
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }, [order, precissionBase, precissionQuote]);

    const footer = React.useCallback(() => (
        <Button
            onClick={props.closeModal}
            size="lg"
            variant="primary"
        >
            {translate('page.body.p2p.order.modal.footer.button')}
        </Button>
    ), [props.closeModal]);

    return (
        <div>
            <Modal
                show={show}
                header={header()}
                content={body()}
                footer={footer()}
            />
        </div>
    );
};

export {
    P2POrderConfirmModal,
};
