import * as React from 'react';
import { useDispatch } from 'react-redux';
import { memberLevelsFetch } from '../modules';

export const useMemberLevelFetch = () => {
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(memberLevelsFetch());
    }, [dispatch]);
};
