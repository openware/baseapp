import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { marketsFetch, selectShouldFetchMarkets } from '../modules/public/markets';

export const useMarketsFetch = () => {
    const shouldDispatch = useSelector(selectShouldFetchMarkets);
    const dispatch = useDispatch();

    React.useEffect(() => {
        if (shouldDispatch) {
            dispatch(marketsFetch());
        }
    }, [dispatch, shouldDispatch]);
};
