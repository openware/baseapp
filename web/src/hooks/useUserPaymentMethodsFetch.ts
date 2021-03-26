import * as React from 'react';
import { useDispatch } from 'react-redux';
import { paymentMethodListFetch } from '../modules';

export const useUserPaymentMethodsFetch = () => {
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(paymentMethodListFetch());
    }, [dispatch]);
};
