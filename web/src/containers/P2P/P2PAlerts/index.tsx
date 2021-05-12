import FadeIn from 'react-fade-in';
import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { CloseIcon } from 'src/assets/images/CloseIcon';
import { P2PAlertIcon } from 'src/assets/images/P2PAlertIcon';
import { RightArrowIcon } from 'src/assets/images/slider';
import { p2pOrderRemoveAlert, selectP2POrderAlerts, selectUserInfo } from 'src/modules';

const P2PAlerts: FC = (): ReactElement => {
    const [idList, setIdList] = useState<number[]>([]);
    const { formatMessage } = useIntl();
    const orders = useSelector(selectP2POrderAlerts);
    const user = useSelector(selectUserInfo);
    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => {
        const list = orders
            .filter(order => {
                const isTaker = order.user_uid === user.uid;
                const isMaker = order.offer?.uid === user.uid;

                return (((order.state === 'prepared' && isMaker && order.side === 'sell')
                    || (order.state === 'wait' && isMaker && order.side === 'buy')
                    || (order.state === 'wait' && isTaker && order.side === 'sell')
                    || (order.state === 'prepared' && isTaker && order.side === 'buy')
                    ) && !history.location.pathname.includes(`/p2p/order/${order.id}`));
            })
            .map(o => o.id);

        setIdList(list);
    }, [orders, user]);

    const removeItem = useCallback(id => {
        const updatedList = orders.filter(i => i.id !== id);
        dispatch(p2pOrderRemoveAlert({ list: updatedList }));
    }, [orders]);

    const translate = useCallback((id: string, value?: any) => formatMessage({ id }, { ...value }), []);

    return (
        <div className="pg-p2p-alert">
            {idList.map((i, index) => (
                <FadeIn key={index}>
                    <div className="pg-p2p-alert__item">
                        <div className="pg-p2p-alert__item__header">
                            <span className="pg-p2p-alert__item__header-text">
                                {translate('page.alert.p2p.new.order.title')}
                            </span>
                            <CloseIcon onClick={() => removeItem(i)} />
                        </div>
                        <div className="pg-p2p-alert__item__body">
                            <P2PAlertIcon className="icon"/>
                            <div className="pg-p2p-alert__item__body-col">
                                <span>{translate('page.alert.p2p.new.order.data', { id: i })}</span>
                                <div className="link">
                                    <div onClick={() => history.push(`/p2p/order/${i}`)}>{translate('page.alert.p2p.new.order.link')}</div>
                                    <RightArrowIcon className="right-icon"/>                   
                                </div>
                            </div>
                        </div>
                    </div>
                </FadeIn>
            ))}
        </div>
    )
};

export {
    P2PAlerts,
};
