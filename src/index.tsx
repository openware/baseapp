// tslint:disable:no-submodule-imports
import 'bootstrap/dist/css/bootstrap-grid.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createBrowserHistory } from 'history';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactGA from 'react-ga';
import { addLocaleData } from 'react-intl';

import en from 'react-intl/locale-data/en';

import { Provider } from 'react-redux';

import { gaTrackerKey } from './api';
import { App } from './App';
import { customLocaleData } from './custom/translations';
import './index.css';
import { rootSaga } from './modules';
import { rangerSagas } from './modules/public/ranger';
import { rangerMiddleware, sagaMiddleware, store } from './store';


const history = createBrowserHistory();
const gaKey = gaTrackerKey();

const trackPageToGA = (page: string) => {
    ReactGA.set({ page });
    ReactGA.pageview(page);
};

if (gaKey) {
    ReactGA.initialize(gaKey);
    trackPageToGA(window.location.pathname);
    history.listen(location => {
        trackPageToGA(location.pathname);
    });
}

addLocaleData([...en, ...customLocaleData]);
sagaMiddleware.run(rootSaga);
rangerMiddleware.run(rangerSagas);

const render = () => ReactDOM.render(
    <Provider store={store}>
        <App history={history} />
    </Provider>,
    document.getElementById('root') as HTMLElement,
);

render();
