import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';

import { RootRoutes } from './routes';
import { languageMap } from '../translations';
import { useReduxSelector } from '../lib/hooks';

const history = createBrowserHistory();

export const AppContent: React.FC = () => {
    const lang = useReduxSelector((x) => x.public.i18n.lang);
    return (
        <IntlProvider locale={lang} messages={languageMap[lang]} key={lang}>
            <Router history={history}>
                <RootRoutes />
            </Router>
        </IntlProvider>
    );
};
