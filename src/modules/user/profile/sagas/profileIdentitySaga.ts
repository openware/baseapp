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
        const profilePhone = yield call(API.get(userOptions), '/resource/phones');
        const profileIdentity = yield call(API.get(userOptions), '/resource/profiles/me');
        profileIdentity.number = profilePhone.filter(w => w.validated_at)[0].number;
        yield put(profileIdentityData(profileIdentity));
    } catch (error) {
        yield put(profileIdentityError(error));
    }
}
