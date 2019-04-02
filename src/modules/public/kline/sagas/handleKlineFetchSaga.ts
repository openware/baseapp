// tslint:disable-next-line no-submodule-imports
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { alertPush } from '../../alert';
import { klineData, KlineFetch } from '../actions';

const klineRequestOptions: RequestOptions = {
    apiVersion: 'peatio',
};

export function* handleKlineFetchSaga(action: KlineFetch) {
  try {
      const {
          market,
          resolution,
          from,
          to,
      } = action.payload;
      const data = yield call(API.get(klineRequestOptions), `/public/markets/${market}/k-line?period=${resolution}&time_from=${from}&time_to=${to}`);

      const convertedData = data.map(elem => {
          const [date, open, high, low, close, volume] = elem.map(e => {
              switch (typeof e) {
                  case 'number':
                      return e;
                  case 'string':
                      return Number.parseFloat(e);
                  default:
                      throw (new Error(`unexpected type ${typeof e}`));
              }
          });

          return {
              date: date * 1e3,
              open,
              high,
              low,
              close,
              volume,
          };
      });
      yield put(klineData(convertedData));
  } catch (error) {
      yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
  }
}
