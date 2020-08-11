import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { marketsTickersFetch, selectShouldFetchMarketsTickers } from '../modules/public/markets';

export const useMarketsTickersFetch = () => {
    const shouldDispatch = useSelector(selectShouldFetchMarketsTickers);
    const dispatch = useDispatch();

    React.useEffect(() => {
        if (shouldDispatch) {
            dispatch(marketsTickersFetch());
        }
    }, [dispatch, shouldDispatch]);
};
