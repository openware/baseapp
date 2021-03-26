import { Offer, RootState } from '../..';
import { CommonError } from '../../types';

/* P2P Active Offers fetch */
export const selectP2PUserOffers = (state: RootState, status: string): Offer[] =>
    state.user.p2pOffers[status].list;

export const selectP2PUserOffersFetchLoading = (state: RootState, status: string): boolean =>
    state.user.p2pOffers[status].fetching;

export const selectP2PUserOffersFetchSuccess = (state: RootState, status: string): boolean =>
    state.user.p2pOffers[status].success;

export const selectP2PUserOffersFetchError = (state: RootState, status: string): CommonError | undefined =>
    state.user.p2pOffers[status].error;

export const selectP2PUserOffersTimestamp = (state: RootState, status: string): number | undefined =>
    state.user.p2pOffers[status].timestamp;

export const selectShouldFetchP2PUserOffers = (state: RootState, status: string): boolean =>
    !selectP2PUserOffersTimestamp(state, status) && !selectP2PUserOffersFetchLoading(state, status);

export const selectP2PUserOffersTotalNumber = (state: RootState, status: string): number =>
    state.user.p2pOffers[status].total;

export const selectP2PUserOffersCurrentPage = (state: RootState, status: string): number =>
    state.user.p2pOffers[status].page;

export const selectP2PUserOffersPageCount = (state: RootState, status: string, limit): number =>
    Math.ceil(state.user.p2pOffers[status].total / limit);

export const selectP2PUserOffersFirstElemIndex = (state: RootState, status: string, limit): number =>
    (state.user.p2pOffers[status].page * limit) + 1;

export const selectP2PUserOffersLastElemIndex = (state: RootState, status: string, limit: number): number => {
    if ((state.user.p2pOffers[status].page * limit) + limit > selectP2PUserOffersTotalNumber(state, status)) {
        return selectP2PUserOffersTotalNumber(state, status);
    } else {
        return (state.user.p2pOffers[status].page * limit) + limit;
    }
};

export const selectP2PUserOffersNextPageExists = (state: RootState, status: string, limit: number): boolean =>
    (state.user.p2pOffers[status].page + 1) < selectP2PUserOffersPageCount(state, status, limit);


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
