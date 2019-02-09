import { createBrowserHistory } from 'history';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { addLocaleData } from 'react-intl';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';

import { App } from './App';
import './index.css';
import { rootReducer, rootSaga } from './modules';
import { rangerSagas } from './modules/ranger';

const history = createBrowserHistory();

// tslint:disable:no-submodule-imports
import en = require('react-intl/locale-data/en');
import ru = require('react-intl/locale-data/ru');
import zh = require('react-intl/locale-data/zh');
// tslint:enable

// tslint:disable-next-line:no-any
const composeEnhancer: typeof compose = (window as any)
    .__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const sagaMiddleware = createSagaMiddleware();
const rangerMiddleware = createSagaMiddleware();

const store = createStore(
    rootReducer,
    composeEnhancer(
        applyMiddleware(
            sagaMiddleware,
            rangerMiddleware,
        ),
    ),
);

addLocaleData([...en, ...ru, ...zh]);
sagaMiddleware.run(rootSaga);
rangerMiddleware.run(rangerSagas);

const render = () => ReactDOM.render(
    <Provider store={store}>
        <App history={history} />
    </Provider>,
    document.getElementById('root') as HTMLElement,
);

render();
