import { kindToMakerType } from '../../helpers';
import { OrderAPI, OrderCommon, OrderEvent } from '../../types';

export const convertOrderAPI = (order: OrderAPI): OrderCommon => {
    const {
        id,
        side,
        price,
        state,
        created_at,
        remaining_volume,
        origin_volume,
        executed_volume,
        market,
        ord_type,
        avg_price,
    } = order;
    return {
        id,
        side,
        price: Number(price),
        state,
        created_at,
        origin_volume: Number(origin_volume),
        remaining_volume: Number(remaining_volume),
        executed_volume: Number(executed_volume),
        market,
        ord_type,
        avg_price: Number(avg_price),
    };
};

export const convertOrderEvent = (orderEvent: OrderEvent): OrderCommon => {
    const { id, at, kind, price, state, remaining_volume, origin_volume, market } = orderEvent;
    return {
        id,
        side: kindToMakerType(kind),
        price: Number(price),
        state,
        remaining_volume: Number(remaining_volume),
        executed_volume: Number(origin_volume) - Number(remaining_volume),
        origin_volume: Number(origin_volume),
        created_at: new Date(Number(at) * 1000).toISOString(),
        market,
    };
};

export const insertOrUpdate = (list: OrderCommon[], order: OrderCommon): OrderCommon[] => {
    const { state, id } = order;
    switch (state) {
        case 'wait':
            const index = list.findIndex((value: OrderCommon) => value.id === id);
            if (index === -1) {
                return list.concat({...order});
            }
            return list.map(item => {
                if (item.id === order.id) {
                    return {...order};
                }
                return item;
            });
        default:
            return list.reduce((memo: OrderCommon[], item: OrderCommon): OrderCommon[] => {
                if (id !== item.id) {
                    memo.push(item);
                }
                return memo;
            }, []);
    }
};

export const insertIfNotExisted = (list: OrderCommon[], order: OrderCommon): OrderCommon[] => {
    const index = list.findIndex((value: OrderCommon) => value.id === order.id);
    return (index === -1) ? list.concat({...order}) : [...list];
};
