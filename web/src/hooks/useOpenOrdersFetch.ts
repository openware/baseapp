import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Market } from '../modules/public/markets';
import { userOpenOrdersFetch } from '../modules/user/openOrders';
import { selectUserLoggedIn } from '../modules/user/profile';

export const useOpenOrdersFetch = (market?: Market, hideOtherPairs?: boolean) => {
    const dispatch = useDispatch();
    const userLoggedIn = useSelector(selectUserLoggedIn);
    const id = market?.id;

    React.useEffect(() => {
        if (userLoggedIn && id && typeof hideOtherPairs !== 'undefined' && hideOtherPairs) {
            dispatch(userOpenOrdersFetch({ market: { id } as Market }));
        }

        if (userLoggedIn && typeof hideOtherPairs !== 'undefined' && !hideOtherPairs) {
            dispatch(userOpenOrdersFetch());
        }
    }, [userLoggedIn, id, hideOtherPairs, dispatch]);
};
