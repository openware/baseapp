import React from 'react';

import { useReduxSelector } from '../../../lib/hooks';
import { MasterPage } from '../../../lib/layout/plane-master';

export const HelloPage: React.FC = () => {
    const lang = useReduxSelector((x) => x.public.i18n.lang);
    return (
        <MasterPage>
            <h1>{`Hello word! ${lang}`}</h1>
        </MasterPage>
    );
};
