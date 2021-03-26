import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DEFAULT_TABLE_PAGE_LIMIT } from 'src/constants';
import { activeOffersFetch, cancelledOffersFetch, RootState, selectShouldFetchP2PUserOffers } from '../modules';

export const useP2PUserOffersFetch = ({ limit = DEFAULT_TABLE_PAGE_LIMIT, page = 0, status }) => {
    const shouldDispatch = useSelector((state: RootState) => selectShouldFetchP2PUserOffers(state, status));

    const dispatch = useDispatch();

    React.useEffect(() => {
        if (shouldDispatch) {
            if (status === 'activeOffers') {
                dispatch(activeOffersFetch({ limit, page }));
            } else if (status === 'cancelledOffers') {
                dispatch(cancelledOffersFetch({ limit, page }));
            }
        }
    }, [dispatch, shouldDispatch, limit, page, status]);
};
