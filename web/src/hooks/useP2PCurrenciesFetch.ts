import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { p2pCurrenciesFetch, selectShouldFetchP2PCurrencies } from '../modules';

export const useP2PCurrenciesFetch = () => {
    const shouldDispatch = useSelector(selectShouldFetchP2PCurrencies);

    const dispatch = useDispatch();

    React.useEffect(() => {
        if (shouldDispatch) {
            dispatch(p2pCurrenciesFetch());
        }
    }, [dispatch, shouldDispatch]);
};
