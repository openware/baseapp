import { kindToMakerType } from '../../helpers';
import { OrderAPI, OrderCommon, OrderEvent } from '../../types';

export const convertOrderAPI = (order: OrderAPI): OrderCommon => {
    const {
        id,
        uuid,
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
        updated_at,
        confirmed,
    } = order;

    return {
        id,
        uuid,
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
        updated_at,
        confirmed,
    };
};

export const convertOrderEvent = (orderEvent: OrderEvent): OrderCommon => {
    const {
        id,
        uuid,
        at,
        kind,
        price,
        state,
        remaining_volume,
        origin_volume,
        market, ord_type,
        updated_at,
        confirmed,
    } = orderEvent;

    return {
        id,
        uuid,
        side: kindToMakerType(kind),
        price: Number(price),
        state,
        remaining_volume: Number(remaining_volume),
        executed_volume: Number(origin_volume) - Number(remaining_volume),
        origin_volume: Number(origin_volume),
        created_at: new Date(Number(at) * 1000).toISOString(),
        market,
        ord_type,
        updated_at,
        confirmed,
    };
};

export const insertOrUpdate = (list: OrderCommon[], order: OrderCommon): OrderCommon[] => {
    const { state, id, uuid } = order;
    switch (state) {
        case 'wait':
            const index = list.findIndex((value: OrderCommon) => (value.uuid && value.uuid === uuid) || value.id === id);
            if (index === -1) {
                return [{...order}, ...list];
            }

            return list.map(item => {
                if ((item.uuid && item.uuid === order.uuid) || (item.id === order.id)) {
                    return {...order};
                }

                return item;
            });
        default:
            return list.reduce((memo: OrderCommon[], item: OrderCommon): OrderCommon[] => {
                if ((item.uuid && item.uuid !== uuid) || item.id !== id) {
                    memo.push(item);
                }

                return memo;
            }, []);
    }
};

export const insertIfNotExisted = (list: OrderCommon[], order: OrderCommon): OrderCommon[] => {
    const index = list.findIndex((value: OrderCommon) =>
        order.confirmed ? value.id === order.id : value.uuid === order.uuid);

    return (index === -1) ? [{...order}, ...list] : [...list];
};
