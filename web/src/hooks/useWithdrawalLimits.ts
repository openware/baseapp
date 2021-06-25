import * as React from 'react';
import { useDispatch } from 'react-redux';
import { withdrawLimitsFetch } from '../modules';

export const useWithdrawLimits = () => {
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(withdrawLimitsFetch());
    }, [dispatch]);
};
