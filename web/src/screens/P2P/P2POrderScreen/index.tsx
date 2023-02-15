import React, { FC, ReactElement, useCallback, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { Decimal } from 'src/components';
import { Dispute, OrderWaitConfirmation, OrderWaitPayment, P2POrderConfirmModal } from 'src/containers';
import { localeDate } from 'src/helpers';
import { useDocumentTitle } from 'src/hooks';
import { useP2POrderFetch } from 'src/hooks/useP2POrderFetch';
import {
    p2pOrderResetSuccess,
    selectCurrencies,
    selectP2PCreatedOrder,
    selectP2PCreateOrderSuccess,
    selectUserInfo,
    User,
} from 'src/modules';
import { Currency, P2POrder } from '../../../modules';

interface ParamType {
    id?: string;
}

export const P2POrderScreen: FC = (): ReactElement => {
    const { formatMessage } = useIntl();
    const { id } = useParams<ParamType>();
    const order: P2POrder = useSelector(selectP2PCreatedOrder);
    const createdOrderSuccess = useSelector(selectP2PCreateOrderSuccess);
    const currencies: Currency[] = useSelector(selectCurrencies);
    const history = useHistory();
    const user: User = useSelector(selectUserInfo);
    const dispatch = useDispatch();

    useDocumentTitle('P2P Order');
    useP2POrderFetch(Number(id));

    useEffect(() => {
        if (['autocancelled', 'cancelled'].includes(order?.state)) {
            history.push('/p2p');
        }
    }, [order]);

    useEffect(() => {
        if (createdOrderSuccess) {
            dispatch(p2pOrderResetSuccess());
        }
    }, [createdOrderSuccess]);

    const translate = useCallback((key: string) => formatMessage({ id: key }), [formatMessage]);

    const title = React.useCallback(
        () =>
            order &&
            `${translate(`page.body.p2p.order.transfer.title.${order.side}`)} ${order.offer?.base?.toUpperCase()}`,
        [order],
    );

    const handleModalAction = useCallback(() => {
        history.push(`/p2p/${order?.offer?.base}`);
    }, [order]);

    const content = useCallback(() => {
        if (order) {
            const isTaker = order.user_uid === user.uid;

            switch (order.state) {
                case 'prepared':
                    return (isTaker && order.side === 'sell') || (!isTaker && order.side === 'buy') ? (
                        <OrderWaitConfirmation order={order} isTaker={isTaker} />
                    ) : (
                        <OrderWaitPayment order={order} isTaker={isTaker} />
                    );
                case 'wait':
                    return (isTaker && order.side === 'sell') || (!isTaker && order.side === 'buy') ? (
                        <OrderWaitPayment order={order} isTaker={isTaker} />
                    ) : (
                        <OrderWaitConfirmation order={order} isTaker={isTaker} />
                    );
                case 'dispute':
                    return <Dispute order={order} />;
                case 'done':
                    return (
                        <P2POrderConfirmModal
                            precissionQuote={getPrecision(order?.offer?.quote)}
                            precissionBase={getPrecision(order?.offer?.base)}
                            order={order}
                            show={true}
                            closeModal={handleModalAction}
                        />
                    );
                default:
                    return;
            }
        }
    }, [order, user]);

    const getPrecision = useCallback(
        (cur: string) => cur && currencies.find((i) => i.id === cur.toLowerCase())?.precision,
        [currencies],
    );

    return (
        <React.Fragment>
            <div className="pg-transfer-order pg-container">
                <div className="pg-transfer-order__header">
                    <span className="pg-transfer-order__header-title">{title()}</span>
                    <div className="pg-transfer-order__header-info">
                        <div className="pg-transfer-order__header-info--row">
                            <div className="label">{translate('page.body.p2p.order.transfer.created.time')}</div>
                            <div className="value">{order ? localeDate(order.created_at, 'fullDate') : '-'}</div>
                        </div>
                        <div className="pg-transfer-order__header-info--row">
                            <div className="label">{translate('page.body.p2p.order.transfer.order.number')}</div>
                            <div className="value">{order ? order.id : '-'}</div>
                        </div>
                    </div>
                </div>
                <div className="pg-transfer-order__subheader">
                    <div className="pg-transfer-order__subheader-grid">
                        <div className="pg-transfer-order__subheader-grid-info">
                            <div className="label">{translate('page.body.p2p.order.transfer.amount')}</div>
                            <div className="value">
                                {order
                                    ? Decimal.format(
                                          +order.amount * +order.offer?.price,
                                          getPrecision(order.offer?.quote),
                                          ',',
                                      )
                                    : '-'}
                                &nbsp;{order?.offer?.quote?.toUpperCase()}
                            </div>
                        </div>
                        <div className="pg-transfer-order__subheader-grid-info">
                            <div className="label">{translate('page.body.p2p.order.transfer.price')}</div>
                            <div className="value">
                                {order
                                    ? Decimal.format(order?.offer?.price, getPrecision(order?.offer?.quote), ',')
                                    : '-'}
                                &nbsp;{order?.offer?.quote?.toUpperCase()}
                            </div>
                        </div>
                        <div className="pg-transfer-order__subheader-grid-info">
                            <div className="label">{translate('page.body.p2p.order.transfer.quantity')}</div>
                            <div className="value">
                                {order ? Decimal.format(order.amount, getPrecision(order?.offer?.base), ',') : '-'}
                                &nbsp;{order?.offer?.base?.toUpperCase()}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="pg-transfer-order__content">{content()}</div>
            </div>
            <div className="pg-transfer-order__tips pg-container">
                <span className="pg-transfer-order__tips--title">{translate('page.body.p2p.order.transfer.tips')}</span>
                <span className="pg-transfer-order__tips--text">
                    {translate('page.body.p2p.order.transfer.tips.text')}
                </span>
            </div>
        </React.Fragment>
    );
};
