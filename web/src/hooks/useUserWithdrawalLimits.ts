import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userWithdrawalsFetch, selectShouldFetchWithdrawalLimits } from '../modules';

export const useUserWithdrawalsFetch = () => {
    const shouldDispatch = useSelector(selectShouldFetchWithdrawalLimits);
    const dispatch = useDispatch();

    React.useEffect(() => {
        if (shouldDispatch) {
            dispatch(userWithdrawalsFetch());
        }
    }, [shouldDispatch]);
};
