import * as React from 'react';
import { Route } from 'react-router';
import { IEODetailsScreen, IEOListScreen } from '../../screens';

export const IEORoutes: React.FunctionComponent = () => {
    return (
        <React.Fragment>
            <Route exact={true} path="/ieo" component={IEOListScreen} />
            <Route exact={true} path="/ieo/:id" component={IEODetailsScreen} />
        </React.Fragment>
    );
};
