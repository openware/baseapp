import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CanCan } from 'src/containers';
import { selectAbilities, selectUserLoggedIn } from '../modules';
import { rangerConnectFetch } from '../modules/public/ranger';
import { selectRanger, selectShouldRangerConnect } from '../modules/public/ranger/selectors';

export const useRangerConnectFetch = () => {
    const dispatch = useDispatch();
    const userLoggedIn = useSelector(selectUserLoggedIn);
    const shouldFetch = useSelector(selectShouldRangerConnect);
    const { connected, withAuth } = useSelector(selectRanger);
    const abilities = useSelector(selectAbilities);
    const withP2P = CanCan.checkAbilityByAction('read', 'P2P', abilities);

    React.useEffect(() => {

        if (!connected && shouldFetch) {
            dispatch(rangerConnectFetch({ withAuth: userLoggedIn, withP2P }));
        } else if (connected && !withAuth && userLoggedIn) {
            dispatch(rangerConnectFetch({ withAuth: userLoggedIn, withP2P }));
        } else if (connected && !withAuth && userLoggedIn && withP2P) {
            dispatch(rangerConnectFetch({ withAuth: userLoggedIn, withP2P }));
        }
    }, [dispatch, shouldFetch, connected, withAuth, userLoggedIn, abilities, withP2P]);
};
