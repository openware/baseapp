import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DEFAULT_TABLE_PAGE_LIMIT } from 'src/constants';
import { activeOffersFetch, cancelledOffersFetch, doneOffersFetch, RootState, selectShouldFetchP2PUserOffers } from '../modules';

export const useP2PUserOffersFetch = ({ limit = DEFAULT_TABLE_PAGE_LIMIT, page = 0, status }) => {
    const shouldDispatch = useSelector((state: RootState) => selectShouldFetchP2PUserOffers(state, status));

    const dispatch = useDispatch();

    React.useEffect(() => {
        if (shouldDispatch) {
            switch (status) {
                case 'activeOffers':
                    dispatch(activeOffersFetch({ limit, page }));
                    break;
                case 'cancelledOffers':
                    dispatch(cancelledOffersFetch({ limit, page }));
                    break;
                case 'doneOffers':
                    dispatch(doneOffersFetch({ limit, page }));
                    break;
                default:
                    break;
            }
        }
    }, [dispatch, shouldDispatch, limit, page, status]);
};
