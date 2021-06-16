import { OrderCommon, OrderEvent } from '../../types';

export const convertOrderEvent = (orderEvent: OrderEvent): OrderCommon => {
    const { at, ...order } = orderEvent;

    return {
        ...order,
        ord_type: order.order_type || order.ord_type,
    };
};

export const insertOrUpdate = (list: OrderCommon[], order: OrderCommon): OrderCommon[] => {
    const { state, id, uuid } = order;
    switch (state) {
        case 'wait':
        case 'trigger_wait':
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
            return list.reduce((memo: OrderCommon[], item: OrderCommon, i: number): OrderCommon[] => {
                if ((item.uuid && item.uuid !== uuid) || item.id !== id) {
                    memo.push(item);
                }

                if (item.uuid && item.uuid === uuid) {
                    memo.splice(i, 1);
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
