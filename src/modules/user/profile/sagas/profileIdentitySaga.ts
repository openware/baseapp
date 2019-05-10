// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import {
    profileIdentityData,
    profileIdentityError,
} from '../actions';

const userOptions: RequestOptions = {
    apiVersion: 'barong',
};

export function* profileIdentitySaga() {
    try {
        const profileIdentity = yield call(API.get(userOptions), '/resource/profiles/me');
        yield put(profileIdentityData(profileIdentity));
    } catch (error) {
        yield put(profileIdentityError(error));
    }
}
