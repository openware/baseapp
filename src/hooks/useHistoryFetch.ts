import * as React from 'react';
import { useDispatch } from 'react-redux';
import { fetchHistory } from '../modules';

export const useHistoryFetch = ({ type, currency }) => {
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(fetchHistory({ type, limit: 6, currency, page: 1 }));
    }, [dispatch, type, currency]);
};
