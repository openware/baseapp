import * as React from 'react';
import { useDispatch } from 'react-redux';
import { beneficiariesFetch } from '../modules';

export const useBeneficiariesFetch = () => {
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(beneficiariesFetch());
    }, [dispatch]);
};
