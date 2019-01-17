// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { handleError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { sendIdentityData, sendIdentityError, SendIdentityFetch } from '../actions';

const sessionsConfig: RequestOptions = {
    apiVersion: 'barong',
};

export function* sendIdentitySaga(action: SendIdentityFetch) {
    try {
        const response = yield call(API.post(sessionsConfig), '/profiles', action.payload);
        const defaultMessage = 'Your documents are successfully accepted';
        const { message = defaultMessage } = response;
        yield put(sendIdentityData({ message }));
    } catch (error) {
        yield put(sendIdentityError(error));
        yield put(handleError(error.code));
    }
}
