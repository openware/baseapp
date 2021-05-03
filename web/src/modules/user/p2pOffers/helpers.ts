import { Offer } from "src/modules";

export const insertOrUpdate = (list: Offer[], offer: Offer, tabState: string): Offer[] => {
    const { id } = offer;
    const index = list.findIndex((value: Offer) => value.id === id);

    if (offer.state !== tabState) {
        if (index === -1 ) {
            return list;
        } else {
            return list.filter(i => i.id !== id);
        }
    }

    if (index === -1) {
        return [{...offer}, ...list];
    }

    return list.map(item => {
        if (item.id === id) {
            return {...offer};
        }

        return item;
    });
};

export const insertIfNotExisted = (list: Offer[], offer: Offer): Offer[] => {
    const index = list.findIndex((value: Offer) => value.id === offer.id);

    return index === -1 ? [{...offer}, ...list] : list;
};
