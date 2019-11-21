import * as React from 'react';
import { Route } from 'react-router';
import { IEOListScreen } from '../../screens/IEOListScreen';

export const IEORoutes: React.FunctionComponent = () => {
    return (
        <React.Fragment>
            <Route exact={true} path="/ieo" component={IEOListScreen} />
            {/* <Route exact={true} path="/ieo/:id" component={IEOList} /> */}
        </React.Fragment>
    );
};
