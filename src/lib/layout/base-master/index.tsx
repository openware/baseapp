import React, { PropsWithChildren, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';

import './index.scss';

import { useReduxSelector } from 'lib/hooks';
import { useDispatch } from 'react-redux';
import { CommonActions } from 'src/units/common/redux';

interface Props extends PropsWithChildren<any> {
    children: React.ReactElement;
}

export const BaseMasterPage: React.FC<Props> = ({ children }): React.ReactElement => {
    const initialized = useReduxSelector((x) => x.common.initialized);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!initialized) {
            dispatch(CommonActions.init());
        }
    }, [initialized]);

    return initialized ? (
        children
    ) : (
        <div className="base-master">
            <Spinner animation="border" />
        </div>
    );
};
