// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { alertPush } from '../../../../modules/public/alert';
import {
    BeneficiariesDelete,
    beneficiariesDeleteData,
    beneficiariesDeleteError,
} from '../actions';

const config: RequestOptions = {
    apiVersion: 'peatio',
};

export function* beneficiariesDeleteSaga(action: BeneficiariesDelete) {
    try {

        yield call(API.delete(config), `/account/beneficiaries/${action.payload.id}`);
        yield put(beneficiariesDeleteData({ id: action.payload.id }));
        yield put(alertPush({message: ['success.beneficiaries.deleted'], type: 'success'}));
    } catch (error) {
        yield put(beneficiariesDeleteError(error));
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
