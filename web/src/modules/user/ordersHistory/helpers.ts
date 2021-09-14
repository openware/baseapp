import { OrderCommon } from '../../types';

const ListReduceHelper = (list, order) => {
    const listReduce = list.reduce((memo: OrderCommon[], item: OrderCommon): OrderCommon[] => {
        if (order.id !== item.id) {
            memo.push(item);
        }

        return memo;
    }, []);

    return [{...order}].concat(listReduce);
};

export const insertOrUpdate = (list: OrderCommon[], order: OrderCommon): OrderCommon[] => {
    const index = list.findIndex((value: OrderCommon) => value.id === order.id);
    switch (order.state) {
        case 'wait':
        case 'trigger_wait':
            if (index === -1) {
                return [{...order}].concat(list);
            }
            if (index !== -1) {
                return ListReduceHelper(list, order);
            }

            return list;
        case 'done':
            if (index === -1) {
                return [{...order}].concat(list);
            }

            return list.map(item => {
                if (order.id === item.id) {
                    return {...order};
                }

                return item;
            });
        case 'cancel':
            return ListReduceHelper(list, order);
        default:
            return list.reduce((memo: OrderCommon[], item: OrderCommon): OrderCommon[] => {
                if (order.id !== item.id) {
                    memo.push(item);
                }

                return memo;
            }, []);
    }
};
