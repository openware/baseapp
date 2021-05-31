import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withdrawLimitsFetch, selectShouldWithdrawLimits } from '../modules';

export const useWithdrawLimits = () => {
    const shouldDispatch = useSelector(selectShouldWithdrawLimits);
    const dispatch = useDispatch();

    React.useEffect(() => {
        if (shouldDispatch) {
            dispatch(withdrawLimitsFetch());
        }
    }, [shouldDispatch]);
};
