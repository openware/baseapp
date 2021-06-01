import { call, put } from 'redux-saga/effects';
import { sendError } from 'src/modules';
import { API, RequestOptions } from '../../../../api';
import {
    OrganizationAccountsFetch,
    organizationAccountsData,
    organizationAccountsError,
} from '../actions';

const apiOptions: RequestOptions = {
    apiVersion: 'barong',
};

export function* organizationAccountsSaga(action: OrganizationAccountsFetch) {
    try {
        const { page, limit, keyword } = action.payload;
        const accounts = yield call(API.get(apiOptions), `/organization/accounts?page=${page + 1}&limit=${limit}&keyword=${keyword}`);
        yield put(organizationAccountsData(accounts));
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: organizationAccountsError,
            },
        }));
    }
}
