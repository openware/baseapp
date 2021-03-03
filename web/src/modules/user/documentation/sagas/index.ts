import { takeLatest } from 'redux-saga/effects';
import { DOC_TRADE_USER_API_FETCH } from '../constants';
import { docTradeUserApiFetchSaga } from './docTradeUserApiFetchSaga';

export function* rootDocumentationSaga() {
    yield takeLatest(DOC_TRADE_USER_API_FETCH, docTradeUserApiFetchSaga);
}
