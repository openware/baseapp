import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { incrementalOrderBook } from '../api';
import {
    depthFetch,
    selectCurrentMarket,
    selectShouldFetchDepth,
} from '../modules';

export const useDepthFetch = (forceFetch = false) => {
    const isIncrementalOrderBook = incrementalOrderBook();
    const currentMarket = useSelector(selectCurrentMarket);
    const shouldFetch = useSelector(selectShouldFetchDepth);
    const dispatch = useDispatch();

    React.useEffect(() => {
        if ((shouldFetch || forceFetch) && (currentMarket && !isIncrementalOrderBook)) {
            dispatch(depthFetch(currentMarket));
        }
    }, [dispatch, shouldFetch, forceFetch, currentMarket, isIncrementalOrderBook]);
};
