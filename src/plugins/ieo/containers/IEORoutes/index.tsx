import * as React from 'react';
import { Route } from 'react-router';
import { IEODetailsScreen, IEOListScreen } from '../../screens';

export const ieoRoutes = index => {
    return ([
        <Route exact={true} path="/ieo" component={IEOListScreen} key={index} />,
        <Route exact={true} path="/ieo/:id" component={IEODetailsScreen} key={index} />,
    ]);
};
