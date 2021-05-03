import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { alertPush } from '../../../../modules/public/alert';
import { abilitiesData, abilitiesError } from '../actions';

const applogicRequestOptions: RequestOptions = {
    apiVersion: 'finex',
};

export function* abilitiesSaga() {
    try {
        const applogicAbilities = yield call(API.get(applogicRequestOptions), '/abilities');
        yield put(abilitiesData([ applogicAbilities ]));
    } catch (error) {
        yield put(abilitiesError());
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
