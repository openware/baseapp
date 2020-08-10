import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectShouldFetchWallets, walletsFetch } from '../modules';

export const useWalletsFetch = () => {
    const shouldFetch = useSelector(selectShouldFetchWallets);
    const dispatch = useDispatch();

    React.useEffect(() => {
        if (shouldFetch) {
            dispatch(walletsFetch());
        }
    }, [dispatch, shouldFetch]);
};
