import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { docTradeUserApiFetch, selectShouldFetchDocumentation } from '../modules';

export const useDocumentationFetch = () => {
    const shouldDispatch = useSelector(selectShouldFetchDocumentation);
    const dispatch = useDispatch();

    React.useEffect(() => {
        if (shouldDispatch) {
            dispatch(docTradeUserApiFetch());
        }
    }, [dispatch, shouldDispatch]);
};
