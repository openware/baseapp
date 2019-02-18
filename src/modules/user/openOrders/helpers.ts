import { kindToMakerType } from '../../helpers';
import { OrderAPI, OrderCommon, OrderEvent } from '../../types';

export const convertOrderAPI = (order: OrderAPI): OrderCommon => {
    const {
        id,
        side,
        price,
        state,
        created_at,
        volume,
        remaining_volume,
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
        origin_volume: Number(volume),
        remaining_volume: Number(remaining_volume),
        executed_volume: Number(executed_volume),
        market,
        ord_type,
        avg_price: Number(avg_price),
    };
};

export const convertOrderEvent = (orderEvent: OrderEvent): OrderCommon => {
    const { id, at, kind, price, state, volume, origin_volume, market } = orderEvent;
    return {
        id,
        side: kindToMakerType(kind),
        price: Number(price),
        state,
        remaining_volume: Number(volume),
        executed_volume: Number(origin_volume) - Number(volume),
        origin_volume: Number(origin_volume),
        created_at: new Date(Number(at) * 1000).toISOString(),
        market,
    };
};

export const insertOrUpdate = (list: OrderCommon[], order: OrderCommon): OrderCommon[] => {
    const {state} = order;
    const index = list.findIndex((value: OrderCommon) => value.id === order.id);
    if (index === -1) {
        if (state === 'wait') {
            return list.concat(order);
        }
        return list;
    }
    if (state === 'wait') {
        list[index] = order;
    } else {
        list.splice(index, 1);
    }
    return list;
};

export const insertIfNotExisted = (list: OrderCommon[], order: OrderCommon): OrderCommon[] => {
    const index = list.findIndex((value: OrderCommon) => value.id === order.id);
    if (index === -1) {
        return list.concat(order);
    }
    return list;
};
