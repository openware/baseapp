import FadeIn from 'react-fade-in';
import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { CloseIcon } from 'src/assets/images/CloseIcon';
import { P2PAlertIcon } from 'src/assets/images/P2PAlertIcon';
import { RightArrowIcon } from 'src/assets/images/slider';
import { selectP2PTradesHistoryData, selectUserInfo } from 'src/modules';

const P2PAlerts: FC = (): ReactElement => {
    const [idList, setIdList] = useState<number[]>([]);
    const { formatMessage } = useIntl();
    const orders = useSelector(selectP2PTradesHistoryData);
    const user = useSelector(selectUserInfo);
    const history = useHistory();

    useEffect(() => {
        const list = orders
            .filter(i => i.state === 'wait' && i.user_uid !== user.uid && history.location.pathname !== `/p2p/order/${i.id}`)
            .map(o => o.id);

        setIdList(list);
    }, [orders, user, history]);

    const removeItem = useCallback(id => {
        const curList = idList;
        const index = curList.indexOf(id);

        if (index !== -1) {
            curList.splice(index, 1);
            setIdList(curList);
        }
    }, [idList]);

    const translate = useCallback((id: string, value?: any) => formatMessage({ id: id }, { ...value }), [formatMessage]);

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
                                    <Link to={`/p2p/order/${i}`}>{translate('page.alert.p2p.new.order.link')}</Link>
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
