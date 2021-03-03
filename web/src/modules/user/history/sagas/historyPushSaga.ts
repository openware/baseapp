import { put, select } from 'redux-saga/effects';
import { defaultStorageLimit } from '../../../../api';
import { sliceArray } from '../../../../helpers';
import { HistoryPush, pushHistoryFinish } from '../actions';
import { selectHistory } from '../selectors';

export function* historyPushSaga(action: HistoryPush) {
    const actualList = yield select(selectHistory);
    const updatedTrades = [...[action.payload], ...actualList];
    const slicedTrades = sliceArray(updatedTrades, defaultStorageLimit());

    yield put(pushHistoryFinish(slicedTrades));
}
