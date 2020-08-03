import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { incrementalOrderBook } from '../api';
import {
    depthFetch,
    selectCurrentMarket,
    selectShouldFetchDepth,
} from '../modules';

export const useDepthFetch = () => {
    const isIncrementalOrderBook = incrementalOrderBook();
    const currentMarket = useSelector(selectCurrentMarket);
    const shouldDispatch = useSelector(selectShouldFetchDepth);
    const dispatch = useDispatch();

    React.useEffect(() => {
        if (shouldDispatch && currentMarket && !isIncrementalOrderBook) {
            dispatch(depthFetch(currentMarket));
        }
    }, [dispatch, shouldDispatch, currentMarket, isIncrementalOrderBook]);
};
