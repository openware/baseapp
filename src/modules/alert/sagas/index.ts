// tslint:disable-next-line
import { takeEvery } from 'redux-saga/effects';
import { ERROR_FETCH} from '../constants';
import { handleErrorSaga } from './handleErrorSaga';

export function* rootHandleErrorSaga() {
    yield takeEvery(ERROR_FETCH, handleErrorSaga);
}
