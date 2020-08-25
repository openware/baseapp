import React from 'react';

import './index.scss';

interface Props {
    children: React.ReactNode;
}

export const PlaneFooter: React.FC<Props> = ({ children }) => {
    return (
        <div className="plane-footer">
            <div>{children}</div>
        </div>
    );
};
