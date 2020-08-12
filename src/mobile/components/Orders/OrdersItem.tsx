import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { CloseIcon } from '../../../assets/images/CloseIcon';
import { Decimal } from '../../../components';
import { localeDate, setTradeColor } from '../../../helpers';
import { selectMarkets } from '../../../modules';

const OrdersItemComponent = props => {
    const { order } = props;
    const intl = useIntl();
    const markets = useSelector(selectMarkets);

    const getOrderType = (side: string, type: string) => {
        if (!side || !type) {
            return '';
        }

        return intl.formatMessage({ id: `page.mobile.orders.header.orderType.${side}.${type}` });
    };

    const currentMarket = (markets.length && markets.find(m => m.id === order.market)) ||
        { name: '', price_precision: 0, amount_precision: 0 };
    const marketName = currentMarket ? currentMarket.name : order.market;
    const orderType = getOrderType(order.side, order.ord_type);
    const filled = ((order.executed_volume / Number(order.origin_volume)) * 100).toFixed(2);
    const actualPrice = order.ord_type === 'market' || order.state === 'done' ? order.avg_price : order.price;
    const [orderDate, orderTime] = localeDate(order.updated_at ? order.updated_at : order.created_at, 'fullDate').split(' ');

    return (
        <div key={order.id} className="pg-mobile-orders-item">
            <div className="pg-mobile-orders-item__row">
                <div className="pg-mobile-orders-item__row__block">
                    <span style={{ color: setTradeColor(order.side).color }}>{orderType}</span>
                    <span>{marketName}</span>
                </div>
                <div className="pg-mobile-orders-item__row__block">
                    <span>{orderDate}</span>
                    <span>{orderTime}</span>
                </div>
            </div>
            <div className="pg-mobile-orders-item__row">
                <div className="pg-mobile-orders-item__row__block">
                    <span>{intl.formatMessage({ id: 'page.mobile.orders.header.amount' })}</span>
                    <span className="pg-mobile-orders-item__row__block__value">
                        <Decimal fixed={currentMarket.amount_precision}>{order.origin_volume}</Decimal>
                    </span>
                </div>
                <div className="pg-mobile-orders-item__row__block">
                    <span>{intl.formatMessage({ id: 'page.mobile.orders.header.price' })}</span>
                    <span className="pg-mobile-orders-item__row__block__value">
                        <Decimal fixed={currentMarket.price_precision}>{actualPrice}</Decimal>
                    </span>
                </div>
                <div className="pg-mobile-orders-item__row__block">
                    <span>{intl.formatMessage({ id: 'page.mobile.orders.header.filled' })}</span>
                    <div className="pg-mobile-orders-item__row__block__value">
                        <span>{filled}%</span>
                    </div>
                </div>
                {order.state === 'wait' ? (
                    <div className="pg-mobile-orders-item__row__button" onClick={props.handleCancel(order.id)}>
                        <span>{intl.formatMessage({ id: 'page.mobile.orders.header.cancel' })}</span>
                        <CloseIcon />
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export const OrdersItem = React.memo(OrdersItemComponent);
