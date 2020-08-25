import React from 'react';

import './index.scss';

import { BaseMasterPage } from '../base-master';
import { PlaneHeader } from './header';

interface Props {
    children: React.ReactNode;
}

export const MasterPage: React.FC<Props> = ({ children }) => {
    return (
        <BaseMasterPage>
            <div className="plane-master">
                <PlaneHeader />
                <div>{children}</div>                
            </div>
        </BaseMasterPage>
    );
};
