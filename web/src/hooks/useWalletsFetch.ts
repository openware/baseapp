import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectShouldFetchWallets, walletsFetch } from '../modules';

export const useWalletsFetch = () => {
    const shouldDispatch = useSelector(selectShouldFetchWallets);
    const dispatch = useDispatch();

    React.useEffect(() => {
        if (shouldDispatch) {
            dispatch(walletsFetch());
        }
    }, [dispatch, shouldDispatch]);
};
