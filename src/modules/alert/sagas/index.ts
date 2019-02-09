// tslint:disable-next-line
import { takeEvery } from 'redux-saga/effects';
import { ERROR_FETCH, SUCCESS_FETCH} from '../constants';
import { handleErrorSaga } from './handleErrorSaga';
import { handleSuccessSaga } from './handleSuccessSaga';

export function* rootHandleAlertSaga() {
    yield takeEvery(ERROR_FETCH, handleErrorSaga);
    yield takeEvery(SUCCESS_FETCH, handleSuccessSaga);
}
