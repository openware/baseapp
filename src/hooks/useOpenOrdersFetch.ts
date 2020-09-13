import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userOpenOrdersFetch } from '../modules/user/openOrders';
import { selectUserLoggedIn } from '../modules/user/profile';

export const useOpenOrdersFetch = ({ id }) => {
    const dispatch = useDispatch();
    const userLoggedIn = useSelector(selectUserLoggedIn);

    React.useEffect(() => {
        if (userLoggedIn && id) {
            dispatch(userOpenOrdersFetch({ market: { id }} as any));
        }
    }, [userLoggedIn, id, dispatch]);
};
