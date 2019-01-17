// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../api';
import {
  depthData,
  depthError,
  DepthFetch,
} from '../actions';

const depthOptions: RequestOptions = {
  apiVersion: 'peatio',
};

export function* depthSaga(action: DepthFetch) {
  try {
    const market = action.payload;
    const depth = yield call(API.get(depthOptions), `/public/markets/${market.id}/depth`);
    yield put(depthData(depth));
  } catch (error) {
    yield put(depthError(error));
  }
}
