import { call, put } from 'redux-saga/effects';
import { sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { configsData, configsError } from '../actions';
import { marketsData, setCurrentMarketIfUnset } from '../../markets';
import { currenciesData } from '../../currencies';
import { blockchainsData } from '../../blockchains';

const configsOptions: RequestOptions = {
    apiVersion: 'peatio',
};

export function* getConfigsSaga() {
    try {
        const { markets, currencies, blockchains } = yield call(API.get(configsOptions), '/public/config');

        yield put(marketsData(markets));
        yield put(currenciesData(currencies));
        yield put(blockchainsData(blockchains));

        if (markets.length) {
            yield put(setCurrentMarketIfUnset(markets[0]));
        }

        yield put(configsData());
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: configsError,
            },
        }));
    }
}
