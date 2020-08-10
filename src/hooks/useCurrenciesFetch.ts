import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { currenciesFetch, selectShouldFetchCurrencies} from '../modules';

export const useCurrenciesFetch = (forceFetch = false) => {
    const shouldFetch = useSelector(selectShouldFetchCurrencies);
    const dispatch = useDispatch();

    React.useEffect(() => {
        if (shouldFetch || forceFetch) {
            dispatch(currenciesFetch());
        }
    }, [dispatch, shouldFetch, forceFetch]);
};
