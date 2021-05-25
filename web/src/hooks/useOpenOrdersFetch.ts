import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Market } from '../modules/public/markets';
import { userOpenOrdersFetch } from '../modules/user/openOrders';
import { selectUserLoggedIn } from '../modules/user/profile';

export const useOpenOrdersFetch = (market?: Market) => {
    const dispatch = useDispatch();
    const userLoggedIn = useSelector(selectUserLoggedIn);
    const id = market?.id;

    React.useEffect(() => {
        if (userLoggedIn && id) {
            dispatch(userOpenOrdersFetch({ market: { id } as Market }));
        }
    }, [userLoggedIn, id, dispatch]);
};
