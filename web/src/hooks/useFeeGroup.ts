import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { feeGroupFetch, selectShouldFetchFeeGroup } from '../modules';

export const useFeeGroupFetch = () => {
    const shouldDispatch = useSelector(selectShouldFetchFeeGroup);
    const dispatch = useDispatch();

    React.useEffect(() => {
        if (shouldDispatch) {
            dispatch(feeGroupFetch());
        }
    }, [shouldDispatch]);
};
