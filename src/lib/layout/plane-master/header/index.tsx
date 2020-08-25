import React from 'react';

import './index.scss';

interface Props {
    children: React.ReactNode;
}

export const PlaneHeader: React.FC<Props> = ({ children }) => {
    return (
        <div className="plane-header">
            <div>{children}</div>
        </div>
    );
};
