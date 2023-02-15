import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CanCan } from 'src/containers';
import { p2pWalletsFetch, selectAbilities, selectLoadingAbilities, selectShouldFetchP2PWallets } from '../modules';

export const useP2PWalletsFetch = () => {
    const dispatch = useDispatch();
    const abilities = useSelector(selectAbilities);
    const loadingAbilities = useSelector(selectLoadingAbilities);
    const shouldDispatch = useSelector(selectShouldFetchP2PWallets);

    React.useEffect(() => {
        if (shouldDispatch && !loadingAbilities && CanCan.checkAbilityByAction('read', 'P2P', abilities)) {
            dispatch(p2pWalletsFetch());
        }
    }, [abilities, loadingAbilities, shouldDispatch]);
};
