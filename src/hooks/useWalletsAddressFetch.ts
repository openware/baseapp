import * as React from 'react';
import { useDispatch } from 'react-redux';
import { walletsAddressFetch } from '../modules';

export const useWalletsAddressFetch = (currency: string) => {
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(walletsAddressFetch({ currency }));
    }, [dispatch, currency]);
};
