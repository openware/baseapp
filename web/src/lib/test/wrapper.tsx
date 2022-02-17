import React from "react";
import { IntlProvider } from "react-intl";
import { Provider } from "react-redux";
/* eslint-disable-next-line */
import { Router } from 'react-router';
import { createStore } from "redux";
import { createBrowserHistory } from "history";

import { rootReducer } from "src/modules";
import { languageMap } from "src/translations";

const browserHistory = createBrowserHistory();
const store = createStore(rootReducer);

const locale = "en";

export const TestComponentWrapper: React.FC = ({ children }) => {
    return (
        <Router history={browserHistory}>
            <IntlProvider {...{ locale }} defaultLocale={locale} messages={languageMap[locale]}>
                <Provider store={store}>{children}</Provider>
            </IntlProvider>
        </Router>
    );
};
