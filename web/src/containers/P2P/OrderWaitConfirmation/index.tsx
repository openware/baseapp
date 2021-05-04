import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { getCountdownDate, secondToMinutes } from 'src/helpers';
import { P2POrder } from 'src/modules';

interface ParentProps {
    order: P2POrder;
    isTaker: boolean;
}

type Props = ParentProps;

const OrderWaitConfirmation: FC<Props> = (props: Props): ReactElement => {
    const [timeLeft, setTimeLeft] = useState<string>('00:00:00');

    const { order, isTaker } = props;
    const { formatMessage } = useIntl();

    useEffect(() => {
        if (order) {
            const timer = setTimeout(() => {
                setTimeLeft(getCountdownDate(order.state === 'prepared' ? order.first_approve_expire_at : order.second_approve_expire_at));
            }, 1000);

            return () => {
                clearTimeout(timer);
            };
        }
    });

    const translate = useCallback((id: string, value?: any) => formatMessage({ id }, { ...value }), [formatMessage]);

    return (
        <div className="cr-confirm-order">
            <div className="cr-confirm-order__block">
                <span className="bold-36">{translate(`page.body.p2p.order.transfer.wait.payment.confirmation.${order?.state}`)}</span>
                <span className="description">{translate(`page.body.p2p.order.transfer.wait.payment.confirmation.${order?.state}.desc`, order && { time: secondToMinutes(order?.offer?.time_limit) })}</span>
            </div>
            <div className="cr-confirm-order__block cr-confirm-order__block-tall">
                <div className="cr-confirm-order__block--row">
                    <span className="huge-text">{translate(`page.body.p2p.order.transfer.wait.payment.confirmation.timer.${order?.state}`)}</span>
                    <span className="ticker">{timeLeft}</span>
                </div>
                {(!isTaker && order?.state === 'prepared' && order?.side === 'buy') || (order?.state === 'prepared' && order?.side === 'sell') && (
                    <div className="cr-confirm-order__block--row">
                        <span>{translate(`page.body.p2p.order.transfer.wait.payment.confirmation.warning.${order?.state}`, order && { time: secondToMinutes(order?.offer?.time_limit) })}</span>
                    </div>
                )}
            </div>
            {((isTaker && order?.state === 'wait') || (!isTaker && order?.side === 'sell')) && (
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
