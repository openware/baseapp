import { all, call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { getCsrfToken } from '../../../../helpers';
import { alertPush } from '../../../public/alert';
import {
    updateMarketError,
    updateMarketData,
    MarketUpdateFetch,
} from '../actions';
import { sendError } from '../../../';

const enableMarketsConfig = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'peatio',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

const configUpdateOptions = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'sonic',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* updateMarketSaga(action: MarketUpdateFetch) {
    try {
        yield all(action.payload.map(item => call(API.post(enableMarketsConfig(getCsrfToken())), '/admin/markets/update', item)));
        if (action.callbackAction) {
            const { scope, key, value, component } = action.callbackAction;
            const payload = new FormData();
            payload.append('scope', scope);
            payload.append('key', key);
            payload.append('value', value);

            yield call(API.put(configUpdateOptions(getCsrfToken())), `/admin/${component}/secret`, payload);
        }
        yield put(alertPush({message: ['Market updated created'], type: 'success'}));
        yield put(updateMarketData());
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: updateMarketError,
            },
        }));
    }
}
