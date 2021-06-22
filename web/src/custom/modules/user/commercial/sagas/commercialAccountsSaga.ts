import { call, put } from 'redux-saga/effects';
import { sendError } from 'src/modules';
import { API, RequestOptions } from '../../../../../api';
import {
    CommercialAccountsFetch,
    commercialAccountsData,
    commercialAccountsError,
} from '../actions';

const apiOptions: RequestOptions = {
    apiVersion: 'barong',
};

export function* commercialAccountsSaga(action: CommercialAccountsFetch) {
    try {
        const { page, limit, keyword } = action.payload;
        const accounts = yield call(API.get(apiOptions), `/commercial/accounts?page=${page + 1}&limit=${limit}&keyword=${keyword}`);
        yield put(commercialAccountsData(accounts));
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: commercialAccountsError,
            },
        }));
    }
}
