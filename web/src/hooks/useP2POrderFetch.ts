import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { p2pOrderFetch, selectP2PCreatedOrder, selectP2POrderLoading } from '../modules';

export const useP2POrderFetch = (id?: number) => {
    const createdOrder = useSelector(selectP2PCreatedOrder);
    const loading = useSelector(selectP2POrderLoading);
    const dispatch = useDispatch();

    React.useEffect(() => {
        if (!createdOrder && id && !loading) {
            dispatch(p2pOrderFetch({ id }));
        }
    }, [dispatch, id, createdOrder, loading, p2pOrderFetch]);
};
