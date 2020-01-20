// tslint:disable-next-line
import { put, select } from 'redux-saga/effects';
import { defaultStorageLimit } from '../../../../api';
import { HistoryPush, pushHistoryFinish } from '../actions';
import { selectHistory } from '../selectors';

export function* historyPushSaga(action: HistoryPush) {
    const actualList = yield select(selectHistory);
    const updatedTrades = [...[action.payload], ...actualList].slice(0, defaultStorageLimit());

    yield put(pushHistoryFinish(updatedTrades));
}
