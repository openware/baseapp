import { call, put } from 'redux-saga/effects';
import { sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { blockchainsData } from '../../blockchains';
import { currenciesData } from '../../currencies';
import { configsData, configsError } from '../actions';

const configsOptions: RequestOptions = {
    apiVersion: 'peatio',
};

export function* getConfigsSaga() {
    try {
        const { currencies, blockchains } = yield call(API.get(configsOptions), '/public/config');

        yield put(currenciesData(currencies));
        yield put(blockchainsData(blockchains));

        yield put(configsData());
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: configsError,
                },
            }),
        );
    }
}
