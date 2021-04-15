import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { getCountdownDate, millisecondToMinutes } from 'src/helpers';
import { P2POrder, p2pOrdersUpdateFetch } from 'src/modules';

interface ParentProps {
    order: P2POrder;
}

type Props = ParentProps;

const OrderWaitConfirmation: FC<Props> = (props: Props): ReactElement => {
    const [timeLeft, setTimeLeft] = useState<string>('00:00:00');

    const { order } = props;
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

    return (
        <div className="cr-confirm-order">
            <div className="cr-confirm-order__block">
                <span className="bold-36">{translate(`page.body.p2p.order.transfer.wait.payment.confirmation.${order?.side}`)}</span>
                <span className="description">{translate(`page.body.p2p.order.transfer.wait.payment.confirmation.${order?.side}.desc`, order && { time: millisecondToMinutes(order.time_limit) })}</span>
            </div>
            <div className="cr-confirm-order__block cr-confirm-order__block-tall">
                <div className="cr-confirm-order__block--row">
                    <span className="huge-text">{translate(`page.body.p2p.order.transfer.wait.payment.confirmation.timer.${order?.side}`)}</span>
                    <span className="ticker">{timeLeft}</span>
                </div>
                {order?.side === 'sell' && (
                    <div className="cr-confirm-order__block--row">
                        <span>{translate('page.body.p2p.order.transfer.wait.payment.confirmation.warning.sell', order && { time: millisecondToMinutes(order.time_limit) })}</span>
                    </div>
                    )}
            </div>
            {order?.side === 'buy' && (
                <div className="cr-confirm-order__btn-wrapper__grid">
                    <Button
                        onClick={() => window.console.log('logDispute')}
                        size="lg"
                        variant="primary"
                        disabled={timeLeft !== '00:00:00'}
                    >
                        {translate('page.body.p2p.order.transfer.wait.payment.confirmation.logDispute')}
                    </Button>
                </div>
            )}
        </div>
    );
};

export {
    OrderWaitConfirmation,
};
