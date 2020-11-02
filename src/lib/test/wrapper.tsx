import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { createStore } from 'redux';
import { rootReducer } from 'src/modules';
import { languageMap } from 'src/translations';
import { createBrowserHistory } from 'history';

const browserHistory = createBrowserHistory();
const store = createStore(rootReducer);

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

// export function wrapTestComponent<T extends React.ReactElement>(props: any) {
//     return shallow(
//         <TestComponentWrapper>
//             <T {...props} />
//         </TestComponentWrapper>
//     );
// }
