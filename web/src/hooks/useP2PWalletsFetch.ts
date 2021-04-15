import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CanCan } from 'src/containers';
import { selectAbilities, selectLoadingAbilities, p2pWalletsFetch, selectShouldFetchP2PWallets } from '../modules';

export const useP2PWalletsFetch = () => {
    const dispatch = useDispatch();
    const abilities = useSelector(selectAbilities);
    const loadingAbilities = useSelector(selectLoadingAbilities);
    const shouldDispatch = useSelector(selectShouldFetchP2PWallets);

    React.useEffect(() => {
        if (shouldDispatch && !loadingAbilities && CanCan.checkAbilityByAction('read', 'P2P', abilities)) {
            dispatch(p2pWalletsFetch());
        }
    }, [dispatch, abilities, loadingAbilities, shouldDispatch]);
};
