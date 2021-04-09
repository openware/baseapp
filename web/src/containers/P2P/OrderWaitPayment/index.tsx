import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { getCountdownDate, millisecondToMinutes } from 'src/helpers';
import { P2POrder, p2pOrdersCancelFetch, selectP2PCancelOrderSuccess } from 'src/modules';

interface ParentProps {
    order: P2POrder;
}

type Props = ParentProps;

const OrderWaitPayment: FC<Props> = (props: Props): ReactElement => {
    const [timeLeft, setTimeLeft] = useState<string>('00:00:00');
    const [confirmTransfer, setConfirmTransfer] = useState<boolean>(false);

    const { order } = props;
    const dispatch = useDispatch();
    const history = useHistory();
    const cancelSuccess = useSelector(selectP2PCancelOrderSuccess);
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

    useEffect(() => {
        if (cancelSuccess) {
            history.push('/p2p');
        }
    }, [cancelSuccess, history]);

    const translate = useCallback((id: string, value?: any) => formatMessage({ id: id }, { ...value }), [formatMessage]);

    const clickCheckBox = useCallback(e => {
        if (e) {
            e.preventDefault();
            setConfirmTransfer(!confirmTransfer);
        }
    }, [confirmTransfer]);

    const handleCancel = useCallback(() => {
        order && dispatch(p2pOrdersCancelFetch({ id: order.id }));
    }, [order, dispatch]);

    return (
        <div className="cr-prepare-order">
            {order?.side === 'buy' ? (
                <div className="cr-prepare-order__block">
                    <span className="bold">{translate('page.body.p2p.order.transfer.info.1')}</span>
                    <span className="bold">{translate('page.body.p2p.order.transfer.info.2')}</span>
                </div>
            ) : (
                <div className="cr-prepare-order__block">
                    <span className="bold-36">{translate('page.body.p2p.order.transfer.order.wait.sell.info')}</span>
                </div>
            )}
            <div className="cr-prepare-order__block">
                <div className="cr-prepare-order__block--row">
                    <span className="huge-text">{translate(`page.body.p2p.order.transfer.order.wait.timer.${order?.side}`)}</span>
                    <span className="ticker">{timeLeft}</span>
                </div>
                <div className="cr-prepare-order__block--row">
                    <span>{translate(`page.body.p2p.order.transfer.order.wait.warning.${order?.side}`, order && { time: millisecondToMinutes(order.time_limit) })}</span>
                </div>
                <div className="cr-prepare-order__block--row">
                    <Form className="cr-prepare-order__checkbox" onClick={clickCheckBox}>
                        <Form.Check
                            type="checkbox"
                            custom
                            id="confirmTransfer"
                            checked={confirmTransfer}
                            readOnly={true}
                            label={translate(`page.body.p2p.order.transfer.order.wait.confirm.checkbox.${order?.side}`, order && { amount: `${order.amount} ${order.quote?.toUpperCase()}` })}
                        />
                    </Form>
                </div>
            </div>
            {order?.side === 'buy' ? (
                <div className="cr-prepare-order__btn-wrapper__grid">
                    <Button
                        onClick={() => window.console.log('paid')}
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
                        onClick={() => window.console.log('confirm')}
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
