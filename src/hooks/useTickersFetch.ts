import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { marketsTickersFetch, selectShouldFetchMarketsTickers } from '../modules/public/markets';

export const useMarketsTickersFetch = (forceFetch = false) => {
    const shouldFetch = useSelector(selectShouldFetchMarketsTickers);
    const dispatch = useDispatch();

    React.useEffect(() => {
        if (shouldFetch || forceFetch) {
            dispatch(marketsTickersFetch());
        }
    }, [dispatch, shouldFetch, forceFetch]);
};
