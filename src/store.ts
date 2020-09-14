import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { rootReducer } from './modules';

const sagaMiddleware = createSagaMiddleware();
const rangerMiddleware = createSagaMiddleware();

// tslint:disable-next-line:no-any
const composeEnhancer: typeof compose = (window as any)
    .__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = pluginsReducer => createStore(
    rootReducer(pluginsReducer),
    composeEnhancer(
        applyMiddleware(
            sagaMiddleware,
            rangerMiddleware,
        ),
    ),
);


export {
    store,
    sagaMiddleware,
    rangerMiddleware,
};
