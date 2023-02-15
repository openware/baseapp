import { Offer } from 'src/modules/public/p2p';

export const insertOrUpdate = (
    list: Offer[],
    offer: Offer,
    side: string,
    base: string,
    quote: string,
    payment_method?: number,
) => {
    const { id } = offer;

    const index = list.findIndex((value: Offer) => value.id === id);

    if (offer.state === 'cancelled' || offer.state === 'done') {
        if (index === -1) {
            return list;
        } else {
            return list.filter((i) => i.id !== offer.id);
        }
    }

    if (index === -1 && side === offer.side && base === offer.base && quote === offer.quote) {
        return [{ ...offer }, ...list];
    }

    return list.map((item) => {
        if (item.id === offer.id) {
            return { ...offer };
        }

        return item;
    });
};

export const insertIfNotExisted = (list: Offer[], offer: Offer) => {
    const index = list.findIndex((value: Offer) => value.id === offer.id);

    return index === -1 ? [{ ...offer }, ...list] : [...list];
};
