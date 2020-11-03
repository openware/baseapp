import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { currenciesFetch, selectShouldFetchCurrencies } from '../modules';

export const useCurrenciesFetch = () => {
    const shouldDispatch = useSelector(selectShouldFetchCurrencies);
    const dispatch = useDispatch();

    React.useEffect(() => {
        if (shouldDispatch) {
            dispatch(currenciesFetch());
        }
    }, [dispatch, shouldDispatch]);
};
