import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userOfferOrdersFetch, selectShouldFetchP2PUserOfferOrders } from '../modules';

export const useP2PUserOfferOrdersFetch = ({ offer_id }) => {
    const shouldDispatch = useSelector(selectShouldFetchP2PUserOfferOrders);

    const dispatch = useDispatch();

    React.useEffect(() => {
        if (shouldDispatch) {
        		console.log('fetch::', offer_id);
            dispatch(userOfferOrdersFetch({ offer_id }));
        }
    }, [dispatch, shouldDispatch, offer_id]);
};
