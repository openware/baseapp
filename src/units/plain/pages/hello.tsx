import React, { useEffect } from 'react';

import { useReduxSelector } from '../../../lib/hooks';
import { MasterPage } from '../../../lib/layout/plane-master';
import { useDispatch } from 'react-redux';
import { CommonActions } from 'src/units/common/redux';

export const HelloPage: React.FC = () => {
    const lang = useReduxSelector((x) => x.keep.locale);
    const dispatch = useDispatch();

    useEffect(() => {}, []);

    return (
        <MasterPage>
            <h1>{`Hello word! ${lang} ${__webpack_hash__}`}</h1>
        </MasterPage>
    );
};
