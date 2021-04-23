import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userOfferOrdersFetch, selectShouldFetchP2PUserOfferOrders, selectP2PUserOfferOrders } from '../modules';

export const useP2PUserOfferOrdersFetch = ({ offer_id }) => {
    const shouldDispatch = useSelector(selectShouldFetchP2PUserOfferOrders);
    const currentOffer = useSelector(selectP2PUserOfferOrders);
    const dispatch = useDispatch();

    React.useEffect(() => {
        if ((!currentOffer || currentOffer.id !== offer_id) && shouldDispatch) {
            dispatch(userOfferOrdersFetch({ offer_id }));
        }
    }, [dispatch, shouldDispatch, offer_id, currentOffer]);
};
