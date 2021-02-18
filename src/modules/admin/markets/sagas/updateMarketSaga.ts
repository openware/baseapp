import { all, call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { getCsrfToken } from '../../../../helpers';
import { alertPush } from '../../../public/alert';
import {
    getMarketsListError,
    MarketUpdateFetch,
} from '../actions';
import { sendError } from '../../../';

const enableMarketsConfig = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'peatio',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* updateMarketSaga(action: MarketUpdateFetch) {
    try {
        yield all(action.payload.map(item => call(API.post(enableMarketsConfig(getCsrfToken())), '/admin/markets/update', item)));

        yield put(alertPush({message: ['Market updated created'], type: 'success'}));
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: getMarketsListError,
            },
        }));
    }
}
