// tslint:disable-next-line
import { takeEvery } from 'redux-saga/effects';
import {
    PROFILE_CHANGE_PASSWORD_FETCH,
    PROFILE_GENERATE_2FA_QRCODE_FETCH,
    PROFILE_IDENTITY_FETCH,
    PROFILE_TIERS_FETCH,
    PROFILE_TOGGLE_2FA_FETCH,
    PROFILE_USER_FETCH,
} from '../constants';
import { changePasswordSaga } from './changePasswordSaga';
import { generate2faQRSaga } from './generate2faQRSaga';
import { profileIdentitySaga } from './profileIdentitySaga';
import { tiersSaga } from './tiersSaga';
import { toggle2faSaga } from './toggle2faSaga';
import { userSaga } from './userSaga';

export function* rootProfileSaga() {
    yield takeEvery(PROFILE_CHANGE_PASSWORD_FETCH, changePasswordSaga);
    yield takeEvery(PROFILE_GENERATE_2FA_QRCODE_FETCH, generate2faQRSaga);
    yield takeEvery(PROFILE_TOGGLE_2FA_FETCH, toggle2faSaga);
    yield takeEvery(PROFILE_TIERS_FETCH, tiersSaga);
    yield takeEvery(PROFILE_USER_FETCH, userSaga);
    yield takeEvery(PROFILE_IDENTITY_FETCH, profileIdentitySaga);
}
