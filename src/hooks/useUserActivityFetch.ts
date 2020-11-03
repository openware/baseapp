import * as React from 'react';
import { useDispatch } from 'react-redux';

import { getUserActivity } from '../modules';

export const useUserActivityFetch = ({ page = 0, limit = 25 }) => {
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(getUserActivity({ page, limit }));
    }, [dispatch, page, limit]);
};
