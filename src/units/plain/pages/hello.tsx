import React from 'react';

import { useReduxSelector } from '../../../lib/hooks';

export const HelloPage: React.FC = () => {
    const lang = useReduxSelector((x) => x.public.i18n.lang);
    return <h1>{`Hello word! ${lang}`}</h1>;
};
