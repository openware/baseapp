import { RootState } from '../..';
import { CommonError } from '../../types';
import { Offer, P2PCurrency, PaymentMethod } from './types';

/* P2P Offers fetch */
export const selectP2POffers = (state: RootState): Offer[] => state.public.p2p.offers.list;

export const selectP2POffersFetchLoading = (state: RootState): boolean => state.public.p2p.offers.fetching;

export const selectP2POffersFetchSuccess = (state: RootState): boolean => state.public.p2p.offers.success;

export const selectP2POffersFetchError = (state: RootState): CommonError | undefined => state.public.p2p.offers.error;

export const selectP2POffersTimestamp = (state: RootState): number | undefined => state.public.p2p.offers.timestamp;

export const selectShouldFetchP2POffers = (state: RootState): boolean =>
    !selectP2POffersTimestamp(state) && !selectP2POffersFetchLoading(state);

export const selectP2POffersTotalNumber = (state: RootState): number => state.public.p2p.offers.total;

export const selectP2POffersCurrentPage = (state: RootState): number => state.public.p2p.offers.page;

export const selectP2POffersPageCount = (state: RootState, limit): number =>
    Math.ceil(state.public.p2p.offers.total / limit);

export const selectP2POffersFirstElemIndex = (state: RootState, limit): number =>
    state.public.p2p.offers.page * limit + 1;

export const selectP2POffersLastElemIndex = (state: RootState, limit: number): number => {
    if (state.public.p2p.offers.page * limit + limit > selectP2POffersTotalNumber(state)) {
        return selectP2POffersTotalNumber(state);
    } else {
        return state.public.p2p.offers.page * limit + limit;
    }
};

export const selectP2POffersNextPageExists = (state: RootState, limit: number): boolean =>
    state.public.p2p.offers.page + 1 < selectP2POffersPageCount(state, limit);

/* P2P Currencies */
export const selectP2PCurrenciesData = (state: RootState): P2PCurrency[] => state.public.p2p.currencies.data;

export const selectP2PCurrenciesLoading = (state: RootState): boolean => state.public.p2p.currencies.fetching;

export const selectP2PCurrenciesSuccess = (state: RootState): boolean => state.public.p2p.currencies.success;

export const selectP2PCurrenciesError = (state: RootState): CommonError | undefined =>
    state.public.p2p.currencies.error;

export const selectP2PCurrenciesTimestamp = (state: RootState): number | undefined =>
    state.public.p2p.currencies.timestamp;

export const selectShouldFetchP2PCurrencies = (state: RootState): boolean =>
    !selectP2PCurrenciesTimestamp(state) && !selectP2PCurrenciesLoading(state);

/* P2P Payment Methods */
export const selectP2PPaymentMethodsData = (state: RootState): PaymentMethod[] => state.public.p2p.paymentMethods.data;

export const selectP2PPaymentMethodsLoading = (state: RootState): boolean => state.public.p2p.paymentMethods.fetching;

export const selectP2PPaymentMethodsSuccess = (state: RootState): boolean => state.public.p2p.paymentMethods.success;

export const selectP2PPaymentMethodsError = (state: RootState): CommonError | undefined =>
    state.public.p2p.paymentMethods.error;

export const selectP2PPaymentMethodsTimestamp = (state: RootState): number | undefined =>
    state.public.p2p.paymentMethods.timestamp;

export const selectShouldFetchP2PPaymentMethods = (state: RootState): boolean =>
    !selectP2PPaymentMethodsTimestamp(state) && !selectP2PPaymentMethodsLoading(state);

/* P2P Highest Price Methods */
export const selectP2PHighestPriceData = (state: RootState): string => state.public.p2p.highestPrice.data;

export const selectP2PHighestPriceLoading = (state: RootState): boolean => state.public.p2p.highestPrice.fetching;

export const selectP2PHighestPriceTimestamp = (state: RootState): number | undefined =>
    state.public.p2p.highestPrice.timestamp;

export const selectShouldFetchP2PHighestPrice = (state: RootState): boolean =>
    !selectP2PHighestPriceTimestamp(state) && !selectP2PHighestPriceLoading(state);
