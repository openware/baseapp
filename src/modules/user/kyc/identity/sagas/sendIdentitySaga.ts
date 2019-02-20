// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../../api';
import { pushAlertError, pushAlertSuccess } from '../../../../public/alert';
import { sendIdentityData, sendIdentityError, SendIdentityFetch } from '../actions';

const sessionsConfig: RequestOptions = {
    apiVersion: 'barong',
};

export function* sendIdentitySaga(action: SendIdentityFetch) {
    try {
        const response = yield call(API.post(sessionsConfig), '/resource/profiles', action.payload);
        const defaultMessage = 'success.documents.accepted';
        const { message = defaultMessage } = response;
        yield put(sendIdentityData({ message }));
        yield put(pushAlertSuccess(defaultMessage));
    } catch (error) {
        yield put(sendIdentityError(error));
        yield put(pushAlertError(error));
    }
}
