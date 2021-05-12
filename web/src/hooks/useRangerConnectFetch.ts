import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CanCan } from 'src/containers';
import { selectAbilities, selectLoadingAbilities, selectUserFetching, selectUserLoggedIn } from '../modules';
import { rangerConnectFetch } from '../modules/public/ranger';
import { selectRanger, selectShouldRangerConnect } from '../modules/public/ranger/selectors';

export const useRangerConnectFetch = () => {
    const dispatch = useDispatch();
    const userLoggedIn = useSelector(selectUserLoggedIn);
    const userLoading = useSelector(selectUserFetching);
    const shouldFetch = useSelector(selectShouldRangerConnect);
    const abilities = useSelector(selectAbilities);
    const abilitiesLoading = useSelector(selectLoadingAbilities);
    const canReadP2P = CanCan.checkAbilityByAction('read', 'P2P', abilities);
    const { connected, withAuth, withP2P } = useSelector(selectRanger);

    React.useEffect(() => {
        if (!connected && shouldFetch && ((!userLoggedIn && !userLoading) || (userLoggedIn && !abilitiesLoading))) {
            dispatch(rangerConnectFetch({ withAuth: userLoggedIn, withP2P: canReadP2P }));
        } else if (connected && ((!withAuth && userLoggedIn && !abilitiesLoading) || (!withP2P && canReadP2P))) {
            dispatch(rangerConnectFetch({ withAuth: userLoggedIn, withP2P: canReadP2P }));
        }
    }, [dispatch, shouldFetch, abilitiesLoading, connected, withAuth, userLoggedIn, abilities, canReadP2P, withP2P]);
};
