import { Offer, RootState } from '../..';
import { CommonError } from '../../types';

/* P2P User Offers fetch */
export const selectP2PUserOffers = (state: RootState): Offer[] =>
    state.user.p2pOffers.offers.list;

export const selectP2PUserOffersFetchLoading = (state: RootState): boolean =>
    state.user.p2pOffers.offers.fetching;

export const selectP2PUserOffersFetchSuccess = (state: RootState): boolean =>
    state.user.p2pOffers.offers.success;

export const selectP2PUserOffersFetchError = (state: RootState): CommonError | undefined =>
    state.user.p2pOffers.offers.error;

export const selectP2PUserOffersTimestamp = (state: RootState): number | undefined =>
    state.user.p2pOffers.offers.timestamp;

export const selectShouldFetchP2PUserOffers = (state: RootState): boolean =>
    !selectP2PUserOffersTimestamp(state) && !selectP2PUserOffersFetchLoading(state);

export const selectP2PUserOffersTotalNumber = (state: RootState): number =>
    state.user.p2pOffers.offers.total;

export const selectP2PUserOffersCurrentPage = (state: RootState): number =>
    state.user.p2pOffers.offers.page;

export const selectP2PUserOffersPageCount = (state: RootState, limit): number =>
    Math.ceil(state.user.p2pOffers.offers.total / limit);

export const selectP2PUserOffersFirstElemIndex = (state: RootState, limit): number =>
    (state.user.p2pOffers.offers.page * limit) + 1;

export const selectP2PUserOffersLastElemIndex = (state: RootState, limit: number): number => {
    if ((state.user.p2pOffers.offers.page * limit) + limit > selectP2PUserOffersTotalNumber(state)) {
        return selectP2PUserOffersTotalNumber(state);
    } else {
        return (state.user.p2pOffers.offers.page * limit) + limit;
    }
};

export const selectP2PUserOffersNextPageExists = (state: RootState, limit: number): boolean =>
    (state.user.p2pOffers.offers.page + 1) < selectP2PUserOffersPageCount(state, limit);


/* P2P Create Offer */
export const selectP2PCreateOffersLoading = (state: RootState): boolean =>
    state.user.p2pOffers.createOffer.loading;

export const selectP2PCreateOffersSuccess = (state: RootState): boolean =>
    state.user.p2pOffers.createOffer.success;

export const selectP2PCreateOffersError = (state: RootState): CommonError | undefined =>
    state.user.p2pOffers.createOffer.error;


/* P2P Cancel Order Methods */
export const selectP2PCancelOfferData = (state: RootState): Offer[] =>
state.user.p2pOffers.cancelOffer.list;

export const selectP2PCancelOfferLoading = (state: RootState): boolean =>
state.user.p2pOffers.cancelOffer.loading;

export const selectP2PCancelOfferSuccess = (state: RootState): boolean =>
state.user.p2pOffers.cancelOffer.success;

export const selectP2PCancelOfferError = (state: RootState): CommonError | undefined =>
state.user.p2pOffers.cancelOffer.error;

export const selectP2PCancelOfferTimestamp = (state: RootState): number | undefined =>
    state.user.p2pOffers.cancelOffer.timestamp;

export const selectShouldFetchP2PCancelOffer = (state: RootState): boolean =>
    !selectP2PCancelOfferTimestamp(state) && !selectP2PCancelOfferLoading(state);
