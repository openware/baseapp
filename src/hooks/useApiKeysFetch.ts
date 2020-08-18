import * as React from 'react';
import { useDispatch } from 'react-redux';
import { apiKeysFetch } from '../modules';

export const useApiKeysFetch = () => {
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(apiKeysFetch());
    }, [dispatch]);
};
