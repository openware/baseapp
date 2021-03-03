import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { InternalTransferComponent } from '../../components';
import { setDocumentTitle } from '../../helpers';

export const InternalTransfer: React.FC = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        setDocumentTitle('Internal transfer');
    }, [dispatch]);

    return (
        <div className="pg-internal-transfer">
            <InternalTransferComponent />
        </div>
    );
};
