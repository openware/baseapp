import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { beneficiariesFetch, selectBeneficiariesActivateSuccess, selectBeneficiariesDeleteSuccess } from '../modules';

export const useBeneficiariesFetch = () => {
    const dispatch = useDispatch();
    const beneficiariesActivateSuccess = useSelector(selectBeneficiariesActivateSuccess);
    const beneficiariesDeleteSuccess = useSelector(selectBeneficiariesDeleteSuccess);

    React.useEffect(() => {
        dispatch(beneficiariesFetch());
    }, [dispatch]);

    React.useEffect(() => {
        if (beneficiariesActivateSuccess || beneficiariesDeleteSuccess) {
            dispatch(beneficiariesFetch());
        }
    }, [dispatch, beneficiariesActivateSuccess, beneficiariesDeleteSuccess]);
};
