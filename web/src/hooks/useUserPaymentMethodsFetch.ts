import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { paymentMethodListFetch, selectShouldFetchPaymentMethods, selectPaymentMethodLoading, selectPaymentMethodSuccess } from '../modules';

export const useUserPaymentMethodsFetch = () => {
    const dispatch = useDispatch();
    const shouldDispatch = useSelector(selectShouldFetchPaymentMethods);
    const success = useSelector(selectPaymentMethodSuccess);
    const updateLoading = useSelector(selectPaymentMethodLoading);

    React.useEffect(() => {
        if (shouldDispatch || (!updateLoading && success)) {
            dispatch(paymentMethodListFetch());
        }
    }, [dispatch, shouldDispatch, updateLoading, success]);
};
