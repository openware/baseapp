// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { alertPush } from '../../../../modules/public/alert';
import {
    BeneficiariesCreate,
    beneficiariesCreateData,
    beneficiariesCreateError,
} from '../actions';

const config: RequestOptions = {
    apiVersion: 'peatio',
};

export function* beneficiariesCreateSaga(action: BeneficiariesCreate) {
    try {
        const payload = yield call(API.post(config), '/account/beneficiaries', action.payload);
        yield put(beneficiariesCreateData(payload));
        yield put(alertPush({message: ['success.beneficiaries.created'], type: 'success'}));
    } catch (error) {
        yield put(beneficiariesCreateError(error));
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
