import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectP2PUserOfferOrders, selectShouldFetchP2PUserOfferOrders, userOfferOrdersFetch } from '../modules';

export const useP2PUserOfferOrdersFetch = ({ offer_id }) => {
    const shouldDispatch = useSelector(selectShouldFetchP2PUserOfferOrders);
    const currentOffer = useSelector(selectP2PUserOfferOrders);
    const dispatch = useDispatch();

    React.useEffect(() => {
        if ((!currentOffer || currentOffer.id !== offer_id) && shouldDispatch) {
            dispatch(userOfferOrdersFetch({ offer_id }));
        }
    }, [shouldDispatch, offer_id, currentOffer]);
};
