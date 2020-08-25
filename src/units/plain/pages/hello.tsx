import React from 'react';

import { useReduxSelector } from '../../../lib/hooks';
import { MasterPage } from '../../../lib/layout/plane-master';

export const HelloPage: React.FC = () => {
    const lang = useReduxSelector((x) => x.keep.locale);
    return (
        <MasterPage>
            <h1>{`Hello word! ${lang} ${__webpack_hash__}`}</h1>
        </MasterPage>
    );
};
