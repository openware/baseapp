import React from 'react';

import './index.scss';

interface Props {
    children: React.ReactNode;
}

export const MasterPage: React.FC<Props> = ({ children }) => {
    return (
        <div className="plane-master">
            <div>{children}</div>
        </div>
    );
};
