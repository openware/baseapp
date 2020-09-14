import { takeEvery, takeLatest } from 'redux-saga/effects';
import {
    BENEFICIARIES_ACTIVATE,
    BENEFICIARIES_CREATE,
    BENEFICIARIES_DELETE,
    BENEFICIARIES_FETCH,
    BENEFICIARIES_RESEND,
} from '../constants';
import { beneficiariesActivateSaga } from './beneficiariesActivateSaga';
import { beneficiariesCreateSaga } from './beneficiariesCreateSaga';
import { beneficiariesDeleteSaga } from './beneficiariesDeleteSaga';
import { beneficiariesResendPinSaga } from './beneficiariesResendPinSaga';
import { beneficiariesSaga } from './beneficiariesSaga';

export function* rootBeneficiariesSaga() {
    yield takeEvery(BENEFICIARIES_ACTIVATE, beneficiariesActivateSaga);
    yield takeEvery(BENEFICIARIES_CREATE, beneficiariesCreateSaga);
    yield takeEvery(BENEFICIARIES_DELETE, beneficiariesDeleteSaga);
    yield takeLatest(BENEFICIARIES_FETCH, beneficiariesSaga);
    yield takeLatest(BENEFICIARIES_RESEND, beneficiariesResendPinSaga);
}
