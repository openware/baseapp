import * as React from 'react';
import { useDispatch } from 'react-redux';
import { fetchHistory } from '../modules';

export const useHistoryFetch = ({ type, currency, limit = 6, page = 0 }) => {
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(fetchHistory({ type, limit, currency, page }));
    }, [dispatch, type, currency]);
};
