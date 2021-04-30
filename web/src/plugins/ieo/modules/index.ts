import { combineReducers } from 'redux';
import { all, call } from 'redux-saga/effects';
import { publicIEOReducer, PublicIEOState, rootPublicIEOSaga } from './public';
import { ieoOrderReducer, OrderIEOState, rootIEOOrderSaga } from './user';

export * from './public';
export * from './user';

export interface IeoPluginState {
    user: OrderIEOState;
    public: PublicIEOState;
}

export const ieoPluginReducer = combineReducers({
    public: publicIEOReducer,
    user: ieoOrderReducer,
});

export function* rootIEOPluginsSaga() {
    yield all([
        call(rootIEOOrderSaga),
        call(rootPublicIEOSaga),
    ]);
}
