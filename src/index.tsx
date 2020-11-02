import * as Sentry from '@sentry/browser';
import 'bootstrap/dist/css/bootstrap-grid.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {  WrappedComponentProps } from 'react-intl';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { Provider } from 'react-redux';
import { sentryEnabled } from './api/config';
import { App } from './App';
import './index.pcss';
import { rootSaga } from './modules';
import { rangerSagas } from './modules/public/ranger';
import { rangerMiddleware, sagaMiddleware, store } from './store';


if (!Intl.PluralRules) {
    require('@formatjs/intl-pluralrules/polyfill');
    require('@formatjs/intl-pluralrules/locale-data/en');
    require('@formatjs/intl-pluralrules/locale-data/ru');
}
// @ts-ignore
if (!Intl.RelativeTimeFormat) {
    require('@formatjs/intl-relativetimeformat/polyfill');
    require('@formatjs/intl-relativetimeformat/locale-data/en');
    require('@formatjs/intl-relativetimeformat/locale-data/ru');
}

sagaMiddleware.run(rootSaga);
rangerMiddleware.run(rangerSagas);

export type IntlProps = WrappedComponentProps;

if (sentryEnabled()) {
    const key = process.env.REACT_APP_SENTRY_KEY;
    const organization = process.env.REACT_APP_SENTRY_ORGANIZATION;
    const project = process.env.REACT_APP_SENTRY_PROJECT;

    if (key && key.length && organization && organization.length && project && project.length) {
        Sentry.init({ dsn: `https://${key}@${organization}.ingest.sentry.io/${project}` });
    }
}

const render = () => ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root') as HTMLElement,
);

render();
