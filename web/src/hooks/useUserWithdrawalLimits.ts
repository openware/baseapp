import * as React from 'react';
import { useDispatch } from 'react-redux';
import { userWithdrawalsFetch } from '../modules';

export const useUserWithdrawalsFetch = () => {
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(userWithdrawalsFetch());
    }, [dispatch]);
};
