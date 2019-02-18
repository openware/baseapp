// tslint:disable-next-line
import { takeEvery } from 'redux-saga/effects';
import {
    CHANGE_PASSWORD_FETCH,
    GENERATE_2FA_QRCODE_FETCH,
    GET_USER_FETCH,
    TIERS_FETCH,
    TOGGLE_2FA_FETCH,
} from '../constants';
import { changePasswordSaga } from './changePasswordSaga';
import { generate2faQRSaga } from './generate2faQRSaga';
import { tiersSaga } from './tiersSaga';
import { toggle2faSaga } from './toggle2faSaga';
import { userSaga } from './userSaga';

export function* rootProfileSaga() {
    yield takeEvery(CHANGE_PASSWORD_FETCH, changePasswordSaga);
    yield takeEvery(GENERATE_2FA_QRCODE_FETCH, generate2faQRSaga);
    yield takeEvery(TOGGLE_2FA_FETCH, toggle2faSaga);
    yield takeEvery(TIERS_FETCH, tiersSaga);
    yield takeEvery(GET_USER_FETCH, userSaga);
}
