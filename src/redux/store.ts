import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';

import { rootReducer } from './reducer';
import { rootSaga } from './saga';
import { rangerSagas } from '../modules/public/ranger';

const sagaMiddleware = createSagaMiddleware();
// deprecated
const rangerMiddleware = createSagaMiddleware();

// tslint:disable-next-line:no-any
const composeEnhancer: typeof compose = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(rootReducer, composeEnhancer(applyMiddleware(sagaMiddleware, rangerMiddleware)));

sagaMiddleware.run(rootSaga);
// deprecated
for (const sagaKey in rangerSagas) {
    rangerMiddleware.run(rangerSagas[sagaKey]);
}
// rangerMiddleware.run(rangerSagas);

export { store };
