import React from 'react';

import { MasterPage } from '../../../lib/layout/plane-master';

export const HelloPage: React.FC = () => {
    return (
        <MasterPage>
            <h1>{`Hello word!`}</h1>
        </MasterPage>
    );
};
