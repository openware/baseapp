// tslint:disable-next-line
import { takeEvery } from 'redux-saga/effects';
import {
    SEND_IDENTITY_FETCH,
} from '../constants';
import { sendIdentitySaga } from './sendIdentitySaga';

export function* rootSendIdentitySaga() {
    yield takeEvery(SEND_IDENTITY_FETCH, sendIdentitySaga);
}
