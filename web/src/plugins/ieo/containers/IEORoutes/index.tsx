import * as React from 'react';
import { Route } from 'react-router';
import { ieoTitle } from '../../constants';
import { IEODetailsScreen, IEOListScreen } from '../../screens';

export const ieoRoutes = (userLoading, isCurrentSession) => {
    return ([
        <Route exact={true} path={`/${ieoTitle.toLowerCase()}/:id`} component={IEODetailsScreen} />,
        <Route path={`/${ieoTitle.toLowerCase()}`} component={IEOListScreen} />,
    ]);
};
