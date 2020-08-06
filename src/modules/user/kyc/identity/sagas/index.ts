import { takeEvery } from 'redux-saga/effects';
import {
    EDIT_IDENTITY_FETCH,
    SEND_IDENTITY_FETCH,
} from '../constants';
import { editIdentitySaga } from './editIdentitySaga';
import { sendIdentitySaga } from './sendIdentitySaga';

export function* rootSendIdentitySaga() {
    yield takeEvery(EDIT_IDENTITY_FETCH, editIdentitySaga);
    yield takeEvery(SEND_IDENTITY_FETCH, sendIdentitySaga);
}
