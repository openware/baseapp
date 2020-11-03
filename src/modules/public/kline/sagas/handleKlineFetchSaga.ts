import { call, put } from 'redux-saga/effects';

import { sendError } from '../../../';
import { API, isFinexEnabled, RequestOptions } from '../../../../api';
import { buildQueryString, getTimestampPeriod } from '../../../../helpers';
import { klineData, klineError, KlineFetch } from '../actions';

const klineRequestOptions: RequestOptions = {
    apiVersion: isFinexEnabled() ? 'finex' : 'peatio',
};

export function* handleKlineFetchSaga(action: KlineFetch) {
    try {
        const { market, resolution, from, to } = action.payload;

        const payload = {
            period: resolution,
            time_from: getTimestampPeriod(from, resolution),
            time_to: getTimestampPeriod(to, resolution),
        };

        let endPoint = `/public/markets/${market}/k-line`;

        if (payload) {
            endPoint = `${endPoint}?${buildQueryString(payload)}`;
        }

        const data = yield call(API.get(klineRequestOptions), endPoint);

        const convertedData = data.map((elem) => {
            const [date, open, high, low, close, volume] = elem.map((e) => {
                switch (typeof e) {
                    case 'number':
                        return e;
                    case 'string':
                        return Number.parseFloat(e);
                    default:
                        throw new Error(`unexpected type ${typeof e}`);
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
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: klineError,
                },
            })
        );
    }
}
