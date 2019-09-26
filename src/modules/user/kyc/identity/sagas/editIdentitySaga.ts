// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../../api';
import { alertPush } from '../../../../public/alert';
import { editIdentityData, editIdentityError, EditIdentityFetch } from '../actions';

const sessionsConfig: RequestOptions = {
    apiVersion: 'barong',
};

export function* editIdentitySaga(action: EditIdentityFetch) {
    try {
        const response = yield call(API.put(sessionsConfig), '/resource/profiles', action.payload);
        const defaultMessage = 'success.identity.accepted';
        const { message = defaultMessage } = response;
        yield put(editIdentityData({ message }));
        yield put(alertPush({message: [defaultMessage], type: 'success'}));
    } catch (error) {
        yield put(editIdentityError(error));
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
