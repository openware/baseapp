import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DEFAULT_TABLE_PAGE_LIMIT } from 'src/constants';
import { selectShouldFetchP2PUserOffers, userOffersFetch } from '../modules';

export const useP2PUserOffersFetch = ({ limit = DEFAULT_TABLE_PAGE_LIMIT, page = 0, state }) => {
    const shouldDispatch = useSelector(selectShouldFetchP2PUserOffers);

    const dispatch = useDispatch();

    React.useEffect(() => {
        if (shouldDispatch) {
            dispatch(userOffersFetch({ limit, page, state }));
        }
    }, [shouldDispatch, limit, page, state]);
};
