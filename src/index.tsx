// tslint:disable:no-submodule-imports
import 'bootstrap/dist/css/bootstrap-grid.min.css';
import { createBrowserHistory } from 'history';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { addLocaleData } from 'react-intl';
import { Provider } from 'react-redux';

import { App } from './App';
import { customLocaleData } from './custom/translations';
import './index.css';
import { rootSaga } from './modules';
import { rangerSagas } from './modules/public/ranger';
import { rangerMiddleware, sagaMiddleware, store } from './store';


const history = createBrowserHistory();

// tslint:disable-next-line:no-submodule-imports
import en = require('react-intl/locale-data/en');


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
