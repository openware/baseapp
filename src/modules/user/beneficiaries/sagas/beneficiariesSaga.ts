import { call, put } from 'redux-saga/effects';
import { sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { buildQueryString } from '../../../../helpers';
import { beneficiariesData, beneficiariesError, BeneficiariesFetch } from '../actions';

const config: RequestOptions = {
    apiVersion: 'peatio',
};

export function* beneficiariesSaga(action: BeneficiariesFetch) {
    try {
        let params = '';
        if (action.payload) {
            params = `?${buildQueryString(action.payload)}`;
        }
        const beneficiaries = yield call(API.get(config), `/account/beneficiaries${params}`);

        yield put(beneficiariesData(beneficiaries));
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: beneficiariesError,
            },
        }));
    }
}
