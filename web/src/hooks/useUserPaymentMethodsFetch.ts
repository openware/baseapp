import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    paymentMethodListFetch,
    selectShouldFetchPaymentMethods,
    selectPaymentMethodLoading,
    selectPaymentMethodSuccess,
    selectUserLoggedIn,
} from '../modules';

export const useUserPaymentMethodsFetch = () => {
    const dispatch = useDispatch();
    const shouldDispatch = useSelector(selectShouldFetchPaymentMethods);
    const success = useSelector(selectPaymentMethodSuccess);
    const updateLoading = useSelector(selectPaymentMethodLoading);
    const isLoggedIn = useSelector(selectUserLoggedIn);

    React.useEffect(() => {
        if (isLoggedIn && (shouldDispatch || (!updateLoading && success))) {
            dispatch(paymentMethodListFetch());
        }
    }, [shouldDispatch, updateLoading, isLoggedIn, success]);
};
