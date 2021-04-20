import { Offer } from "src/modules/public/p2p";

export const insertOrUpdate = (list: Offer[], offer: Offer) => {
    const { id } = offer;
    const index = list.findIndex((value: Offer) => value.id === id);

    if (index === -1) {
        return [{...offer}, ...list];
    }

    return list.map(item => {
        if (item.id === offer.id) {
            return {...offer};
        }

        return item;
    });
};

export const insertIfNotExisted = (list: Offer[], offer: Offer) => {
    const index = list.findIndex((value: Offer) => value.id === offer.id);

    return (index === -1) ? [{...offer}, ...list] : [...list];
};