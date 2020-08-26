import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';

import { RootRoutes } from './routes';
import { useReduxSelector } from '../lib/hooks';

const history = createBrowserHistory();

export const AppContent: React.FC = () => {
    const locale = useReduxSelector((x) => x.keep.locale);
    return (
        <IntlProvider locale={locale}>
            <Router history={history}>
                <RootRoutes />
            </Router>
        </IntlProvider>
    );
};
