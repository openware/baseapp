import * as React from 'react';
import { useDispatch } from 'react-redux';

import { userOrdersHistoryFetch } from '../modules';

export const useUserOrdersHistoryFetch = (pageIndex, type, limit) => {
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(userOrdersHistoryFetch({ pageIndex, type, limit }));
    }, [dispatch, pageIndex, type, limit]);
};
