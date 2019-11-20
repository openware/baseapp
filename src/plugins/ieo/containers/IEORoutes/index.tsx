import * as React from 'react';
import { Route } from 'react-router';
import { IEOList } from '../';

export const IEORoutes: React.FunctionComponent = () => {
    return (
        <React.Fragment>
            <Route exact={true} path="/ieo" component={IEOList} />
            {/* <Route exact={true} path="/ieo/:id" component={IEOList} /> */}
        </React.Fragment>
    );
};
