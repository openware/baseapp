import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { incrementalOrderBook } from '../api';
import { depthFetch, selectCurrentMarket } from '../modules';

export const useDepthFetch = () => {
    const isIncrementalOrderBook = incrementalOrderBook();
    const currentMarket = useSelector(selectCurrentMarket);
    const dispatch = useDispatch();

    React.useEffect(() => {
        if (currentMarket && !isIncrementalOrderBook) {
            dispatch(depthFetch(currentMarket));
        }
    }, [dispatch, currentMarket, isIncrementalOrderBook]);
};
