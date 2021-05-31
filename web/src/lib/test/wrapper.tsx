import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import { languageMap } from 'src/translations';
import { store } from 'src/store';

const browserHistory = createBrowserHistory();
const locale = 'en';

export const TestComponentWrapper: React.FC = ({ children }) => {
    return (
        <Router history={browserHistory}>
            <IntlProvider {...{ locale }} defaultLocale={locale} messages={languageMap[locale]}>
                <Provider store={store}>{children}</Provider>
            </IntlProvider>
        </Router>
    );
};
