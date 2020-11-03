import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectUserLoggedIn } from '../modules';
import { rangerConnectFetch } from '../modules/public/ranger';
import { selectRanger, selectShouldRangerConnect } from '../modules/public/ranger/selectors';

export const useRangerConnectFetch = () => {
    const dispatch = useDispatch();
    const userLoggedIn = useSelector(selectUserLoggedIn);
    const shouldFetch = useSelector(selectShouldRangerConnect);
    const { connected, withAuth } = useSelector(selectRanger);

    React.useEffect(() => {
        if (!connected && shouldFetch) {
            dispatch(rangerConnectFetch({ withAuth: userLoggedIn }));
        } else if (connected && !withAuth && userLoggedIn) {
            dispatch(rangerConnectFetch({ withAuth: userLoggedIn }));
        }
    }, [dispatch, shouldFetch, connected, withAuth, userLoggedIn]);
};
