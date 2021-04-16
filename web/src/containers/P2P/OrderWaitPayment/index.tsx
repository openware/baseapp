import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { getCountdownDate, millisecondToMinutes } from 'src/helpers';
import { P2POrder, p2pOrdersUpdateFetch } from 'src/modules';

interface ParentProps {
    order: P2POrder;
    isTaker: boolean;
}

type Props = ParentProps;

const OrderWaitPayment: FC<Props> = (props: Props): ReactElement => {
    const [timeLeft, setTimeLeft] = useState<string>('00:00:00');
    const [confirmTransfer, setConfirmTransfer] = useState<boolean>(false);

    const { order, isTaker } = props;
    const dispatch = useDispatch();
    const { formatMessage } = useIntl();

    useEffect(() => {
        if (order) {
            const timer = setTimeout(() => {
                setTimeLeft(getCountdownDate(order.expiry_time));
            }, 1000);

            return () => {
                clearTimeout(timer);
            };
        }
    });

    const translate = useCallback((id: string, value?: any) => formatMessage({ id: id }, { ...value }), [formatMessage]);

    const clickCheckBox = useCallback(e => {
        if (e) {
            e.preventDefault();
            setConfirmTransfer(!confirmTransfer);
        }
    }, [confirmTransfer]);

    const handleCancel = useCallback(() => {
        order && dispatch(p2pOrdersUpdateFetch({ id: order.id, action: 'cancel' }));
    }, [order, dispatch]);

    const handleClickPaid = useCallback(() => {
        order && dispatch(p2pOrdersUpdateFetch({ id: order.id, action: 'approve' }));
    }, [order, dispatch]);

    return (
        <div className="cr-prepare-order">
            {!isTaker && order?.side === 'sell' || isTaker && order?.side === 'buy' ? (
                <div className="cr-prepare-order__block">
                    <span className="bold">{translate('page.body.p2p.order.transfer.info.1')}</span>
                    <span className="bold">{translate('page.body.p2p.order.transfer.info.2')}</span>
                </div>
            ) : (
                <div className="cr-prepare-order__block">
                    <span className="bold-36">{translate(`page.body.p2p.order.transfer.order.wait.info`)}</span>
                </div>
            )}
            <div className="cr-prepare-order__block">
                <div className="cr-prepare-order__block--row">
                    <span className="huge-text">{translate(`page.body.p2p.order.transfer.order.wait.timer.${order?.state}`)}</span>
                    <span className="ticker">{timeLeft}</span>
                </div>
                <div className="cr-prepare-order__block--row">
                    <span>{translate(`page.body.p2p.order.transfer.order.wait.warning.${order?.state}`, order && { time: millisecondToMinutes(order.time_limit) })}</span>
                </div>
                <div className="cr-prepare-order__block--row">
                    <Form className="cr-prepare-order__checkbox" onClick={clickCheckBox}>
                        <Form.Check
                            type="checkbox"
                            custom
                            id="confirmTransfer"
                            checked={confirmTransfer}
                            readOnly={true}
                            label={translate(`page.body.p2p.order.transfer.order.wait.confirm.checkbox.${order?.state}`, order && { amount: `${order.amount} ${order.quote?.toUpperCase()}` })}
                        />
                    </Form>
                </div>
            </div>
            {!isTaker && order?.side === 'sell' || isTaker && order?.side === 'buy' ? (
                <div className="cr-prepare-order__btn-wrapper__grid">
                    <Button
                        onClick={handleClickPaid}
                        size="lg"
                        variant="primary"
                        disabled={!confirmTransfer}
                    >
                        {translate('page.body.p2p.order.transfer.have.paid')}
                    </Button>
                    <Button
                        onClick={handleCancel}
                        size="lg"
                        variant="secondary"
                    >
                        {translate('page.body.p2p.order.transfer.cancel.order').toUpperCase()}
                    </Button>
                </div>
            ) : (
                <div className="cr-prepare-order__btn-wrapper__grid">
                    <Button
                        onClick={handleClickPaid}
                        size="lg"
                        variant="primary"
                        disabled={!confirmTransfer}
                    >
                        {translate('page.body.p2p.order.transfer.order.wait.confirm')}
                    </Button>
                    <Button
                        onClick={() => window.console.log('dispute')}
                        size="lg"
                        variant="secondary"
                    >
                        {translate('page.body.p2p.order.transfer.order.wait.logDispute')}
                    </Button>
                </div>
            )}
        </div>
    );
};

export {
    OrderWaitPayment,
};
