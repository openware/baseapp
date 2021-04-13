import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DEFAULT_TABLE_PAGE_LIMIT } from 'src/constants';
import { offersFetch, selectShouldFetchP2POffers } from '../modules';

export const useP2POffersFetch = ({ limit = DEFAULT_TABLE_PAGE_LIMIT, page = 0, side = 'buy' }) => {
    const shouldDispatch = useSelector(selectShouldFetchP2POffers);
    const dispatch = useDispatch();

    React.useEffect(() => {
        if (shouldDispatch) {
            dispatch(offersFetch({ limit, page, side: side === 'buy' ? 'sell' : 'buy' }));
        }
    }, [dispatch, shouldDispatch, side, limit, page]);
};
