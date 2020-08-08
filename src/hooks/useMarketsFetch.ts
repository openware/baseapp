import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { marketsFetch, selectShouldFetchMarkets } from '../modules/public/markets';

export const useMarketsFetch = (forceFetch = false) => {
    const shouldFetch = useSelector(selectShouldFetchMarkets);
    const dispatch = useDispatch();

    React.useEffect(() => {
        if (shouldFetch || forceFetch) {
            dispatch(marketsFetch());
        }
    }, [dispatch, shouldFetch, forceFetch]);
};
