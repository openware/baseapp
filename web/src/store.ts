import * as Sentry from "@sentry/browser";
import { applyMiddleware, compose, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import createSentryMiddleware from "redux-sentry-middleware";

import { sentryEnabled } from "./api/config";
import { rootReducer } from "./modules";

const sagaMiddleware = createSagaMiddleware();
const rangerMiddleware = createSagaMiddleware();

// tslint:disable-next-line:no-any
const composeEnhancer: typeof compose = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const sentryMiddleware = sentryEnabled ? createSentryMiddleware(Sentry, {}) : undefined;

const store = rootReducer && createStore(
    rootReducer,
    composeEnhancer(applyMiddleware(sagaMiddleware, rangerMiddleware, sentryMiddleware))
);

export { store, sagaMiddleware, rangerMiddleware };
