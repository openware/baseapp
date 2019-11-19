import { combineReducers } from 'redux';
// tslint:disable-next-line no-submodule-imports
import { all, call } from 'redux-saga/effects';
import { publicIEOReducer, PublicIEOState, rootPublicIEOSaga } from './public';
import { ieoOrderReducer, OrderIEOState, rootIEOOrderSaga } from './user';

export interface StateIEO {
    user: OrderIEOState;
    public: PublicIEOState;
}

export const ieoReducer = combineReducers({
    public: publicIEOReducer,
    user: ieoOrderReducer,
});

export function* rootIEOSaga() {
    yield all([
        call(rootIEOOrderSaga),
        call(rootPublicIEOSaga),
    ]);
}

