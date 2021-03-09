import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { QuickExchangeContainer } from '../../containers';
import { setDocumentTitle } from '../../helpers';

export const QuickExchange: React.FC = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        setDocumentTitle('Quick Exchange');
    }, [dispatch]);

    return (
        <div className="pg-quick-exchange">
            <QuickExchangeContainer />
        </div>
    );
};
