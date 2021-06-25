import * as React from 'react';
import { useDispatch } from 'react-redux';
import { feeGroupFetch } from '../modules';

export const useFeeGroupFetch = () => {
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(feeGroupFetch());
    }, [dispatch]);
};
