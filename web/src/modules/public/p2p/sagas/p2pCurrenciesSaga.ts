import { call, put } from 'redux-saga/effects';
import { sendError } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { p2pCurrenciesData, p2pCurrenciesError } from '../actions';

const config: RequestOptions = {
    apiVersion: 'p2p',
};

export function* p2pCurrenciesSaga() {
    try {
        const data = yield call(API.get(config), '/public/currencies');

        yield put(p2pCurrenciesData(data));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: p2pCurrenciesError,
                },
            }),
        );
    }
}
